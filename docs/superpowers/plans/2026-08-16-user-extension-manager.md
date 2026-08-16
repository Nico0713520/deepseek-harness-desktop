# 用户扩展管理器实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在能力中心同样的版式中增加“我的扩展”，并只在当前 Mac 的 DSH_HOME 安装和管理三个测试扩展。

**Architecture:** DSH web 插件提供一个只允许访问用户扩展登记册的 HTTP API；React 客户端通过 fetch 读取这些记录，并复用能力中心的卡片、筛选和详情视觉。用户扩展数据保存在 DSH_HOME，仓库和发布包只包含代码，不包含任何个人扩展数据。

**Tech Stack:** Electron、DeepSeek Harness Cordis `webServer`、React 18、TypeScript 6、CSS Modules、Vitest、Testing Library、pnpm。

## Global Constraints

- 只显示 `managedBy: whale-extension-center` 的用户扩展。
- 不修改 DeepSeek Harness 官方预设、官方 UI 源码、会话、凭据或工作区。
- 当前 Mac 测试扩展写入 `$DSH_HOME`；发布包默认没有个人扩展。
- 删除操作必须校验路径位于用户扩展根目录内。
- Playwright MCP 启动失败不能阻塞 Harness 主界面。

### Task 1: Add the user-extension registry and API

**Files:**

- Create: `packages/dsh-creator-center/src/extensions.ts`
- Create: `packages/dsh-creator-center/src/extensions.test.ts`
- Modify: `packages/dsh-creator-center/src/index.ts`

**Interfaces:**

- `UserExtensionRecord`
- `loadUserExtensions(dshHome: string): UserExtensionRecord[]`
- `saveUserExtensions(dshHome: string, records: readonly UserExtensionRecord[]): void`
- `makeUserExtensionRoutes(dshHome: string): WebRoute[]`

- [ ] **Step 1: Write tests for filtering, empty fallback, and safe deletion**

Assert that malformed JSON returns an empty list, records from another owner are hidden, and a delete request outside `$DSH_HOME/skills` is rejected.

- [ ] **Step 2: Implement the minimal registry model**

Use atomic temp-file replacement. Normalize only records with string ids, titles, kinds, categories, summaries, repository URLs, local paths and the `whale-extension-center` owner marker.

- [ ] **Step 3: Implement GET, PATCH and DELETE routes**

Expose `GET /api/whale-creator-center/user-extensions`, `PATCH /api/whale-creator-center/user-extensions/:id` for `enabled`, and `DELETE /api/whale-creator-center/user-extensions/:id`. Reject unknown ids and unsafe paths with JSON errors.

- [ ] **Step 4: Register routes from the Cordis plugin**

Register all route disposers in `ctx.effect`, alongside the existing advisor status route.

- [ ] **Step 5: Run the focused route tests**

Run `pnpm --filter @whale-desktop/dsh-creator-center test -- src/extensions.test.ts` and expect all route safety tests to pass.

### Task 2: Add the “我的扩展” navigation entry

**Files:**

- Modify: `packages/dsh-creator-center/src/client/creator-navigation.ts`
- Create: `packages/dsh-creator-center/src/client/MyExtensionsSidebarAction.tsx`
- Create: `packages/dsh-creator-center/src/client/MyExtensionsSidebarAction.test.tsx`
- Modify: `packages/dsh-creator-center/src/client/index.ts`
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`

**Interfaces:**

- `CreatorRoute = 'chat' | 'creator-center' | 'my-extensions'`
- `CreatorNavigationController.openMyExtensions(): void`
- `MyExtensionsSidebarActionProps = { wide; expandSidebar; navigation }`

- [ ] **Step 1: Write failing navigation and sidebar tests**

Clicking the new action must publish `my-extensions`, call `expandSidebar` when collapsed, and expose the accessible label “我的扩展”.

- [ ] **Step 2: Implement the route and action**

Register a second `sidebar.primary.action` with order 20, directly after the existing ability-center action. Use the same `.sidebarEntry` styles and a small folder/stack icon.

- [ ] **Step 3: Run focused UI tests**

Run the navigation and sidebar tests before changing the main surface.

### Task 3: Build the ability-center-style extension page

**Files:**

- Create: `packages/dsh-creator-center/src/client/MyExtensions.tsx`
- Create: `packages/dsh-creator-center/src/client/MyExtensions.test.tsx`
- Create: `packages/dsh-creator-center/src/client/MyExtensionDetail.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenterSurface.tsx`
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`

**Interfaces:**

- `fetchUserExtensions(fetcher): Promise<UserExtensionRecord[]>`
- `MyExtensionsProps = { onBack; onOpenAbilityCenter? }`

- [ ] **Step 1: Write the empty-state and list tests**

Verify the same page title/search/filter structure as the ability hub, an empty state for zero records, three local test cards for the seeded fixture, and filtering by Skill/plugin and category.

- [ ] **Step 2: Implement data loading with a readable error state**

Fetch the DSH route with `cache: 'no-store'`, keep loading/error states explicit, and never insert built-in catalog items into this page.

- [ ] **Step 3: Implement the three-column card grid and detail replacement**

Use the existing ability-card proportions and design tokens. Card actions are visible and plain: “查看详情”, “打开 GitHub”, “删除扩展”. Detail replaces the grid so a click cannot appear to do nothing.

- [ ] **Step 4: Wire route rendering**

`CreatorCenterSurface` renders `CreatorCenter` for `creator-center` and `MyExtensions` for `my-extensions`; both share the same surface geometry and return-to-chat button.

- [ ] **Step 5: Run focused component tests**

Run `pnpm --filter @whale-desktop/dsh-creator-center test -- src/client/MyExtensions.test.tsx src/client/CreatorCenterSurface.test.tsx`.

### Task 4: Install the three extensions only into the current Mac profile

**Files outside the repository:**

- Modify: `$DSH_HOME/skills/brainstorming/SKILL.md`
- Modify: `$DSH_HOME/skills/frontend-design/SKILL.md`
- Modify: `$DSH_HOME/profiles/web/package.json`
- Modify: `$DSH_HOME/profiles/web/pnpm-lock.yaml`
- Modify: `$DSH_HOME/profiles/web/cordis.patch.yml`
- Create: `$DSH_HOME/whale-user-extensions.json`

- [ ] **Step 1: Copy the two existing local Skill sources**

Copy the current local `brainstorming` and `frontend-design` Skill documents into the DSH user Skill root and verify each has valid frontmatter and a non-empty body.

- [ ] **Step 2: Install local Playwright MCP dependencies**

Install the pinned local-only packages `@deepseek-ai/dsh-mcp-client@0.1.0-rc.6` and `@playwright/mcp@0.0.79` in the current web profile. Do not add either dependency to the repository package manifest.

- [ ] **Step 3: Add the user-owned MCP patch**

Add a `whale-user-playwright` entry to the local profile patch with stdio transport, server name `playwright`, the local MCP CLI path, headless mode, an empty environment map, a bounded tool timeout, and `failOnStartupError: false`.

- [ ] **Step 4: Write the local registry records**

Record the two Skills and Playwright MCP as `managedBy: whale-extension-center`, with categories, GitHub URLs, local paths, `enabled: true`, and an explicit `localTestOnly: true` marker.

- [ ] **Step 5: Restart and verify the live profile**

Stop the current development app, start it again, check the Skills are discovered and that the Playwright MCP failure/success state does not prevent the GUI from opening, then use the new page to delete one test Skill and confirm its file and record disappear.

### Task 5: Validate the release boundary

**Files:**

- Modify: `scripts/check-release-assets.mjs` only if a new repository asset accidentally needs an explicit exclusion
- Test: existing root release checks and creator-center tests

- [ ] **Step 1: Run package type checks and tests**

Run `pnpm --filter @whale-desktop/dsh-creator-center typecheck`, `pnpm --filter @whale-desktop/dsh-creator-center test`, and `pnpm run build`.

- [ ] **Step 2: Run release asset checks**

Run `pnpm run check:release-assets` and confirm no path under the user DSH_HOME is referenced by the built application.

- [ ] **Step 3: Build and open the latest desktop GUI**

Run the normal creator-center build, restart the Electron app, and verify sidebar placement, empty-state behavior, three test cards, detail navigation, GitHub links, and deletion.

## Self-review

- The UI reuses the existing ability-center card language instead of introducing a second visual system.
- Built-in DSH capabilities are excluded by an explicit owner marker, not by guessing package names.
- The local Playwright dependency and profile patch are outside the repository and cannot leak into the release package.
- All destructive operations are limited to user-owned extension paths and require a UI confirmation.
