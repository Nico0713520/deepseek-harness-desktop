# Ability Detail Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the reduced ability detail content in a comfortable reading position without restoring removed sections.

**Architecture:** Expose list/detail mode on the existing library section and use CSS mode styling to remove the redundant outer frame. Keep `AbilityDetail` content and behavior unchanged.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest, Testing Library

## Global Constraints

- Detail card maximum width is 900px and horizontally centered.
- Wide-screen top spacing is `clamp(36px, 8vh, 84px)`; mobile top spacing is 18px.
- Do not add content, dependencies, routes, or network requests.
- Preserve all existing detail interactions.

---

### Task 1: Expose detail layout mode

**Files:**
- Modify: `packages/dsh-creator-center/src/client/AbilityLibrary.tsx`
- Test: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`

- [ ] Add a failing assertion that the ability Hub has `data-layout="detail"` after opening a card and `data-layout="list"` after returning.
- [ ] Run `pnpm --filter @whale-desktop/dsh-creator-center test -- CreatorCenter` and confirm the assertion fails.
- [ ] Add the stable layout attribute and detail-mode CSS class to the library section.
- [ ] Rerun the focused test and confirm it passes.

### Task 2: Center the reduced detail card

**Files:**
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`

- [ ] Remove the redundant outer border/background in detail mode.
- [ ] Center `.detailPage`, apply responsive top spacing, and cap `.abilityDetail` at 900px.
- [ ] Replace the blue detail border with the existing neutral border token and a restrained shadow.
- [ ] Add the 760px mobile override.
- [ ] Run all package tests, typecheck, and build.

### Task 3: Runtime visual acceptance

- [ ] Restart the Electron development app.
- [ ] Open `obra/superpowers` and verify the card is centered, the outer empty frame is gone, and the top position is comfortable.
- [ ] Capture a screenshot and confirm list mode, return behavior, action buttons, and advanced information remain intact.
