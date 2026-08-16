# Ability Hub Open-Source Catalog Implementation Plan

> **For agentic workers:** Implement this plan inline in the current repository. The change is intentionally data-first and does not add remote installation behavior.

**Goal:** Add the user's curated open-source Skills and plugins to the Ability Hub with verified GitHub links and beginner-readable details.

**Architecture:** Extend the existing local `AbilityDefinition` catalog with an optional repository URL. Add verified upstream entries as ordinary filtered abilities, and render the link only inside the existing detail panel. Keep unverified local Skills link-free and label their source honestly.

**Tech Stack:** TypeScript, React, Vitest, CSS Modules, pnpm workspace, Electron desktop bundle.

## Global Constraints

- Keep the current white, minimal Ability Hub layout with only industry and kind filters.
- Do not auto-install third-party code, run remote scripts, or add a network-backed catalog.
- Only display GitHub links whose repository and license were verified.
- Preserve the official Creator Mode handoff as the primary action.

---

### Task 1: Add repository metadata and verified catalog entries

**Files:**
- Modify: `packages/dsh-creator-center/src/client/catalog.ts`
- Test: `packages/dsh-creator-center/src/client/catalog.test.ts`

**Interfaces:**
- `AbilityDefinition.implementation.repositoryUrl?: string` is optional metadata consumed by `AbilityDetail`.
- New entries use existing `IndustryId`, `AbilityKindId`, `ExtensionType`, prompt, checks, and rollback fields.

- [ ] Add a test asserting all seven verified entries have the expected repository URLs and licenses.
- [ ] Add entries for Superpowers, OpenSpec, Agent Reach, Firecrawl MCP, Last 30 Days, Ponytail, and frontend-design.
- [ ] Add one local-workflow entry naming the unverified local skills without a repository URL.
- [ ] Keep all entries under existing `programmer`, `coding`, or `research` filters and use plain-language Chinese copy.
- [ ] Run `pnpm --filter @whale-desktop/dsh-creator-center test -- catalog.test.ts` and confirm the catalog tests pass.

### Task 2: Show verified GitHub links in the detail panel

**Files:**
- Modify: `packages/dsh-creator-center/src/client/AbilityDetail.tsx`
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`
- Test: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`

**Interfaces:**
- `AbilityDetail` reads `ability.implementation.repositoryUrl` and does not change creation or advisor behavior.

- [ ] Add a labeled `查看 GitHub 仓库` external link when `repositoryUrl` exists.
- [ ] Use `target="_blank"` and `rel="noreferrer"`; do not render an empty link for local-only entries.
- [ ] Add a test that opens one verified detail and sees the link, then checks a local-only entry has no GitHub link.
- [ ] Run the package test suite and typecheck.

### Task 3: Build and verify the desktop surface

**Files:**
- Regenerate: `packages/dsh-creator-center/lib/*`

- [ ] Run `pnpm --filter @whale-desktop/dsh-creator-center build`.
- [ ] Run `pnpm test` and `git diff --check`.
- [ ] Run `pnpm run pack` and open the macOS arm64 desktop app.
- [ ] Verify the programmer/coding and research filters, one GitHub link, and the unchanged Creator Mode action.
- [ ] Commit with `feat: add curated open-source abilities`.
