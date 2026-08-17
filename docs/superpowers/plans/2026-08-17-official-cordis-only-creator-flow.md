# Official Cordis-Only Creator Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the cloned AI Extension Advisor preset and make every Extension Center guidance/creation action open DeepSeek Harness's official `cordis` Creator Mode.

**Architecture:** The Creator Center prepares one of two visible prompts, copies it, and delegates session creation exclusively to the existing `SessionLauncher` with preset id `cordis`. Desktop startup performs one narrowly-scoped migration that removes only the legacy preset directory carrying this application's exact ownership marker; the advisor host status route and cloned preset assets disappear.

**Tech Stack:** Electron 43, Node.js ESM, React 18, TypeScript 6, Vitest, Node test runner, pnpm, DeepSeek Harness `0.1.0-rc.6`.

## Global Constraints

- Do not modify or patch the official `cordis` preset.
- Do not automatically submit copied prompts as the user.
- Do not delete unmarked or foreign user preset directories.
- Keep unrelated Extension Center catalog and appearance changes untouched in the dirty worktree.
- Both supported desktop flows must use the literal preset id `cordis`.

---

### Task 1: Route Both Extension Center Actions Through Official Creator Mode

**Files:**
- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.tsx`

**Interfaces:**
- Consumes: `ClipboardPort.writeText(text: string): Promise<void>` and `CreatorLauncher.launch(presetId: string): void`.
- Produces: both detail-page actions copy a prompt and call `launcher.launch('cordis')`.

- [ ] **Step 1: Write the failing advisor-action test**

Replace the old advisor-preset expectation with:

```tsx
it('copies the advisor prompt before opening official Creator Mode', async () => {
  const order: string[] = []
  const kit = setup()
  kit.clipboard.writeText.mockImplementation(async () => { order.push('copy') })
  kit.launch.mockImplementation(() => { order.push('launch') })

  fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
  fireEvent.click(screen.getByRole('button', { name: '先问 AI 是否适合我' }))

  await vi.waitFor(() => expect(order).toEqual(['copy', 'launch']))
  expect(kit.launch).toHaveBeenCalledWith('cordis')
})
```

Update the ready-session test to publish `launchedPreset: 'cordis'`, and remove the fallback test that exists only for the cloned advisor.

- [ ] **Step 2: Run the focused test and confirm red**

Run:

```bash
pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx
```

Expected: FAIL because the advisor action currently launches `whale-extension-advisor` without copying.

- [ ] **Step 3: Implement the minimal UI change**

Remove `ADVISOR_PRESET_ID`, `advisorRequested`, and the advisor-specific fallback alert. Implement:

```tsx
const copyAndOpenCreator = async (prompt: string): Promise<void> => {
  if (!await copyOnly(prompt)) return
  launcher.clearError()
  setCloseOnLaunch(true)
  launcher.launch('cordis')
  setStatus('创建说明已准备好；进入创造会话后请粘贴并发送。')
}

const askAdvisor = (): void => {
  void copyAndOpenCreator(ADVISOR_FALLBACK_PROMPT)
}
```

Keep the existing official Creator Mode retry behavior.

- [ ] **Step 4: Run the focused test and confirm green**

Run the same Vitest command. Expected: all `CreatorCenter.test.tsx` tests pass.

---

### Task 2: Remove Client and Host Advisor-Preset Plumbing

**Files:**
- Modify: `packages/dsh-creator-center/src/client/index.test.ts`
- Modify: `packages/dsh-creator-center/src/client/index.ts`
- Modify: `packages/dsh-creator-center/src/index.ts`
- Delete: `packages/dsh-creator-center/src/client/advisor-status.ts`
- Delete: `packages/dsh-creator-center/src/client/advisor-status.test.ts`
- Delete: `packages/dsh-creator-center/src/status.ts`
- Delete: `packages/dsh-creator-center/src/status.test.ts`

**Interfaces:**
- Consumes: official Agent Preset seat `select(presetId: string): Promise<void>`.
- Produces: a generic launcher with no Desktop-specific preset authorization fetch or marker inspection; host registers only user-extension routes.

- [ ] **Step 1: Write the failing client registration expectation**

Change the integration test to launch `cordis` and assert no advisor network/read behavior:

```ts
injected.launcher.launch('cordis')
await vi.waitFor(() => {
  expect(noteAgentPreset).toHaveBeenCalledWith('blank-session', 'cordis')
})
expect(presetSelect).toHaveBeenCalledWith('cordis')
expect(apiRead).not.toHaveBeenCalled()
```

- [ ] **Step 2: Run the focused client test and confirm red**

Run:

```bash
pnpm --filter @whale-desktop/dsh-creator-center test -- index.test.ts
```

Expected: FAIL while the test still observes the advisor-only host checks or stale expectations.

- [ ] **Step 3: Remove the obsolete special case and status route**

Delete the `isManagedAdvisorHost` import, `ADVISOR_PRESET_ID`, `ADVISOR_MARKER`, and the special branch inside `selectPreset`. In the host entry, register only:

```ts
const userExtensionRoutes = makeUserExtensionRoutes(process.env.DSH_HOME ?? join(homedir(), '.dsh'))
host.effect(() => {
  const disposers = userExtensionRoutes.map(item => host.webServer.register(item))
  return () => { for (const dispose of disposers) dispose() }
}, 'whale-creator-center: user extension routes')
```

Delete the now-unreferenced advisor status modules and tests.

- [ ] **Step 4: Run package tests and typecheck**

Run:

```bash
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-creator-center typecheck
```

Expected: both commands pass.

---

### Task 3: Replace Preset Provisioning With Marker-Safe Legacy Cleanup

**Files:**
- Create: `src/advisor-preset-cleanup.js`
- Create: `test/advisor-preset-cleanup.test.js`
- Modify: `src/main.js`
- Delete: `src/advisor-preset-provisioner.js`
- Delete: `test/advisor-preset-provisioner.test.js`

**Interfaces:**
- Produces: `removeManagedAdvisorPreset({ dshHome }): Promise<{ status: 'absent' | 'removed' | 'preserved' | 'failed'; error?: string }>`.
- Consumes: the legacy `.whale-managed.json` marker with owner `deepseek-harness-whale-desktop`, id `whale-extension-advisor`, schema `1`.

- [ ] **Step 1: Write failing cleanup tests**

Cover four public outcomes:

```js
assert.equal((await removeManagedAdvisorPreset({ dshHome })).status, 'absent')
assert.equal((await removeManagedAdvisorPreset({ dshHome: managedHome })).status, 'removed')
assert.equal(await exists(managedTarget), false)
assert.equal((await removeManagedAdvisorPreset({ dshHome: unmarkedHome })).status, 'preserved')
assert.equal(await readFile(unmarkedFile, 'utf8'), 'user owned\n')
```

Add a foreign-marker case and expect `preserved`.

- [ ] **Step 2: Run the Node test and confirm red**

Run:

```bash
node --test test/advisor-preset-cleanup.test.js
```

Expected: FAIL because `src/advisor-preset-cleanup.js` does not exist.

- [ ] **Step 3: Implement marker-safe cleanup**

Implement only the exact managed directory removal:

```js
export async function removeManagedAdvisorPreset({ dshHome }) {
  const target = path.join(dshHome, '.agent-presets', LEGACY_ADVISOR_PRESET_ID)
  try {
    if (!await exists(target)) return { status: 'absent' }
    if (!await hasManagedMarker(target)) return { status: 'preserved' }
    await rm(target, { recursive: true, force: true })
    return { status: 'removed' }
  } catch (error) {
    return { status: 'failed', error: error instanceof Error ? error.message : String(error) }
  }
}
```

In `launch()`, call it before starting DSH, log only `preserved` or `failed`, and remove `WHALE_ADVISOR_MANAGED` plus all source/Skill resolver calls.

- [ ] **Step 4: Run Node tests and confirm green**

Run:

```bash
node --test test/*.test.js
```

Expected: all desktop Node tests pass.

---

### Task 4: Remove Bundled Advisor Assets and Update Packaged Smoke Coverage

**Files:**
- Modify: `packages/dsh-creator-center/package.json`
- Modify: `scripts/smoke-packaged.mjs`
- Delete: `packages/dsh-creator-center/advisor/SKILL.md`
- Delete: `packages/dsh-creator-center/advisor/knowledge/catalog.md`
- Delete: `packages/dsh-creator-center/advisor/knowledge/decision-tree.md`

**Interfaces:**
- Consumes: packaged app resources and a temporary `DSH_HOME`.
- Produces: a packaged app with no cloned advisor preset or advisor-status endpoint dependency.

- [ ] **Step 1: Make the smoke test reject legacy preset creation**

Remove provisioning/status assertions and add:

```js
if (existsSync(path.join(runtimeHome, '.agent-presets', 'whale-extension-advisor'))) {
  throw new Error('Packaged app recreated the removed AI Extension Advisor preset')
}
```

- [ ] **Step 2: Remove bundled advisor files**

Remove `advisor` from the package `files` list, change its description to `Beginner Extension Center for DeepSeek Harness Desktop.`, and delete the three unused files.

- [ ] **Step 3: Build generated package output**

Run:

```bash
pnpm --filter @whale-desktop/dsh-creator-center build
```

Expected: generated `lib` files contain no `whale-extension-advisor`, `WHALE_ADVISOR_MANAGED`, or advisor-status URL.

- [ ] **Step 4: Run full validation**

Run:

```bash
pnpm test
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-creator-center typecheck
pnpm run pack
PACKAGED_APP_PATH="$PWD/dist/mac-arm64/DeepSeek Harness Desktop.app" pnpm run smoke:packaged
```

Expected: all commands pass and the packaged Web UI responds successfully.

- [ ] **Step 5: Perform the real UI regression check**

Start the freshly packed app and verify:

1. Settings → Agent Presets contains only official built-in modes unless the user added unrelated presets.
2. `Ask DeepSeek if this suits me` enters official Creator Mode after copying the advisor prompt.
3. `Let DeepSeek create it` enters official Creator Mode after copying the creation prompt.
4. Repeating the two actions in either order never shows `Service is already registered`.

