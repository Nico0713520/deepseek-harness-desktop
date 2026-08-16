# Extension Sidebar Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make “扩展中心” and “我的扩展” visually indistinguishable from native DeepSeek Harness sidebar actions while preserving their routes.

**Architecture:** Add two dependency-free React SVG icon components and consume them from the existing sidebar action components. Keep all button geometry and interaction styling in the existing CSS module so both actions share one native-style contract.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest, Testing Library

## Global Constraints

- Match the live native “新会话” button: 252×38px, 12px radius, 1px neutral border, 14px/22px/500 typography, 6px icon gap.
- Use white default background and neutral gray hover/current/focus states; no blue border or gradient.
- Use local inline SVG only; add no icon dependency and make no network request.
- Keep routes, labels, collapsed-sidebar behavior, and placement unchanged.

---

### Task 1: Native-style sidebar icons

**Files:**
- Create: `packages/dsh-creator-center/src/client/SidebarEntryIcons.tsx`
- Test: `packages/dsh-creator-center/src/client/CreatorCenterSidebarAction.test.tsx`
- Test: `packages/dsh-creator-center/src/client/MyExtensionsSidebarAction.test.tsx`

**Interfaces:**
- Produces: `ExtensionCenterIcon(): JSX.Element` and `MyExtensionsIcon(): JSX.Element`.
- Consumes: React SVG JSX only; no external package.

- [ ] **Step 1: Extend the component tests**

Assert that each wide action renders one `svg[aria-hidden="true"]`, keeps its visible label, and no longer contains the old `✦` or `◈` glyph.

- [ ] **Step 2: Verify the tests fail**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenterSidebarAction MyExtensionsSidebarAction`

Expected: FAIL because the current components still render character glyphs.

- [ ] **Step 3: Add the two SVG components**

Create two 16×16, `currentColor`, 1.5px stroke icons with rounded caps and joins. Mark each SVG `aria-hidden="true"` and `focusable="false"`.

- [ ] **Step 4: Replace the glyphs**

Import `ExtensionCenterIcon` into `CreatorCenterSidebarAction.tsx` and `MyExtensionsIcon` into `MyExtensionsSidebarAction.tsx`; render each inside the existing `sidebarEntryIcon` span.

- [ ] **Step 5: Verify component tests pass**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenterSidebarAction MyExtensionsSidebarAction`

Expected: both test files pass.

### Task 2: Native geometry and states

**Files:**
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css:31-54`

**Interfaces:**
- Consumes: existing `.sidebarEntry`, `.sidebarEntryActive`, `.sidebarEntryIcon`, and `.sidebarEntryLabel` classes.
- Produces: one shared visual contract for both sidebar actions.

- [ ] **Step 1: Match native spacing**

Change `.sidebarEntry` gap from `9px` to `6px`; retain `height: 38px`, `border-radius: 12px`, `padding: 8px 16px`, and typography.

- [ ] **Step 2: Normalize icon geometry**

Set `.sidebarEntryIcon` to a 16×16 grid and add `.sidebarEntryIcon svg { display: block; width: 16px; height: 16px; }`.

- [ ] **Step 3: Keep states neutral**

Retain the official token-backed white default and neutral hover/active backgrounds. Keep the low-contrast neutral focus-visible shadow and no blue outline.

- [ ] **Step 4: Run package verification**

Run: `pnpm --filter @whale-desktop/dsh-creator-center test && pnpm --filter @whale-desktop/dsh-creator-center typecheck && pnpm --filter @whale-desktop/dsh-creator-center build`

Expected: 13 test files and 49 tests pass; typecheck and build succeed.

### Task 3: Runtime visual acceptance

**Files:**
- No source files.

**Interfaces:**
- Consumes: rebuilt Creator Center client bundle.
- Produces: verified desktop UI.

- [ ] **Step 1: Restart the Electron development app**

Stop the current `pnpm start` session, rebuild if needed, and start `pnpm start` again.

- [ ] **Step 2: Inspect the three sidebar buttons**

Verify with computed styles that “新会话”, “扩展中心”, and “我的扩展” share x position, 252px width, 38px height, 12px radius, 1px neutral border, 14px/22px/500 typography, and 6px icon gap.

- [ ] **Step 3: Capture and inspect the UI**

Open “扩展中心” and “我的扩展”; confirm the icons are crisp, the labels share a baseline, selected state remains neutral, and neither route nor collapsed-sidebar behavior regressed.
