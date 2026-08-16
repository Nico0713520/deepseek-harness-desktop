# Programmer Catalog Expansion Implementation Plan

> **For agentic workers:** Implement inline in the current worktree and preserve unrelated user changes.

**Goal:** Add a balanced set of verified GitHub Skill, MCP, and developer-tool projects to the programmer catalog.

**Architecture:** Keep repository metadata in `additional-catalog.ts` and keep the many-to-many developer taxonomy in `developer-directions.ts`. Reuse the existing ability card/detail UI and safety-oriented creation prompt flow.

**Tech Stack:** TypeScript, React catalog data, Vitest.

## Global Constraints

- Catalog entries are recommendations only and must not install anything automatically.
- One GitHub repository produces one catalog card.
- Every added repository needs a current Star snapshot, license statement, repository URL, rollback text, and verification checks.
- Existing dirty-worktree changes must be preserved.

### Task 1: Add verified catalog entries

**Files:**
- Modify: `packages/dsh-creator-center/src/client/additional-catalog.ts`

- [ ] Add the approved frontend Skill repositories.
- [ ] Add official backend MCP repositories.
- [ ] Add crawler, Agent/workflow, data/AI, and operations projects.
- [ ] Keep prompts read-only or minimum-permission by default.

### Task 2: Assign developer directions

**Files:**
- Modify: `packages/dsh-creator-center/src/client/developer-directions.ts`

- [ ] Map each new ID to one or more of the seven developer directions.
- [ ] Add missing mappings for existing high-quality projects such as Anthropic Skills, GitHub MCP, Docling, and PaddleOCR.

### Task 3: Lock the catalog with tests

**Files:**
- Modify: `packages/dsh-creator-center/src/client/catalog.test.ts`

- [ ] Assert programmer count is above 70.
- [ ] Assert frontend and backend have healthy minimum counts.
- [ ] Assert the named high-quality repositories and exact GitHub URLs exist.
- [ ] Run `pnpm --filter @whale-desktop/dsh-creator-center test` and expect all tests to pass.

### Task 4: Build and launch

**Files:**
- Generated: `packages/dsh-creator-center/lib/**`

- [ ] Run package typecheck and build.
- [ ] Run root tests and `git diff --check`.
- [ ] Restart `pnpm start` and verify the live catalog API bundle contains the new repository names.

