# Computer Use Catalog Implementation Plan

> **For agentic workers:** This plan is executed inline in the current repository.

**Goal:** Add Computer Use to the DeepSeek Harness extension center as an official-capability reference card without presenting it as a directly installable Skill.

**Architecture:** Add one catalog entry backed by the OpenAI CUA sample repository, mark the local capability as a manual adapter, and classify it under Agent 与工作流. Keep the GitHub Star attached to the public reference repository while the card copy clearly states that the local runtime itself has no independent repository.

**Tech Stack:** TypeScript catalog data, Vitest, existing project-logo sprite and catalog UI.

## Global Constraints

- Do not copy or claim access to Codex's private `@oai/sky` runtime.
- Do not label Computer Use as a one-click installable Harness Skill.
- Keep the public GitHub reference link and static Star snapshot visible.
- Preserve the existing catalog schema and UI behavior.

### Task 1: Add and verify the Computer Use catalog entry

**Files:**
- Modify: `packages/dsh-creator-center/src/client/additional-catalog.ts`
- Modify: `packages/dsh-creator-center/src/client/developer-directions.ts`
- Test: `packages/dsh-creator-center/src/client/catalog.test.ts`

- [ ] Add `openai-computer-use` with `vendor` / `vendor-official` metadata, `manual-adapter` compatibility, the `openai/openai-cua-sample-app` reference URL, and a static `★ 1.7K` snapshot for that public sample.
- [ ] Assign it to `programmer`, `kindIds: ['agents']`, and `agent-workflow`.
- [ ] Explain the local runtime limitation, macOS/Windows permission boundary, browser-first path, and stop/rollback method in the card.
- [ ] Add tests that verify the entry, reference URL, compatibility, and direction.

### Task 2: Build and run the package checks

**Files:**
- Modify: `packages/dsh-creator-center/lib/**` (generated build output, if tracked)

- [ ] Run `pnpm --filter @whale-desktop/dsh-creator-center test`.
- [ ] Run `pnpm --filter @whale-desktop/dsh-creator-center build`.
- [ ] Run `git diff --check` and inspect the generated diff.
- [ ] Commit the implementation and generated output with `feat: add computer use extension reference`.
