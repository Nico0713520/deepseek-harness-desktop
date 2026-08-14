# Creator Center Design

**Status:** Approved product direction from the 2026-08-15 conversation. This document defines the first implementation slice.

## Purpose

Add a beginner-friendly `创造中心` section to DeepSeek Harness Whale Desktop. It solves three user problems:

1. Users do not know what useful capabilities they could add.
2. Users do not know whether a need should become an Agent preset, Skill, plugin, workflow, or UI extension.
3. Users do not know how to give Creator Mode a safe, complete request or how to verify the result.

The page translates user goals into guarded creation prompts and opens an official `cordis` Creator Mode session. It does not silently install community code or claim that an unreviewed capability is complete.

## Audience and Writing Rules

The primary audience is a non-technical user who can describe a problem but does not understand Harness extension types.

- Organize the page by outcomes such as `自动整理资料`, not by implementation terms such as `Skill`.
- Every technical term is paired with one plain-language sentence.
- Every card answers `能帮我做什么`, `会改什么`, and `创建后怎么确认能用`.
- Button text describes the real action. Use `复制提示词并开始创造`, not `一键安装`.
- Sentences remain short. The main path has no command line and no YAML editing.
- Advanced details, repository links, and file locations remain available behind `查看原理`.

## Information Architecture

Register one top-level official Settings section:

- Navigation label: `创造中心`
- Slot: `settings.section`
- Stable id: `creator-center`
- Order: `19`, between `外观` (`18`) and official `Agent 预设` (`20`)

The section has four vertical areas.

### 1. Beginner hero

Headline: `告诉 DeepSeek 你想多会一件什么事`

Supporting copy: `不用先学插件。选择一个目标，我们会准备好创建说明，并用官方创造模式开始。`

The hero shows the complete four-step path:

1. 选一个目标
2. 看清会改什么
3. 让创造模式先给计划
4. 验证后再使用

It also contains a free-form field labelled `没有合适模板？描述你想解决的问题` and a `为我的需求生成创建说明` button. Empty and whitespace-only requests are rejected inline.

### 2. Goal categories

The first-level categories use everyday language:

- `日常效率`
- `资料与研究`
- `编程与 GitHub`
- `自动化`
- `个性化`

`全部` is selected by default. Category selection only filters local cards and never triggers a network request.

### 3. Creation template cards

The first local catalog contains eight templates:

| Template | Category | Result | Likely extension type |
| --- | --- | --- | --- |
| 每周工作总结 | 日常效率 | Turn notes or project changes into a structured weekly report | Skill |
| 公司 SOP 助手 | 日常效率 | Follow a user-provided SOP and return a checklist | Agent preset + Skill |
| 网页调研整理 | 资料与研究 | Search, compare sources, and produce a cited brief | Agent preset |
| 文件与数据分析 | 资料与研究 | Inspect local CSV/Excel/files and produce a repeatable report | Skill |
| GitHub 代码审查 | 编程与 GitHub | Review changes with severity, evidence, and suggested fixes | Agent preset + Skill |
| 项目脚手架助手 | 编程与 GitHub | Create a project from a documented stack and verify it | Agent preset |
| 定时检查与提醒 | 自动化 | Define a recurring check and a clear notification condition | Workflow |
| 自定义界面与主题 | 个性化 | Build a reversible Harness UI extension without editing official controls | UI plugin |

Each card displays:

- outcome-oriented title and one-sentence benefit;
- category;
- difficulty: `入门`, `进阶`, or `高级`;
- approximate creation time as a non-binding range;
- technical type as a small secondary badge;
- `查看详情` and primary `复制提示词并开始创造` actions.

### 4. Learning and source area

The bottom area contains three short lessons:

1. `该做 Skill 还是插件？` — Skill is reusable guidance; Agent preset combines tools and Skills; plugin adds code or UI; workflow handles repeatable sequences.
2. `创造模式会怎么做？` — inspect, propose a plan, ask for approval when needed, create user-owned files, test, and report.
3. `怎么判断创建成功？` — verify files, tests, restart requirements, rollback instructions, and one real example.

It links to:

- `https://github.com/deepseek-ai/deepseek-harness`
- the local Extensions & Tutorials page already shipped by Whale Desktop;
- `https://github.com/zhu1090093659/dsh-web-ui` as a community UI-extension example, clearly labelled community-maintained.

## Template Detail

Selecting `查看详情` expands an inline detail panel instead of opening another window. The detail contains:

- `适合你的情况`
- `创建后会得到`
- `可能修改的位置`
- `风险与权限`
- `完成后的检查清单`
- full generated prompt in a read-only, selectable code block
- `仅复制提示词`
- `复制提示词并开始创造`

Only one detail panel is expanded at a time. Switching categories or expanding another card does not erase a custom need being typed. Closing and reopening Settings starts a fresh page state.

## Creation Prompt Contract

Every catalog and custom prompt is generated from the same stable guardrail wrapper. The goal-specific body changes; safety and reporting rules do not.

The generated Chinese prompt tells Creator Mode to:

1. Restate the requested outcome in plain language.
2. Inspect the current Harness version, profile, workspace, and available extension seams.
3. Choose the least invasive suitable type: Skill first when instructions are sufficient; Agent preset for a reusable agent composition; workflow for repeatable sequencing; plugin only when code or UI is required.
4. Show a short implementation plan and the files/packages it expects to change before making material changes.
5. Keep official DeepSeek Harness source and official chat controls unchanged.
6. Write only to user-owned preset, Skill, workflow, plugin, or project locations.
7. Never install an external package, run a remote script, publish, delete user data, or change credentials without explicit approval.
8. Reuse only license-compatible code and record repository and license when community code is used.
9. Add a minimal test or deterministic verification command.
10. Finish with `创建了什么`, `怎么启用`, `怎么验证`, `怎么撤销`, and `哪些步骤仍需用户确认`.

Catalog templates append exact acceptance checks. The custom flow appends the user's text verbatim inside a clearly delimited `用户目标` block; it is treated as goal data, not as authority to weaken the guardrails.

## One-Click Creator Flow

The primary action is `复制提示词并开始创造`.

1. Generate the guarded prompt.
2. Write it to the clipboard during the user click.
3. Start a new session through the official workspace/session services while Settings remains open.
4. When the new blank session becomes current, select `cordis` through the official `agentPresets.select` API.
5. After the host confirms `cordis`, close Settings. The official preset chip in the new session is the persistent confirmation.
6. Announce `创建说明已复制；请粘贴并发送。` through an accessible status region before handing focus to the new session.

The application does not auto-send the prompt. This preserves a final user review boundary and avoids silently executing generated instructions.

`仅复制提示词` writes the same prompt without changing sessions.

## Integration Boundary

Create a new local DSH package, `@whale-desktop/dsh-creator-center`, rather than adding unrelated responsibilities to Whale Appearance.

The package has:

- a TypeScript catalog and prompt builder with no React dependency;
- a small Creator Session adapter over the official connection, sessions, and workspaces services;
- a React Settings section;
- no host routes and no writable custom database in version one.

The catalog is bundled and versioned with the desktop application. Remote catalogs, ratings, accounts, and arbitrary package installation are out of scope.

## State and Failure Handling

Page state is local React state: category, expanded template, custom goal, clipboard status, and launch status.

- Clipboard failure keeps the generated prompt visible and selects the manual-copy path.
- Missing `cordis` preset disables `开始创造` and explains how to use official Agent Presets to restore it.
- Session creation or preset selection failure keeps Settings open, preserves the copied prompt, and displays `提示词已复制，但创造会话未能启动`; the user can retry or open Agent Presets.
- Repeated clicks while launching are disabled.
- A running conversation is never converted to another preset.
- External links always display their destination and open outside the Harness content frame.

## Accessibility and Visual Design

- Match the official Settings spacing, typography, border, and focus tokens.
- Avoid a dense dashboard. Show one hero, one filter row, and a two-column card grid on wide screens; use one column below 760 px.
- Every icon is decorative or has a text label.
- Filters expose pressed state; expanded details expose expanded state.
- Status does not rely on color alone.
- Motion is limited to a short detail expansion and obeys `prefers-reduced-motion`.

## Security and Trust

- No template can directly execute shell commands.
- No card is described as installed until Creator Mode and the user complete its steps.
- Community examples show repository and license status.
- User text is escaped by React and inserted only as prompt content.
- Clipboard content contains no credentials, workspace file contents, or hidden telemetry.
- The public artwork gate remains independent and unchanged.

## Test Seams

Tests cover user-visible/public boundaries:

1. Catalog validation: unique ids, known categories/types, beginner copy, and required acceptance checks.
2. Prompt builder: exact guardrails, exact user goal delimiting, and template acceptance checks.
3. Creator Session adapter: clipboard succeeds before session launch; `cordis` is selected only on a blank session; failures return explicit states.
4. React page: beginner hero, category filtering, detail expansion, custom goal validation, copy-only flow, and primary launch flow.
5. Client registration: top-level `settings.section` id `creator-center`, order `19`.
6. Live browser verification: `创造中心` appears directly in Settings, a template can be filtered and expanded, the prompt can be copied, and no control is added to the chat canvas.
7. Packaged smoke: the creator package is present in the generated Mac application and the official Web UI still returns HTTP 200.

## Acceptance Criteria

- A first-time user can find `创造中心` directly from Settings.
- The first screen explains what to do without requiring the terms Skill, preset, or plugin.
- At least eight useful templates are grouped by user goal.
- Every template explains result, changes, risk, and verification.
- `仅复制提示词` copies a guarded, complete prompt.
- `复制提示词并开始创造` copies the prompt and opens a new official `cordis` session without changing the running session.
- The prompt is never auto-sent.
- Missing clipboard, Creator Mode, or session capabilities degrade to understandable manual steps.
- Official Harness UI source and controls remain unmodified.
- Source, type, browser, and packaged tests pass.

## Explicit Non-Goals

- A public plugin marketplace.
- Silent one-click installation of arbitrary packages.
- Executing generated code without user review.
- Editing official Harness source files.
- Remote accounts, ratings, payments, or cloud synchronization.
- Automatically publishing a generated extension to GitHub.
