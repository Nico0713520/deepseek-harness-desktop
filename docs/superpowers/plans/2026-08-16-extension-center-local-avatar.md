# Extension Center Local Project Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Execute these tasks in order with test-first verification.

**Goal:** Bundle the original GitHub repository-owner icons locally, rename and visually align the sidebar entries, and improve Pi extension guidance.

**Architecture:** Keep the catalog data model unchanged. A build helper reads each GitHub RepositoryOwner avatar, compresses all icons to a single JPEG sprite, and emits a deterministic owner-to-cell map. `AbilityLibrary` uses the local sprite with a monogram fallback, derives Pi-specific source copy at presentation time, and reuses the existing sidebar component CSS for both extension routes.

**Tech Stack:** React, TypeScript, CSS Modules, Vitest, Testing Library

## Global Constraints

- Do not add a runtime cache service or package dependency; use the existing system ffmpeg command only to regenerate source assets.
- Do not auto-install catalog entries.
- Do not modify the user's three local test extensions.
- Preserve existing route ids and catalog ids.

---

### Task 1: Lock the new UI behavior with tests

**Files:**
- Modify: `packages/dsh-creator-center/src/client/CreatorCenterSidebarAction.test.tsx`
- Modify: `packages/dsh-creator-center/src/client/CreatorCenterSurface.test.tsx`

- [ ] Assert that the sidebar exposes “扩展中心” and no longer exposes “能力中心”.
- [ ] Render the catalog and assert that project avatars use a local JPEG data URL and contain no remote image URL.
- [ ] Assert that a Pi card displays “Pi 热门扩展” and “高阶定制参考”.
- [ ] Run the focused tests and verify that the new assertions fail before implementation.

### Task 2: Build and render the local avatar sprite and Pi copy

**Files:**
- Modify: `packages/dsh-creator-center/src/client/AbilityLibrary.tsx`
- Modify: `packages/dsh-creator-center/src/client/AbilityDetail.tsx`
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`
- Create: `packages/dsh-creator-center/src/client/project-logos.ts`
- Create: `scripts/build-extension-project-logo-sprite.mjs`

- [ ] Fetch and compress RepositoryOwner icons into one 32px-cell JPEG sprite during development.
- [ ] Render the sprite for personal and organization repositories and keep the monogram only as a missing-image fallback.
- [ ] Add the Pi high-level customization copy to Pi detail pages without changing compatibility rules.
- [ ] Run the focused tests and verify they pass.

### Task 3: Rename and align the sidebar entry

**Files:**
- Modify: `packages/dsh-creator-center/src/client/CreatorCenterSidebarAction.tsx`
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`

- [ ] Rename the accessible and visible label to “扩展中心”.
- [ ] Match the official new-conversation border, background, type weight, dimensions, and padding.
- [ ] Keep a subtle neutral active background while preserving `aria-current`.
- [ ] Run all package tests, typecheck, and build.

### Task 4: Reload and verify the running GUI

**Files:**
- Generated: `packages/dsh-creator-center/lib/**`

- [ ] Restart the desktop development process.
- [ ] Open the live extension center and confirm the three sidebar entries align.
- [ ] Capture CDP network events with cache disabled and assert that no remote GitHub avatar request occurs.
- [ ] Run the root test suite and `git diff --check`.
