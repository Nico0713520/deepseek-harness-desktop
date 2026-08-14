# Creator Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a beginner-friendly Creator Center to Settings with dual catalog classification, guarded creation prompts, one-click official Creator Mode launch, and a knowledgeable AI Extension Advisor conversation.

**Architecture:** Add one independent DSH bundle, `@whale-desktop/dsh-creator-center`, containing the local catalog, pure prompt builder, session launcher, Settings UI, and a read-only provisioning-status route. Before DSH starts, the Electron launcher derives a Whale-managed advisor preset from the pinned official `cordis` preset, changes only its persona/metadata, and adds a bundled knowledge Skill under the Harness user preset root. The client selects it only when the desktop host confirms that this launch provisioned the managed preset. Official source, official presets, and official chat controls remain untouched.

**Tech Stack:** TypeScript 6, React 18, CSS Modules, Vitest/Testing Library, Node.js 26 test runner, Electron 43, pnpm 11, DeepSeek Harness `0.1.0-rc.6` DSH client services.

## Global Constraints

- Register `创造中心` as `settings.section` id `creator-center`, order `19`.
- Default catalog browse mode is `按用途`; secondary mode is `按扩展类型`.
- The first release uses a local, versioned catalog; there is no remote marketplace or arbitrary package installer.
- Catalog creation prompts are copied but never auto-sent.
- `AI 扩展顾问` is visibly AI, asks at most three necessary questions, recommends at most three options, and does not mutate anything before explicit approval.
- Never edit the official shipped `standard`, `cordis`, `minimal`, or `code` presets.
- Never overwrite an unmarked user preset that occupies the advisor id.
- Agent preset selection applies only to a blank session.
- Official Harness UI source and official chat controls remain unmodified.
- Mac and Windows packages must contain the Creator Center bundle and advisor knowledge assets.

---

### Task 1: Creator package, catalog, and guarded prompt

**Files:**
- Create: `packages/dsh-creator-center/package.json`
- Create: `packages/dsh-creator-center/cordis.patch.yml`
- Create: `packages/dsh-creator-center/tsconfig.json`
- Create: `packages/dsh-creator-center/tsconfig.vitest.json`
- Create: `packages/dsh-creator-center/tsdown.config.ts`
- Create: `packages/dsh-creator-center/vitest.config.ts`
- Create: `packages/dsh-creator-center/src/index.ts`
- Create: `packages/dsh-creator-center/src/client/css-modules.d.ts`
- Create: `packages/dsh-creator-center/src/client/catalog.ts`
- Create: `packages/dsh-creator-center/src/client/catalog.test.ts`
- Create: `packages/dsh-creator-center/src/client/prompt.ts`
- Create: `packages/dsh-creator-center/src/client/prompt.test.ts`

**Interfaces:**
- Produces: `CREATOR_TEMPLATES: readonly CreatorTemplate[]`.
- Produces: `USE_CATEGORIES`, `EXTENSION_TYPES`, and `templatesFor(mode, filter)`.
- Produces: `buildCreationPrompt({ goal, template }): string`.

- [ ] **Step 1: Write catalog tests that fail before the package exists**

```ts
expect(new Set(CREATOR_TEMPLATES.map(item => item.id)).size).toBe(8)
expect(templatesFor('type', 'skill').map(item => item.id)).toContain('weekly-report')
expect(templatesFor('use', 'research').map(item => item.id)).toContain('web-research')
```

- [ ] **Step 2: Run the focused tests and verify red**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- catalog.test.ts`

Expected: FAIL because the workspace package and catalog module do not exist.

- [ ] **Step 3: Implement the typed eight-item local catalog**

```ts
export type BrowseMode = 'use' | 'type'
export type UseCategory = 'daily' | 'research' | 'github' | 'automation' | 'personalization'
export type ExtensionType = 'agent-preset' | 'skill' | 'workflow' | 'plugin' | 'ui-extension'

export interface CreatorTemplate {
  readonly id: string
  readonly title: string
  readonly benefit: string
  readonly useCategory: UseCategory
  readonly extensionTypes: readonly ExtensionType[]
  readonly difficulty: '入门' | '进阶' | '高级'
  readonly duration: string
  readonly suitableFor: string
  readonly result: string
  readonly changes: string
  readonly risk: string
  readonly checks: readonly string[]
  readonly goal: string
}

export function templatesFor(mode: BrowseMode, filter: string): readonly CreatorTemplate[] {
  if (filter === 'all') return CREATOR_TEMPLATES
  return CREATOR_TEMPLATES.filter(item => mode === 'use'
    ? item.useCategory === filter
    : item.extensionTypes.includes(filter as ExtensionType))
}
```

Populate exactly the eight templates from the approved design: weekly report, company SOP, web research, file/data analysis, GitHub review, project scaffolding, scheduled checks, and custom UI/theme.

- [ ] **Step 4: Run the catalog test and verify green**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- catalog.test.ts`

Expected: PASS.

- [ ] **Step 5: Write prompt contract tests that fail**

```ts
const prompt = buildCreationPrompt({ goal: '把访谈整理成周报' })
expect(prompt).toContain('【用户目标开始】\n把访谈整理成周报\n【用户目标结束】')
expect(prompt).toContain('优先选择侵入性最低的扩展类型')
expect(prompt).toContain('不得修改 DeepSeek Harness 官方源码和官方聊天控件')
expect(prompt).toContain('怎么撤销')
```

- [ ] **Step 6: Run the prompt test and verify red**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- prompt.test.ts`

Expected: FAIL because `buildCreationPrompt` is absent.

- [ ] **Step 7: Implement one stable guardrail wrapper for template and custom goals**

```ts
export function buildCreationPrompt(input: { goal: string; template?: CreatorTemplate }): string {
  const goal = input.goal.trim()
  if (goal.length === 0) throw new Error('请先描述你想解决的问题')
  const checks = input.template?.checks.map(item => `- ${item}`).join('\n') ?? '- 用一个真实示例验证结果'
  return `请先作为 DeepSeek Harness 创造模式规划者工作。\n\n【用户目标开始】\n${goal}\n【用户目标结束】\n\n要求：\n1. 用普通话复述目标。\n2. 检查当前 Harness 版本、工作区和扩展接口。\n3. 优先选择侵入性最低的扩展类型：说明足够时先用 Skill，再考虑 Agent 预设或工作流，只有确实需要代码或界面时才用插件。\n4. 修改前先列出短计划、文件和权限。\n5. 不得修改 DeepSeek Harness 官方源码和官方聊天控件。\n6. 只写入用户自己的 preset、Skill、workflow、plugin 或项目目录。\n7. 未经明确确认，不安装外部包、不运行远程脚本、不发布、不删除用户数据、不修改凭据。\n8. 引用社区代码时记录仓库和许可证。\n9. 添加最小测试或确定性的验证命令。\n\n完成检查：\n${checks}\n\n最后报告：创建了什么、怎么启用、怎么验证、怎么撤销、哪些步骤仍需确认。`
}
```

- [ ] **Step 8: Run package tests and commit the slice**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test`

Expected: PASS.

Commit: `feat: add creator catalog and guarded prompts`

### Task 2: Whale-managed AI advisor preset

**Files:**
- Create: `packages/dsh-creator-center/advisor/SKILL.md`
- Create: `packages/dsh-creator-center/advisor/knowledge/catalog.md`
- Create: `packages/dsh-creator-center/advisor/knowledge/decision-tree.md`
- Create: `src/advisor-preset-provisioner.js`
- Create: `test/advisor-preset-provisioner.test.js`
- Modify: `src/main.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `ADVISOR_PRESET_ID = 'whale-extension-advisor'`.
- Produces: `provisionAdvisorPreset({ dshHome, sourcePresetDir, advisorSkillDir }): Promise<{status:'installed'|'updated'|'unchanged'|'conflict'|'failed'; error?:string}>`.
- Consumes: the installed official `@deepseek-ai/dsh/config/agent-presets/cordis` directory and bundled advisor Skill directory.

- [ ] **Step 1: Write provisioning behavior tests**

Use a temporary root and assert:

```js
assert.equal(first.status, 'installed')
assert.match(await readFile(join(target, 'preset.yml'), 'utf8'), /AI 扩展顾问/)
assert.match(await readFile(join(target, 'agent.cordis.yml'), 'utf8'), /whale-extension-advisor/)
assert.equal(second.status, 'unchanged')
assert.equal(unmarkedCollision.status, 'conflict')
assert.equal(await readFile(officialCordis, 'utf8'), originalOfficialCordis)
```

- [ ] **Step 2: Run the Node test and verify red**

Run: `node --test test/advisor-preset-provisioner.test.js`

Expected: FAIL because the provisioner is absent.

- [ ] **Step 3: Add the advisor Skill contract and knowledge files**

`SKILL.md` requires the advisor to identify itself as AI, ask at most three one-at-a-time questions, make one primary and at most two alternative recommendations, explain outcome/type/permissions/difficulty/rollback, and avoid mutation until explicit approval. The knowledge files contain the five extension definitions, the eight seed examples, guarded handoff format, official/community source labels, and update-safe locations.

- [ ] **Step 4: Implement safe derivation from the pinned official Cordis preset**

```js
export const ADVISOR_PRESET_ID = 'whale-extension-advisor'

function advisorPersona(source) {
  const start = source.indexOf('- id: persona')
  const end = source.indexOf('\n- id: agent-instructions', start)
  if (start < 0 || end < 0) throw new Error('official cordis persona boundary not found')
  const block = `- id: persona\n  name: '@deepseek-ai/dsh-persona'\n  config:\n    text: |-\n      You are the Whale Desktop AI Extension Advisor powered by {{model}}. Your working directory is {{cwd}}.\n      Identify yourself as AI. Before answering, load the whale-extension-advisor skill and follow it.\n      You inherit official Creator Mode capabilities, but remain advisory and read-only until the user explicitly approves creation.\n      Never edit shipped DeepSeek Harness presets or official UI source.\n      <!-- whale-extension-advisor -->\n`
  return source.slice(0, start) + block + source.slice(end)
}
```

Create a same-parent temporary directory, copy the official preset into it, replace only the persona block and display metadata, add the advisor Skill, and write `.whale-managed.json`. For an existing marked target, compare a deterministic SHA-256 content digest; replace it atomically only when changed. For an unmarked target, return `conflict`. On a failed swap, restore the previous marked directory.

- [ ] **Step 5: Run provisioning tests and verify green**

Run: `node --test test/advisor-preset-provisioner.test.js`

Expected: PASS, including official-source immutability and conflict cases.

- [ ] **Step 6: Provision the advisor before starting DSH**

In `src/main.js`, after bundled plugin links and before `startDshService`, resolve the official Cordis directory and bundled advisor directory, call `provisionAdvisorPreset`, pass its authoritative managed/unavailable outcome to the host environment, and log non-fatal `conflict`/`failed` states. The Creator Center exposes that outcome through one read-only same-origin route and fails closed before selecting the advisor. Add `@whale-desktop/dsh-creator-center` to root dependencies so its advisor files enter packaged `node_modules`.

- [ ] **Step 7: Run root tests and commit the slice**

Run: `node --test test/advisor-preset-provisioner.test.js test/plugin-provisioner.test.js`

Expected: PASS.

Commit: `feat: provision managed AI extension advisor`

### Task 3: Blank-session preset launcher

**Files:**
- Create: `packages/dsh-creator-center/src/client/session-launcher.ts`
- Create: `packages/dsh-creator-center/src/client/session-launcher.test.ts`

**Interfaces:**
- Produces: `SessionLauncher` with `subscribe`, `getSnapshot`, `launch(presetId)`, and `dispose`.
- Consumes: a public `SessionLaunchPort` with `sessions.getSnapshot/subscribe`, `startSession()`, and `selectPreset(sessionId, presetId)`.

- [ ] **Step 1: Write public-seam tests for blank-session-only selection**

```ts
await launcher.launch('cordis')
expect(port.startSession).toHaveBeenCalledOnce()
port.publish({ current: 'new', byId: { new: { id: 'new', blank: true } } })
expect(port.selectPreset).toHaveBeenCalledWith('new', 'cordis')
```

Also assert a nonblank current session is never selected, a reused blank session is selected, double-clicks coalesce, and an RPC error becomes a user-facing snapshot error.

- [ ] **Step 2: Run the focused test and verify red**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- session-launcher.test.ts`

Expected: FAIL because `SessionLauncher` is absent.

- [ ] **Step 3: Implement the root-lifetime staged launcher**

```ts
export interface LaunchSnapshot { busy: boolean; error: string | null; launchedPreset: string | null }

export class SessionLauncher {
  launch(presetId: string): void {
    if (this.snapshot.busy) return
    this.pending = presetId
    this.publish({ busy: true, error: null, launchedPreset: null })
    this.port.startSession()
    void this.reconcile()
  }

  private async reconcile(): Promise<void> {
    const preset = this.pending
    const state = this.port.sessions.getSnapshot()
    const session = state.current === undefined ? undefined : state.byId[state.current]
    if (preset === undefined || session === undefined || !session.blank || this.applying) return
    this.applying = true
    try {
      await this.port.selectPreset(session.id, preset)
      this.pending = undefined
      this.publish({ busy: false, error: null, launchedPreset: preset })
    } catch (error) {
      this.pending = undefined
      this.publish({ busy: false, error: messageOf(error), launchedPreset: null })
    } finally {
      this.applying = false
    }
  }
}
```

Subscribe once at construction and keep the stage alive when no Workspace/session exists yet. `dispose` removes the subscription and prevents late publication.

- [ ] **Step 4: Run launcher tests and commit the slice**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- session-launcher.test.ts`

Expected: PASS.

Commit: `feat: launch blank creator sessions safely`

### Task 4: Beginner Creator Center Settings UI

**Files:**
- Create: `packages/dsh-creator-center/src/client/CreatorCenter.tsx`
- Create: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`
- Create: `packages/dsh-creator-center/src/client/creator-center.module.css`
- Create: `packages/dsh-creator-center/src/client/index.ts`
- Create: `packages/dsh-creator-center/src/client/index.test.ts`

**Interfaces:**
- Produces: `<CreatorCenter launcher={launcher} clipboard={clipboard} />`.
- Produces: DSH client `apply(ctx)` registering `settings.section` id `creator-center` order `19`.
- Consumes: Task 1 catalog/prompt APIs and Task 3 `SessionLauncher`.

- [ ] **Step 1: Write the first UI behavior test**

Render the component and assert the beginner headline, `按用途` default, eight cards, and visible `问 AI 扩展顾问`. Switch to `按扩展类型`, choose `Skill`, and assert only Skill-bearing cards remain.

- [ ] **Step 2: Run UI tests and verify red**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx`

Expected: FAIL because the component is absent.

- [ ] **Step 3: Implement the beginner page and detail disclosure**

Use local React state for browse mode, filter, expanded template, custom goal, and copy status. Render one hero, one segmented browse control, one filter row, and a two-column card grid. Expanding a card shows suitable situation, result, changes, risk, checks, the read-only generated prompt, `仅复制提示词`, and `复制提示词并开始创造`.

- [ ] **Step 4: Add copy and launch behavior tests**

Assert whitespace custom goals show `请先描述你想解决的问题`; copy-only writes the guarded prompt without launching; primary action writes before `launcher.launch('cordis')`; Advisor calls `launcher.launch('whale-extension-advisor')` without copying or auto-sending a message.

- [ ] **Step 5: Implement copy, Creator, and Advisor actions**

```ts
async function copyAndCreate(prompt: string): Promise<void> {
  await clipboard.writeText(prompt)
  launcher.launch('cordis')
  setStatus('创建说明已复制；请粘贴并发送。')
}

function askAdvisor(): void {
  launcher.launch('whale-extension-advisor')
  setStatus('已打开 AI 扩展顾问；请直接说你想解决的问题。')
}
```

If advisor launch reports a missing/broken/conflicting preset error, show the fallback button `复制顾问提问模板并打开创造模式`.

- [ ] **Step 6: Register the top-level Settings section and wire official services**

Build one root-lifetime launcher from `ctx.sessions.list`, `ctx.workspaces.startSession()`, and `ctx.get('connection').api.agentPresets.select`. Inject it into the section and dispose it with the client fiber. Register label `创造中心`, id `creator-center`, order `19`.

- [ ] **Step 7: Run the package test/build/typecheck and commit**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test && pnpm --filter @whale-desktop/dsh-creator-center typecheck && pnpm --filter @whale-desktop/dsh-creator-center build`

Expected: all PASS; `lib/index.js` and `lib/client.js` exist.

Commit: `feat: add beginner Creator Center settings`

### Task 5: Desktop integration and acceptance verification

**Files:**
- Modify: `src/plugin-provisioner.js`
- Modify: `test/plugin-provisioner.test.js`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `README.md`
- Modify: `scripts/check-release-assets.mjs`
- Modify: `test/release-assets.test.js`

**Interfaces:**
- Consumes: package `@whale-desktop/dsh-creator-center` and advisor resource directory.
- Produces: packaged Mac/Windows app with Creator Center linked into profile `web` and advisor knowledge present.

- [ ] **Step 1: Extend the feature-provisioning test and verify red**

```js
assert.deepEqual(BUNDLED_FEATURE_PACKAGES, [
  '@whale-desktop/dsh-whale-appearance',
  '@whale-desktop/dsh-creator-center',
])
```

Run: `node --test test/plugin-provisioner.test.js`

Expected: FAIL because Creator Center is not registered.

- [ ] **Step 2: Add Creator Center to bundled profile provisioning and release assets**

Add the package to `BUNDLED_FEATURE_PACKAGES`, root dependencies, workspace lockfile, and the release-asset gate. Update README development commands and describe the local-seed catalog plus future source expansion path.

- [ ] **Step 3: Run all automated checks**

Run: `pnpm install && pnpm test && pnpm --filter @whale-desktop/dsh-whale-appearance test && pnpm --filter @whale-desktop/dsh-creator-center test && pnpm --filter @whale-desktop/dsh-creator-center typecheck && pnpm --filter @whale-desktop/dsh-creator-center build && pnpm check:release-assets`

Expected: all PASS.

- [ ] **Step 4: Run the app and verify the public browser seams**

Run: `pnpm start`

Verify:

1. Settings shows `外观`, `创造中心`, then `Agent 预设`.
2. `按用途` and `按扩展类型` filter the same eight cards.
3. A custom goal produces a guarded prompt and copy-only does not change sessions.
4. Primary create opens a blank session whose chip becomes `创造模式`.
5. Advisor opens a blank session whose chip becomes `AI 扩展顾问（创造模式增强）`.
6. Official chat canvas has no new floating control.
7. Official Web UI still responds with HTTP 200.

- [ ] **Step 5: Run packaged smoke and commit**

Run: `pnpm pack && pnpm smoke:packaged`

Expected: PASS; generated app contains both Whale workspace packages and advisor knowledge files.

Commit: `feat: ship Creator Center in Whale Desktop`
