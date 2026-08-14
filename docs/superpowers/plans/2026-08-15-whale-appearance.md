# Whale Appearance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a locally bundled DeepSeek Harness plugin that exposes Whale Canvas and two selectable pets under Settings while leaving the official sidebar, header, and composer untouched.

**Architecture:** Add one TypeScript/React DSH bundle, `@whale-desktop/dsh-whale-appearance`, with a small Host service for persisted appearance state and static assets plus a Client surface for the settings card, scoped canvas layers, and the shell-overlay pet. Bundle it with the existing Electron app and install it into the exact `web` profile before `dsh web` starts.

**Tech Stack:** Electron 43, Node.js ESM, TypeScript 6, React 18, Cordis 4, DSH rc.6 UI slots, tsdown, Vitest/jsdom, Node test runner, electron-builder 26.

## Global Constraints

- Theme switching exists only under Settings; no chat-canvas toggle is added.
- The official sidebar, header, tabs, composer, model controls, and status bar receive no theme-owned attributes or inline styles.
- Prototype art is local-development-only and must be recorded as `redistribution: prototype-only`.
- The plugin must recover to the official UI if theme or pet rendering fails.
- The Capability Center and Skill tutorial UI are outside this plan.
- The package must work with `@deepseek-ai/dsh@0.1.0-rc.6` and React 18.

---

### Task 1: Workspace package and deterministic provisioning

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `src/plugin-provisioner.js`
- Modify: `test/plugin-provisioner.test.js`
- Create: `packages/dsh-whale-appearance/package.json`
- Create: `packages/dsh-whale-appearance/cordis.patch.yml`
- Create: `packages/dsh-whale-appearance/tsconfig.json`
- Create: `packages/dsh-whale-appearance/tsconfig.vitest.json`
- Create: `packages/dsh-whale-appearance/tsdown.config.ts`
- Create: `packages/dsh-whale-appearance/vitest.config.ts`
- Create: `shared/tsdown.client.ts`
- Create: `shared/web-platform.ts`

**Interfaces:**
- Consumes: DSH bundle patch format and `provisionBundledPlugin(options)`.
- Produces: package `@whale-desktop/dsh-whale-appearance` with `lib/index.js` and `lib/client.js`; `BUNDLED_FEATURE_PACKAGES` includes the settings group and appearance bundle.

- [ ] **Step 1: Write a failing provisioner test**

```js
test('provisions the settings group before whale appearance', () => {
  assert.deepEqual(BUNDLED_FEATURE_PACKAGES, [
    '@linxin666/dsh-web-ui-settings',
    '@whale-desktop/dsh-whale-appearance',
  ])
})
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test test/plugin-provisioner.test.js`

Expected: FAIL because the new package is not in the roster.

- [ ] **Step 3: Add the workspace package and build configuration**

The bundle patch must contain exactly:

```yaml
- insert:
    - id: whale-appearance
      name: '@whale-desktop/dsh-whale-appearance'
```

The package manifest must expose `lib/index.js`, `lib/client.js`, the patch, and `assets/**`; declare DSH client injection for runtime, locale, slots, layout, and settings; and declare React 18 as a peer.

- [ ] **Step 4: Replace the old bundled roster**

Use this order:

```js
export const BUNDLED_FEATURE_PACKAGES = [
  '@linxin666/dsh-web-ui-settings',
  '@whale-desktop/dsh-whale-appearance',
]
```

Resolve the workspace package through `import.meta.resolve` exactly like existing bundles.

- [ ] **Step 5: Install, build, and confirm GREEN**

Run: `pnpm install && pnpm --filter @whale-desktop/dsh-whale-appearance build && node --test test/plugin-provisioner.test.js`

Expected: package emits both bundle files and the test passes.

- [ ] **Step 6: Commit the vertical slice**

```bash
git add package.json pnpm-lock.yaml pnpm-workspace.yaml shared packages/dsh-whale-appearance src/plugin-provisioner.js test/plugin-provisioner.test.js
git commit -m "build: bundle whale appearance plugin"
```

### Task 2: Persisted Host appearance state and assets

**Files:**
- Create: `packages/dsh-whale-appearance/src/types.ts`
- Create: `packages/dsh-whale-appearance/src/persist.ts`
- Create: `packages/dsh-whale-appearance/src/persist.test.ts`
- Create: `packages/dsh-whale-appearance/src/service.ts`
- Create: `packages/dsh-whale-appearance/src/routes.ts`
- Create: `packages/dsh-whale-appearance/src/routes.test.ts`
- Create: `packages/dsh-whale-appearance/src/index.ts`

**Interfaces:**
- Produces: `WhaleAppearanceSettings`, `defaultSettings()`, `loadSettings(dir)`, `saveSettings(settings, dir)`, `AppearanceService.state()`, `AppearanceService.update(patch)`, API routes `/api/whale-appearance/state` and `/api/whale-appearance/config`.

- [ ] **Step 1: Write failing persistence examples**

```ts
expect(loadSettings(missingDir)).toEqual({
  themeEnabled: false,
  pet: 'off',
  petScale: 1,
  petPosition: { right: 24, bottom: 24 },
})
expect(sanitizeSettings({ pet: 'unknown', petScale: 99 })).toEqual(defaultSettings())
```

- [ ] **Step 2: Run persistence tests and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-whale-appearance test -- persist.test.ts`

Expected: FAIL because the public functions do not exist.

- [ ] **Step 3: Implement validated atomic persistence**

Use the exact public shape:

```ts
export type WhaleAppearanceSettings = {
  themeEnabled: boolean
  pet: 'off' | 'whale-maid' | 'abstract-whale'
  petScale: 0.8 | 1 | 1.2
  petPosition: { right: number; bottom: number }
}
```

Write `whale-appearance.json.tmp`, rename it to `whale-appearance.json`, and tolerate missing/corrupt files by returning defaults.

- [ ] **Step 4: Add route behavior tests**

Assert GET state returns a snapshot; POST config rejects unknown pet IDs and clamps coordinates to non-negative integers; asset routes allow only the fixed allowlist.

- [ ] **Step 5: Implement service, routes, and session activity mapping**

The state response is:

```ts
type AppearanceSnapshot = WhaleAppearanceSettings & {
  activity: 'idle' | 'thinking' | 'tool' | 'waiting' | 'completed' | 'failed'
}
```

Map `activity/status` events to the first five values and unknown/error events to `failed` without throwing.

- [ ] **Step 6: Run package tests and commit**

Run: `pnpm --filter @whale-desktop/dsh-whale-appearance test`

Expected: all persistence and route tests PASS.

```bash
git add packages/dsh-whale-appearance/src
git commit -m "feat: persist whale appearance settings"
```

### Task 3: Reversible scoped Whale Canvas

**Files:**
- Create: `packages/dsh-whale-appearance/src/client/theme.ts`
- Create: `packages/dsh-whale-appearance/src/client/theme.test.ts`
- Create: `packages/dsh-whale-appearance/src/client/whale-theme.module.css`
- Create: `packages/dsh-whale-appearance/src/client/css-modules.d.ts`

**Interfaces:**
- Produces: `applyWhaleCanvas(document): () => void` and `watchConversationCanvas(document): () => void`.

- [ ] **Step 1: Write a failing DOM seam test**

```ts
const dispose = applyWhaleCanvas(document)
expect(document.querySelector('[data-conversation-scroll] [data-whale-canvas]')).not.toBeNull()
expect(sidebar.attributes.length).toBe(1)
expect(composer.attributes.length).toBe(1)
dispose()
expect(document.querySelector('[data-whale-canvas]')).toBeNull()
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-whale-appearance test -- theme.test.ts`

- [ ] **Step 3: Implement one idempotent canvas owner**

Create the atmosphere, left-character, right-decoration, and reading-veil nodes only beneath `[data-conversation-scroll]`. A MutationObserver remounts them when sessions replace the scroll container. The returned disposer disconnects the observer and removes all nodes marked `data-whale-canvas`.

- [ ] **Step 4: Add denylist assertions**

Assert the code contains no selectors for `[data-pane='sidebar']`, `[data-composer-card]`, `[data-shell-header]`, or hashed class fragments.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm --filter @whale-desktop/dsh-whale-appearance test -- theme.test.ts
git add packages/dsh-whale-appearance/src/client
git commit -m "feat: add reversible whale canvas"
```

### Task 4: Settings-only appearance controls

**Files:**
- Create: `packages/dsh-whale-appearance/src/client/locales.ts`
- Create: `packages/dsh-whale-appearance/src/client/AppearanceSettingsCard.tsx`
- Create: `packages/dsh-whale-appearance/src/client/AppearanceSettingsCard.test.tsx`
- Create: `packages/dsh-whale-appearance/src/client/settings-card.module.css`
- Create: `packages/dsh-whale-appearance/src/client/index.ts`

**Interfaces:**
- Consumes: `/api/whale-appearance/state`, `/api/whale-appearance/config`, `applyWhaleCanvas`.
- Produces: one `web-ui.plugin.item` card with stable controls and immediate updates.

- [ ] **Step 1: Write the failing component behavior test**

Render the card with an injected controller and assert labels `鲸鱼主题`, `官方外观`, `鲸鱼女仆`, `抽象鲸鱼`, and `恢复官方外观`. Toggle the theme and assert one config update `{ themeEnabled: true }`.

- [ ] **Step 2: Run and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-whale-appearance test -- AppearanceSettingsCard.test.tsx`

- [ ] **Step 3: Implement the compact settings card**

Use a theme checkbox, three pet buttons, three scale buttons, reset-position, and restore-official action. Do not render any control into conversation slots.

- [ ] **Step 4: Register the card and live theme sync**

Register under `web-ui.plugin.item` with id `whale-appearance-settings`. Poll state only while the document is visible; apply or dispose Whale Canvas whenever `themeEnabled` changes.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm --filter @whale-desktop/dsh-whale-appearance test -- AppearanceSettingsCard.test.tsx
git add packages/dsh-whale-appearance/src/client
git commit -m "feat: add theme and pet settings"
```

### Task 5: Dual still-image pet in the shell overlay

**Files:**
- Create: `packages/dsh-whale-appearance/src/client/WhalePet.tsx`
- Create: `packages/dsh-whale-appearance/src/client/WhalePet.test.tsx`
- Create: `packages/dsh-whale-appearance/src/client/pet.module.css`
- Modify: `packages/dsh-whale-appearance/src/client/index.ts`

**Interfaces:**
- Consumes: `AppearanceSnapshot`.
- Produces: a `shell.overlay` registration named `whale-pet`, draggable pet, and activity class mapping.

- [ ] **Step 1: Write failing pet behavior tests**

Assert `whale-maid` chooses `/whale-appearance/assets/whale-maid.jpg`, `abstract-whale` chooses `/whale-appearance/assets/abstract-whale.jpg`, `off` renders nothing, and `completed` maps to the one-shot jump class.

- [ ] **Step 2: Run and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-whale-appearance test -- WhalePet.test.tsx`

- [ ] **Step 3: Implement the shell overlay component**

Use pointer capture for drag, clamp right/bottom to the viewport, save on pointer-up, and set `pointer-events: none` on the outer overlay with `pointer-events: auto` only on the pet.

- [ ] **Step 4: Implement reduced-motion-safe activity classes**

Provide breathing, sway, bob, pulse, jump, and tilt animations; disable looping motion under `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm --filter @whale-desktop/dsh-whale-appearance test -- WhalePet.test.tsx
git add packages/dsh-whale-appearance/src/client
git commit -m "feat: add selectable whale pets"
```

### Task 6: Prototype artwork, release gate, and packaged verification

**Files:**
- Create: `packages/dsh-whale-appearance/assets/prototype/whale-maid.jpg`
- Create: `packages/dsh-whale-appearance/assets/prototype/abstract-whale.jpg`
- Create: `packages/dsh-whale-appearance/assets/prototype/theme-reference.jpg`
- Create: `packages/dsh-whale-appearance/assets/provenance.json`
- Create: `scripts/check-release-assets.mjs`
- Create: `test/release-assets.test.js`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `THIRD_PARTY_NOTICES.md`

**Interfaces:**
- Produces: fixed asset routes and `pnpm check:release-assets`.

- [ ] **Step 1: Add a failing release-gate test**

The test loads `assets/provenance.json` and expects `checkReleaseAssets({ allowPrototype: false })` to reject every `prototype-only` entry with its exact file path.

- [ ] **Step 2: Copy the three supplied prototype images without modifying originals**

Record source filename, SHA-256, captured date, `redistribution: prototype-only`, and `publicRelease: false` for each copy.

- [ ] **Step 3: Implement the release gate**

`pnpm check:release-assets` fails unless `WHALE_ALLOW_PROTOTYPE_ASSETS=1`; local `start`, tests, and unpackaged development builds set no public-release claim. GitHub Release jobs must never set the override.

- [ ] **Step 4: Run full source verification**

Run: `pnpm test && pnpm --filter @whale-desktop/dsh-whale-appearance build && pnpm check:release-assets`

Expected: tests/build PASS; release-assets intentionally FAIL while prototype art remains.

- [ ] **Step 5: Provision into the real desktop profile and run packaged smoke**

Run the provisioner against `/Users/zhengdeweishi/Library/Application Support/DeepSeek Harness Whale Desktop/dsh`, verify the profile lists `@linxin666/dsh-web-ui-settings` and `@whale-desktop/dsh-whale-appearance`, then run `pnpm smoke:packaged`.

- [ ] **Step 6: Manually verify the visible contract**

Open Settings and confirm the card is visible; switch Whale Canvas on/off; select both pets; confirm the sidebar/header/composer stay official; restart and confirm persistence.

- [ ] **Step 7: Commit the completed slice**

```bash
git add packages/dsh-whale-appearance/assets scripts/check-release-assets.mjs test/release-assets.test.js package.json README.md THIRD_PARTY_NOTICES.md
git commit -m "feat: ship whale theme and dual pets"
```

