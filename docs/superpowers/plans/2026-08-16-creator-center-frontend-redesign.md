# Creator Center Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dense developer-facing Creator Center with a calm, beginner-readable ability marketplace that supports problem-first discovery, independent industry/kind filters, an in-page ability review, and a dedicated Vibe Coding collection.

**Architecture:** Keep the feature isolated inside `@whale-desktop/dsh-creator-center` and preserve its existing clipboard and blank-session launcher. Introduce a data-driven public ability model in the client for this frontend-first release, split visible UI into small React sections, and keep implementation terminology and guarded prompts inside an `高级信息` disclosure. Backend catalog routes remain deferred until the real library is supplied.

**Tech Stack:** React 18, TypeScript 6, CSS Modules, Vitest, Testing Library, existing DeepSeek Harness settings slot and session launcher.

## Global Constraints

- Do not modify or fork official DeepSeek Harness chat components.
- Do not change whale theme, wallpaper, pet, or session-history behavior.
- Do not add a UI framework, icon package, font download, or image dependency.
- Keep the catalog replaceable as data; seed entries are honest examples, not claims of a finished marketplace.
- Preserve clipboard-before-launch, no auto-send, missing-Cordis handling, retry, advisor fallback, and close-only-after-confirmed-launch.
- Visible default copy must avoid `Skill`, `Agent 预设`, `workflow`, `plugin`, `Cordis`, and raw prompts.

## Visual Blueprint

**Palette:** Ink `#172033`, Canvas `#F7F9FC`, Paper `#FFFFFF`, DeepSeek blue `#315FA8`, Mist `#EAF1FA`, Vibe accent `#D89B5B`.

**Type roles:** system sans for all Chinese copy; 26px/700 hero title, 18px/700 section title, 14px/650 card title, 13px/1.65 body, 11–12px utility labels. No decorative web font.

**Layout:**

```text
[ 找能力 | Vibe Coding | 创建指南 | 扩展原理 ]       [ 搜索能力 ]

[ 你希望解决什么问题？  ][ 精选场景 ───────────────────── ]
[ textarea                ][ 场景卡 ][ 场景卡 ][ 场景卡 → ]
[ 说问题 ─ 看方案 ─ 创建 ]

[ 能力库                                      找到 N 个 ]
[ 行业  全部 金融 医疗 生命科学 零售 政府 教育           ]
[ 种类  全部 编程 内容 研究 自动执行 数据分析             ]
[ 能力卡 ][ 能力卡 ][ 能力卡 ]
[             当前能力的内嵌详情面板                      ]
```

**Signature element:** one cobalt capability rail in the problem card (`说问题 → 看方案 → 开始创建`). It is the only visually assertive motif; all other surfaces use quiet borders, whitespace, and restrained shadows.

**Genericness critique:** marketplace avatar walls, gradient hero blobs, repeated pill badges, and equal-weight bordered boxes would make this look like a generic AI template gallery. Remove avatars, use scenario color fields instead of stock imagery, expose only two filter rows, and give the problem entry one dominant focal point.

**Aesthetic risk:** use an asymmetric 38/62 hero instead of a centered banner. This makes the two starting routes immediately legible while remaining stable at Settings-dialog widths; it collapses to one column below 760px.

---

## Task 1: Introduce the beginner-facing ability model

**Files:**

- Modify: `packages/dsh-creator-center/src/client/catalog.ts`
- Modify: `packages/dsh-creator-center/src/client/catalog.test.ts`
- Modify: `packages/dsh-creator-center/src/client/prompt.ts`
- Modify: `packages/dsh-creator-center/src/client/prompt.test.ts`

- [ ] **Step 1: Write failing taxonomy and combined-filter tests**

Add tests that require six official industry labels, five beginner ability-kind labels, a separate `vibe-coding` collection, AND filtering across search/industry/kind, and deterministic problem matching capped at three results.

```ts
expect(INDUSTRIES.map(item => item.label)).toEqual([
  '全部行业', '金融服务', '医疗健康', '生命科学', '零售与电商', '政府与公共服务', '教育',
])
expect(abilitiesFor({ industry: 'retail', kind: 'data-analysis', query: '' })
  .every(item => item.industryIds.includes('retail') && item.kindIds.includes('data-analysis'))).toBe(true)
expect(recommendAbilities('每天整理客户反馈')).toHaveLength(3)
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- catalog.test.ts prompt.test.ts`

Expected: FAIL because the new taxonomy, public card fields, and matching functions do not exist.

- [ ] **Step 3: Implement the smallest data model and seed catalog**

Create `IndustryId`, `AbilityKindId`, `CollectionId`, and `AbilityDefinition`. Migrate the current eight records so every card exposes `outcome`, `userProvides`, `userReceives`, `readsOrChanges`, `rollback`, and `estimatedTime`, while retaining technical implementation data for prompt generation.

```ts
export function abilitiesFor(filters: AbilityFilters): readonly AbilityDefinition[]
export function recommendAbilities(problem: string): readonly AbilityDefinition[]
export function collectionAbilities(collectionId: CollectionId): readonly AbilityDefinition[]
```

- [ ] **Step 4: Keep guarded prompt generation compatible with the new model**

Update `buildCreationPrompt` to read `template.implementation.goal/checks` without weakening any existing safety line.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- catalog.test.ts prompt.test.ts`

- [ ] **Step 6: Commit**

```bash
git add packages/dsh-creator-center/src/client/catalog.ts packages/dsh-creator-center/src/client/catalog.test.ts packages/dsh-creator-center/src/client/prompt.ts packages/dsh-creator-center/src/client/prompt.test.ts
git commit -m "refactor: add beginner ability catalog model"
```

---

## Task 2: Build the dual-entry shell and independent discovery controls

**Files:**

- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.tsx`
- Create: `packages/dsh-creator-center/src/client/AbilityLibrary.tsx`

- [ ] **Step 1: Replace old layout expectations with visible beginner behavior tests**

Cover top navigation, search, problem textarea, three featured scenarios, both filter rows, independent AND filtering, result count, empty reset, and absence of technical terms on the default screen.

```ts
expect(screen.getByRole('heading', { name: '你希望 DeepSeek 帮你解决什么问题？' })).toBeTruthy()
expect(screen.getByRole('navigation', { name: '创造中心导航' })).toBeTruthy()
expect(screen.queryByText('Agent 预设')).toBeNull()
```

- [ ] **Step 2: Run the component test and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx`

- [ ] **Step 3: Implement navigation, problem discovery, featured scenes, search, and filters**

Keep state in `CreatorCenter`; render catalog behavior in `AbilityLibrary`. `帮我找适合的能力` shows at most three local matches and never opens a session. `让 AI 帮我定制` keeps the existing advisor launch behavior.

- [ ] **Step 4: Preserve existing session-launch assertions**

Update selectors only where visible wording changes. Do not alter `SessionLauncher` or its tests.

- [ ] **Step 5: Run component and session tests and confirm GREEN**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx session-launcher.test.ts`

- [ ] **Step 6: Commit**

```bash
git add packages/dsh-creator-center/src/client/CreatorCenter.tsx packages/dsh-creator-center/src/client/CreatorCenter.test.tsx packages/dsh-creator-center/src/client/AbilityLibrary.tsx
git commit -m "feat: redesign creator discovery experience"
```

---

## Task 3: Add the in-page ability review and advanced disclosure

**Files:**

- Create: `packages/dsh-creator-center/src/client/AbilityDetail.tsx`
- Modify: `packages/dsh-creator-center/src/client/AbilityLibrary.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`

- [ ] **Step 1: Write failing user-visible review tests**

Assert that `查看方案` reveals outcome, preparation, result, access/change scope, rollback, and time; `高级信息` is collapsed by default; technical terminology and guarded prompt appear only after expansion.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx`

- [ ] **Step 3: Implement one full-width in-page review sheet**

The sheet retains active filters and search. Primary wording becomes `让 DeepSeek 帮我创建`; secondary wording becomes `先问 AI 是否适合我`. Existing clipboard and session launch logic remains the action backend.

- [ ] **Step 4: Confirm creation failure and fallback paths remain visible**

Retain missing-Cordis notice, advisor fallback, clipboard failure, ordinary creation retry, and Settings-close timing tests.

- [ ] **Step 5: Run the focused tests and confirm GREEN**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx session-launcher.test.ts prompt.test.ts`

- [ ] **Step 6: Commit**

```bash
git add packages/dsh-creator-center/src/client/AbilityDetail.tsx packages/dsh-creator-center/src/client/AbilityLibrary.tsx packages/dsh-creator-center/src/client/CreatorCenter.tsx packages/dsh-creator-center/src/client/CreatorCenter.test.tsx
git commit -m "feat: add beginner ability review flow"
```

---

## Task 4: Add the dedicated Vibe Coding and learning views

**Files:**

- Create: `packages/dsh-creator-center/src/client/VibeCodingColumn.tsx`
- Create: `packages/dsh-creator-center/src/client/CreatorGuide.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`

- [ ] **Step 1: Write failing navigation and content tests**

Require six Vibe Coding groups, the honest three-stage path (`先做可运行第一版`, `用户确认`, `继续完善`), a beginner guide, and an optional extension-principles view.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx`

- [ ] **Step 3: Implement lightweight view switching**

Use one top navigation and render one view at a time. Do not build nested settings, routing, or another modal. Vibe Coding groups reuse the ability detail action when a matching seed ability exists and otherwise route to problem description.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter.test.tsx`

- [ ] **Step 5: Commit**

```bash
git add packages/dsh-creator-center/src/client/VibeCodingColumn.tsx packages/dsh-creator-center/src/client/CreatorGuide.tsx packages/dsh-creator-center/src/client/CreatorCenter.tsx packages/dsh-creator-center/src/client/CreatorCenter.test.tsx
git commit -m "feat: add vibe coding and beginner guides"
```

---

## Task 5: Apply the calm visual system and verify the real host UI

**Files:**

- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`
- Modify if needed: `packages/dsh-creator-center/src/client/*.tsx`

- [ ] **Step 1: Implement CSS tokens and responsive layout**

Use local CSS custom properties, asymmetric hero, horizontal featured strip, 3/2/1 ability grid, full-width selected detail, visible focus states, 44px touch targets where practical, and `prefers-reduced-motion`.

- [ ] **Step 2: Run the package gate**

Run:

```bash
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-creator-center typecheck
pnpm --filter @whale-desktop/dsh-creator-center build
```

Expected: all commands exit 0.

- [ ] **Step 3: Run the repository safety gate**

Run:

```bash
pnpm test
pnpm run smoke:packaged
```

Expected: existing desktop, theme, pet, and launch tests remain green.

- [ ] **Step 4: Verify the live Settings view**

Open the local GUI, enter `设置 → 创造中心`, and check:

- both starting routes are visible without scrolling;
- default screen contains no implementation jargon;
- industry and kind filters remain independent;
- search and no-match reset work;
- review sheet stays in-page;
- advanced disclosure is collapsed initially;
- Vibe Coding shows six groups and the three-stage delivery path;
- 760px and narrower layouts collapse without horizontal page overflow;
- theme and pet settings still open.

Save one final screenshot to `docs/verification/creator-center-frontend-redesign.png` only if the repository already tracks UI verification images; otherwise report the live inspection without adding binary output.

- [ ] **Step 5: Self-review the implementation against the spec and types**

Check `git diff --check`, scan visible copy for forbidden default technical terms, confirm no unresolved placeholders or fake popularity data, and compare every acceptance criterion in `docs/superpowers/specs/2026-08-16-creator-center-beginner-redesign.md` against either a test or live verification note.

- [ ] **Step 6: Commit**

```bash
git add packages/dsh-creator-center/src/client/creator-center.module.css packages/dsh-creator-center/src/client
git commit -m "style: finish calm creator center interface"
```

---

## Deferred Until the Real Library Arrives

- host catalog, recommendation, and create-request routes;
- remote or community catalog synchronization;
- popularity, recency, ratings, author profiles, or `我的能力` inventory;
- final scene illustrations and third-party artwork;
- install-with-one-click behavior beyond the existing guarded Creator session.

The public `AbilityDefinition` data shape is the handoff point: future library content should be a data change plus validation tests, not a page redesign.
