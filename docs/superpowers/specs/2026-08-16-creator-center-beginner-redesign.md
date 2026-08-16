# Creator Center beginner redesign

**Date:** 2026-08-16  
**Status:** Ready for user review  
**Supersedes:** The layout, taxonomy, and catalog-delivery portions of `2026-08-15-creator-center-design.md`. Existing safety, managed-advisor, blank-session, and official-UI isolation rules remain in force.

## 1. Outcome

Replace the current developer-oriented Creator Center with a plain-language ability center. A first-time user must be able to start in either of two ways:

1. describe a problem in their own words;
2. browse a curated ability library.

Both routes end at the same review screen: what the ability does, what the user must provide, what the user receives, what it may access or change, and how to remove it. Technical terms such as Skill, Agent preset, workflow, plugin, Cordis, preset id, and raw creation prompt stay behind an `高级信息` disclosure.

## 2. Design reference

The user supplied a marketplace-style reference screenshot. Reuse only its information hierarchy:

- compact mode navigation at the top;
- search on the right;
- a horizontal `精选场景` strip;
- a separate filter/navigation row;
- a responsive card grid below.

Do not reuse its expert names, avatars, copy, color treatment, or assets.

## 3. Taxonomy source

OpenAI's current Solutions page separates `Departments`, `Use cases`, and `Industries`. This redesign uses the official `Industries` list for the industry axis and the official `Use cases` list for the ability-kind axis.

Source: [OpenAI Solutions for Business](https://openai.com/solutions/), reviewed 2026-08-16.

### 3.1 Industry axis

| Stable id | UI label | OpenAI label | Note |
|---|---|---|---|
| `financial-services` | 金融服务 | Financial services | Exact official category |
| `healthcare` | 医疗健康 | Healthcare | Exact official category |
| `life-sciences` | 生命科学 | Life sciences | Exact official category |
| `retail` | 零售与电商 | Retail | Chinese label clarifies that e-commerce belongs here |
| `government` | 政府与公共服务 | Government | Plain-language Chinese label |
| `education` | 教育 | Education | Exact official category |

`全部行业` is a filter reset, not a seventh industry. Cross-industry abilities carry multiple industry ids or no industry restriction.

### 3.2 Ability-kind axis

| Stable id | UI label | OpenAI use-case label | Beginner explanation |
|---|---|---|---|
| `coding` | 编程开发 | Coding | 写代码、检查问题、搭建工具 |
| `content-creation` | 内容创作 | Content creation | 写文案、报告、脚本和说明 |
| `research` | 资料研究 | Research | 搜集、比较并整理资料 |
| `agents` | 自动执行 | Agents | 按步骤执行任务、检查并提醒 |
| `data-analysis` | 数据分析 | Data analysis | 清洗数据、找规律、输出结论 |

`全部种类` is a filter reset. The visible axis never uses implementation types such as Skill or plugin.

OpenAI `Departments` are not a third filter in version one. Adding Finance, Sales, Marketing, Engineering, and other department filters would overload the first screen. Department metadata may be added to cards later without changing the two-axis API.

## 4. Page structure

### 4.1 Top utility row

Left navigation:

- `找能力` — active library and problem-description view;
- `Vibe Coding` — a curated coding column for building through natural-language collaboration;
- `创建指南` — jumps to the beginner guide section on the same page;
- `扩展原理` — jumps to the optional advanced explanation.

Right side:

- one search field with placeholder `搜索你想增加的能力`.

No `我的能力` entry is promised in version one because the desktop app does not yet have one reliable cross-type inventory spanning presets, Skills, workflows, plugins, and UI extensions.

`Vibe Coding` is a curated collection, not an industry and not a sixth ability kind. Its abilities still carry the official `coding` kind and their applicable industry ids, so the official two-axis taxonomy remains intact.

### 4.2 Dual-entry hero

The first content row is asymmetric: approximately 38% problem input and 62% featured scenarios.

#### Left: describe a problem

Title: `你希望 DeepSeek 帮你解决什么问题？`

Supporting copy: `不用知道插件或 Skill，像平时聊天一样描述就可以。`

Controls:

- multiline input;
- three rotating example chips drawn from the local catalog;
- primary button `帮我找适合的能力`;
- text action `让 AI 帮我定制`.

`帮我找适合的能力` uses the local recommendation endpoint and returns at most three catalog matches without opening a new conversation. `让 AI 帮我定制` opens the managed AI Extension Advisor using the existing blank-session and no-auto-send rules.

#### Right: featured scenarios

Heading: `精选场景`.

A horizontal strip contains three to five larger scene cards. Each scene card contains:

- one contextual background image or abstract illustration;
- a plain-language scenario name;
- two or three representative abilities;
- no avatars and no claims that an ability is a human expert.

The initial scenes may reuse current catalog coverage. Future libraries can add scenes through data only.

### 4.3 Vibe Coding column

Selecting `Vibe Coding` opens a focused collection using the same visual language as the ability library. It is designed for users who want to create or modify software by describing outcomes instead of starting from framework choices.

The opening copy is:

- title: `说出想法，让 DeepSeek 和你一起做出来`;
- supporting text: `不用先决定技术栈。先说清楚谁要用、解决什么问题、完成后是什么样。`;
- primary action: `描述我想做的东西`;
- secondary action: `从常见项目开始`.

The first curated groups are:

1. `从零做一个小工具` — turn a concrete need into a runnable first version;
2. `给现有项目加功能` — inspect the current project, propose a scoped change, then implement after confirmation;
3. `修复一个问题` — reproduce, diagnose, fix, and verify an existing bug;
4. `整理和改进代码` — make a bounded maintainability improvement without changing intended behavior;
5. `做出可以分享的版本` — add documentation, checks, packaging, and a release checklist;
6. `学习项目是怎么工作的` — explain the structure and create a guided first contribution.

Every Vibe Coding card states:

- what the user can say to begin;
- what project access is required;
- what the first milestone will be;
- when DeepSeek must stop for confirmation;
- how the user can run and verify the result.

The column never promises that a vague sentence becomes a production-ready application automatically. The flow must separate `先做可运行第一版`, `用户确认`, and `继续完善`.

### 4.4 Library section

Header:

- title `能力库`;
- result count, for example `找到 8 个能力`;
- optional sort control only after the catalog has meaningful popularity or recency data. Version one does not show fake `热门` or `最新` ordering.

Filter row one, `行业`:

- 全部行业;
- 金融服务;
- 医疗健康;
- 生命科学;
- 零售与电商;
- 政府与公共服务;
- 教育.

Filter row two, `种类`:

- 全部种类;
- 编程开发;
- 内容创作;
- 资料研究;
- 自动执行;
- 数据分析.

Industry, kind, and search combine with AND semantics. Selecting an industry does not reset the kind; selecting a kind does not reset the industry.

### 4.5 Ability cards

The grid uses three columns when the host provides enough width, two columns in the normal Settings dialog, and one column on narrow windows.

Every card answers only four beginner questions:

- name;
- one-sentence outcome;
- what the user supplies;
- what the user receives.

Footer tags show the localized industry and ability kind. Difficulty, duration, Skill, Agent preset, and plugin badges are removed from the collapsed card.

Card action: `查看方案`.

### 4.6 Ability detail

Opening a card shows an in-page detail sheet, not another modal. It preserves the user's search and filters.

Sections appear in this order:

1. `它会帮你完成什么`;
2. `你需要准备什么`;
3. `最后会得到什么`;
4. `它会读取或修改什么`;
5. `不想用了怎么关闭`;
6. `预计需要多久`.

Primary action: `让 DeepSeek 帮我创建`.

Secondary action: `先问 AI 是否适合我`.

Collapsed disclosure: `高级信息`, containing implementation type, guarded creation request, checks, source, and license metadata.

Raw prompts are never the default visual content.

## 5. Backend design

The Creator Center host plugin keeps the existing read-only advisor status route and adds three local same-origin routes.

### 5.1 `GET /api/whale-creator-center/catalog`

Returns:

```ts
interface CatalogResponse {
  version: string
  industries: Industry[]
  kinds: AbilityKind[]
  collections: Collection[]
  scenes: Scene[]
  abilities: PublicAbility[]
}
```

The server owns catalog validation and public serialization. The browser does not import the raw authoring records directly.

### 5.2 `POST /api/whale-creator-center/recommend`

Request:

```ts
{ problem: string }
```

Rules:

- reject blank input;
- cap input at 2,000 Unicode characters;
- never execute the input;
- perform deterministic local matching over titles, summaries, aliases, examples, industries, and kinds;
- return no more than three abilities;
- include a short, data-backed `reason` for each match;
- return `needsAdvisor: true` when confidence is low.

This endpoint is intentionally not branded as AI. It is stable local library search. Open-ended understanding remains the managed AI Advisor's responsibility.

### 5.3 `POST /api/whale-creator-center/create-request`

Request:

```ts
{
  abilityId: string
  userGoal?: string
}
```

The server validates the ability id, preserves the user's goal as quoted data, applies the existing creation guardrails, and returns:

```ts
{
  ability: PublicAbility
  review: {
    readsOrChanges: string
    rollback: string
    estimatedTime: string
  }
  guardedPrompt: string
}
```

The guarded prompt is used by the existing clipboard-plus-Creator flow but appears only under `高级信息`.

### 5.4 Ability authoring model

```ts
interface AbilityDefinition {
  id: string
  title: string
  outcome: string
  summary: string
  industryIds: IndustryId[]
  kindIds: AbilityKindId[]
  collectionIds: CollectionId[]
  aliases: string[]
  examples: string[]
  userProvides: string
  userReceives: string
  suitableFor: string
  readsOrChanges: string
  rollback: string
  estimatedTime: string
  implementation: {
    extensionTypes: ExtensionType[]
    goal: string
    checks: string[]
    source?: string
    license?: string
  }
}
```

The eight current templates migrate into this model. Future libraries add data records and optional scene membership without changing React components or route behavior.

The initial catalog defines `vibe-coding` as a built-in collection. A collection is editorial grouping only: it changes discovery and presentation, never permissions, implementation type, or safety rules.

## 6. Interaction flow

### 6.1 Problem route

```text
Describe problem
  → local recommendation returns up to three matches
  → user selects one or chooses AI customization
  → ability review sheet
  → create-request preview
  → clipboard succeeds
  → blank official Creator session opens
  → Settings closes only after preset selection succeeds
```

### 6.2 Library route

```text
Search or select industry/kind
  → ability grid filters without losing either axis
  → open review sheet
  → create-request preview
  → blank official Creator session opens
```

## 7. Language rules

Visible beginner wording:

- `能力`, not `扩展类型`;
- `让 DeepSeek 帮我创建`, not `复制提示词并开始创造`;
- `自动执行`, not `Agent`;
- `实现方式`, not `preset composition`;
- `它会读取或修改什么`, not `权限模型`;
- `不想用了怎么关闭`, not `rollback strategy`.

Technical vocabulary is allowed only inside `高级信息` and `扩展原理`.

## 8. Visual system

- Reuse official DSH theme variables and React/CSS Modules stack.
- Keep a white or softly blue-tinted background with one restrained blue accent.
- Avoid a generic purple AI gradient.
- Use stronger typography and more whitespace than the current page.
- Use one large featured row and a quieter card grid instead of giving every block equal visual weight.
- Keep whale artwork decorative and non-blocking; do not depend on prototype artwork for comprehension.
- Add hover, pressed, focus, loading, empty, and inline error states.
- Respect `prefers-reduced-motion`.

## 9. Failure and empty states

- Catalog unavailable: keep the problem input and AI Advisor entry, show `能力库暂时没有加载成功` with retry.
- No filter matches: show active filters, `没有找到完全匹配的能力`, reset action, and AI customization action.
- Low-confidence recommendation: say `库里没有完全匹配的能力`, then offer nearby abilities and AI customization.
- `cordis` unavailable: disable creation but preserve browsing and explanations; link the user to `设置 → Agent 预设` instructions.
- Advisor conflict or unavailable status: use the existing official Creator fallback.
- Clipboard or session failure: preserve the review sheet and guarded request, then provide retry.

## 10. Compatibility and maintenance

- Do not fork or edit official DeepSeek Harness chat source.
- Keep this feature inside `@whale-desktop/dsh-creator-center`.
- Do not change theme or pet APIs.
- Preserve existing blank-session preset selection and managed-advisor ownership checks.
- Treat the taxonomy and catalog API as versioned public package contracts.
- The layout must degrade cleanly when the official Settings dialog width changes.

## 11. Agreed test seams

The design defines three public seams for TDD:

1. **Host API seam:** catalog and collection schema, independent industry/kind filtering inputs, recommendation ranking, validation, and guarded create-request responses.
2. **Visible React seam:** dual entry, Vibe Coding collection, official taxonomy labels, combined filters, recommendation result, detail review, advanced disclosure, loading, empty, and error states.
3. **Session launch seam:** clipboard-before-launch, blank-session-only preset selection, missing `cordis`, advisor fallback, retry, and Settings close only after confirmed success.

Tests assert user-visible behavior and route responses, not private React state or helper implementation.

## 12. Acceptance criteria

- A first-time user can identify both starting routes within five seconds.
- No Skill, Agent preset, workflow, plugin, Cordis, or raw prompt appears in the default first screen.
- `Vibe Coding` appears as a dedicated top-level collection without becoming an industry or replacing the official `coding` ability kind.
- The Vibe Coding column distinguishes a runnable first version, user confirmation, and later refinement instead of promising one-shot production software.
- Industry and kind filters remain independent and combine correctly.
- Industry labels match OpenAI's official six-category Solutions taxonomy, with the documented Chinese localization.
- Ability-kind labels map to OpenAI's five official use cases using beginner wording.
- A card is understandable without opening `高级信息`.
- Selecting an ability and starting creation requires at most three deliberate actions.
- The user sees outcome, required input, access/change scope, and rollback before creation.
- The existing official Web UI, appearance settings, pets, and session history continue to work.
- Root tests, Creator Center tests, typecheck, package build, packaged smoke, and real UI verification pass.
