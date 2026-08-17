# DeepSeek Harness Desktop Multi-Agent Collaboration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a lightweight collaboration system in which office Codex integrates the project, office Hana completes isolated parallel work, and home Hana continues Windows-safe work from the same GitHub repository.

**Architecture:** GitHub `main` is the accepted project state. The existing `za` checkout remains the Codex integration workspace, office Hana receives a sibling Git worktree on its own branch, and home Hana uses a separate Windows clone. Four small repository documents carry durable rules, task ownership, decisions, and handoff state; pull requests and CI are the integration gate.

**Tech Stack:** Git, GitHub, Git worktrees, GitHub Actions, Node.js 24+, pnpm 11.9.0, Electron 43, TypeScript 6, Vitest 4, Node test runner.

## Global Constraints

- Preserve the official DeepSeek Harness Web UI and the pinned Harness runtime.
- Treat the current dirty working tree as protected user work until Codex creates a verified checkpoint.
- Never let Codex and Hana edit the same local working directory concurrently.
- Never let two agents own the same source file in the same work cycle.
- Do not push unreviewed worker changes directly to `main`; use an agent branch and pull request.
- Do not commit API keys, `.env` files, personal DSH configuration, `node_modules`, `dist`, or logs.
- Keep GitHub stars as manually maintained catalog snapshots; do not add live GitHub requests.
- Office Codex owns architecture, Electron lifecycle, official Cordis integration, merging, and release decisions.
- Office Hana owns bounded catalog, copy, documentation, and test work assigned in `docs/WORK_BOARD.md`.
- Home Hana owns Windows verification and low-risk tasks; architecture changes return to Codex.
- A coordinator change is valid only after `docs/HANDOFF.md` is updated and pushed.

---

## File Structure

### Files to create

- `AGENTS.md` — shared rules that every independent agent reads before editing.
- `docs/PROJECT_RULES.md` — current accepted product, architecture, catalog, and release boundaries.
- `docs/WORK_BOARD.md` — task IDs, lanes, owners, branches, file ownership, dependencies, and status.
- `docs/HANDOFF.md` — current coordinator, last pushed commit, tests, open branches, blockers, and next actions.
- `docs/agent-prompts/company-hana.md` — reusable startup prompt for office Hana.
- `docs/agent-prompts/home-hana.md` — reusable takeover prompt for home Hana on Windows.
- `.github/pull_request_template.md` — mandatory scope, test, rule-change, and handoff checklist.
- `.github/workflows/ci.yml` — pull-request and `main` validation without packaging releases.

### Files to modify

- `README.md` — add a concise collaboration section linking the shared rules and test commands.

### Existing files that remain the design history

- `docs/superpowers/specs/*.md` — approved feature designs and design changes.
- `docs/superpowers/plans/*.md` — detailed implementation plans.
- `.github/workflows/release.yml` — tagged macOS and Windows release builds; do not duplicate it in CI.

---

### Task 1: Create a Verified Sharing Baseline

**Files:**
- Review: all currently modified and untracked files shown by `git status --short`
- Verify: `package.json`
- Verify: `packages/dsh-creator-center/package.json`
- Verify: `packages/dsh-whale-appearance/package.json`

**Interfaces:**
- Consumes: the current protected dirty working tree on local `main` at commit `e1be28a`.
- Produces: a named Codex branch containing the verified product changes and a pushed commit that workers can branch from.

- [ ] **Step 1: Confirm repository identity and current divergence**

Run:

```bash
git status --short --branch
git remote -v
git log --oneline --decorate -8
```

Expected: local `main` reports `ahead 6`; `origin` points to `Nico0713520/deepseek-harness-desktop`; the dirty files remain present.

- [ ] **Step 2: Move the protected working state onto a Codex integration branch**

Run:

```bash
git switch -c codex/collaboration-baseline
```

Expected: branch changes without removing or rewriting any working-tree modification.

- [ ] **Step 3: Run the current product verification gate**

Run:

```bash
pnpm test
pnpm --filter @whale-desktop/dsh-whale-appearance test
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-whale-appearance typecheck
pnpm --filter @whale-desktop/dsh-creator-center typecheck
pnpm run check:release-assets
```

Expected: all commands exit with code 0.

- [ ] **Step 4: Audit the checkpoint before staging**

Run:

```bash
git diff --check
git diff --stat
git status --short
```

Expected: no whitespace errors; every modified or untracked path belongs to the Cordis cleanup, curated catalog, local logos, tests, generated package output, or related design documents already reviewed in this project.

- [ ] **Step 5: Commit the verified checkpoint without broadening scope**

Stage only the paths shown and approved in Step 4, then run:

```bash
git commit -m "feat: finalize extension center and official creator flow"
```

Expected: one reviewable checkpoint commit; unrelated personal or environment files remain unstaged.

- [ ] **Step 6: Push the integration branch**

Run:

```bash
git push -u origin codex/collaboration-baseline
```

Expected: GitHub contains the exact verified checkpoint. Do not merge it into `main` until its diff and CI are reviewed.

---

### Task 2: Add the Shared Collaboration Control Files

**Files:**
- Create: `AGENTS.md`
- Create: `docs/PROJECT_RULES.md`
- Create: `docs/WORK_BOARD.md`
- Create: `docs/HANDOFF.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: the verified baseline from Task 1.
- Produces: a canonical startup sequence and project state that Codex, office Hana, and home Hana can all read.

- [ ] **Step 1: Create `AGENTS.md` with mandatory startup and Git rules**

The file must require every agent to:

```markdown
# DeepSeek Harness Desktop Agent Rules

Before editing:
1. Run `git status --short --branch`.
2. Read `docs/PROJECT_RULES.md`.
3. Read `docs/WORK_BOARD.md`.
4. Read `docs/HANDOFF.md`.
5. Read the newest relevant file in `docs/superpowers/specs/`.

Collaboration rules:
- Work only on the assigned branch and file ownership listed in `docs/WORK_BOARD.md`.
- Preserve existing uncommitted user changes.
- Do not push directly to `main`.
- Do not silently change accepted product or architecture rules.
- Record an approved design change in a dated spec before implementing it.
- Run the task-specific tests before committing.
- Report changed files, tests, risks, and remaining work at handoff.
```

- [ ] **Step 2: Create `docs/PROJECT_RULES.md` with current accepted boundaries**

The document must include these exact sections:

```markdown
# Project Rules

## Product
- The application is an independent community desktop distribution of DeepSeek Harness.
- The official Harness Web UI remains the primary interface.
- The Extension Center recommends transparent GitHub resources and does not silently install them.

## Architecture
- Electron owns local runtime startup, loopback-port discovery, window lifecycle, tray behavior, and managed-process cleanup.
- Project extensions integrate through documented DSH interfaces and must avoid fragile DOM replacement.
- Official Cordis creation is used instead of a cloned custom Agent preset.

## Catalog
- Catalog entries require a real source URL, plain-language value description, type, industry or development direction, and a manually maintained star snapshot when available.
- Low-quality, duplicate, inaccessible, or zero-star community entries are excluded unless they are official first-party resources without a standalone repository.

## Release
- Node.js 24+ and pnpm 11.9.0 are required.
- macOS Apple Silicon, macOS Intel, and Windows x64 remain supported release targets.
- Secrets, local user configuration, generated installers, logs, and dependency directories are not committed.
```

- [ ] **Step 3: Create `docs/WORK_BOARD.md` with three lanes**

Use this initial structure:

```markdown
# Work Board

## CODEX_CORE
| ID | Task | Owner | Branch | Owned files | Depends on | Status |
|---|---|---|---|---|---|---|
| DX-001 | Stabilize and merge the official Cordis creator flow | Codex | codex/collaboration-baseline | `src/main.js`, creator-center launch integration, release scripts | none | in_progress |
| DX-002 | Review and integrate worker pull requests | Codex | main | merge and release surfaces | DX-001 | pending |

## COMPANY_HANA
| ID | Task | Owner | Branch | Owned files | Depends on | Status |
|---|---|---|---|---|---|---|
| CH-001 | Audit catalog quality, classification, URLs, copy, and static star snapshots | Company Hana | agent/company-hana/catalog-audit | assigned catalog data and catalog tests only | DX-001 | pending |

## HOME_HANA
| ID | Task | Owner | Branch | Owned files | Depends on | Status |
|---|---|---|---|---|---|---|
| HH-001 | Verify Windows install, launch, hidden-console behavior, and packaged smoke test | Home Hana | agent/home-hana/windows-verification | Windows scripts, Windows-specific tests, handoff notes | merged baseline | pending |

## BLOCKED
| ID | Problem | Waiting for | Owner | Status |
|---|---|---|---|---|
```

- [ ] **Step 4: Create `docs/HANDOFF.md` as the single current checkpoint**

Use this structure:

```markdown
# Current Handoff

- Active coordinator: Codex
- Location: office Mac
- Last accepted commit: record after Task 1 review
- Last update: use local ISO date and time when handing off
- Full test status: record exact commands and outcomes

## Open branches

## Completed since previous handoff

## In progress

## Safe for home Hana

## Reserved for Codex

## Known problems and reproduction steps

## First action for the next coordinator
```

- [ ] **Step 5: Link the collaboration files from `README.md`**

Add a `## Collaboration` section after `## Development` that explains:

```markdown
Independent agents use separate branches and working directories. Read `AGENTS.md`, `docs/PROJECT_RULES.md`, `docs/WORK_BOARD.md`, and `docs/HANDOFF.md` before editing. Office Codex integrates core changes, office Hana handles assigned bounded work, and home Hana validates Windows and other explicitly marked home-safe tasks.
```

- [ ] **Step 6: Validate and commit the control files**

Run:

```bash
git diff --check
rg -n "PROJECT_RULES|WORK_BOARD|HANDOFF" AGENTS.md README.md docs
git add AGENTS.md README.md docs/PROJECT_RULES.md docs/WORK_BOARD.md docs/HANDOFF.md
git commit -m "docs: add multi-agent collaboration controls"
```

Expected: every required document is linked and the commit contains no product-code changes.

---

### Task 3: Add Pull-Request CI and Review Gates

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/pull_request_template.md`

**Interfaces:**
- Consumes: Node.js and pnpm versions from `package.json` and `README.md`.
- Produces: a deterministic PR gate before Codex merges worker changes.

- [ ] **Step 1: Add `.github/workflows/ci.yml`**

Create this workflow:

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11.9.0
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm --filter @whale-desktop/dsh-whale-appearance test
      - run: pnpm --filter @whale-desktop/dsh-creator-center test
      - run: pnpm --filter @whale-desktop/dsh-whale-appearance typecheck
      - run: pnpm --filter @whale-desktop/dsh-creator-center typecheck
      - run: pnpm run check:release-assets
```

- [ ] **Step 2: Add `.github/pull_request_template.md`**

Create this checklist:

```markdown
## Scope
- Task ID:
- Assigned owner:
- Owned files:

## Changes
- What changed:
- What did not change:

## Verification
- [ ] Root tests passed
- [ ] Relevant package tests passed
- [ ] Relevant typecheck passed
- [ ] Release asset check passed when packaging assets changed

## Coordination
- [ ] I did not overwrite unrelated or uncommitted work
- [ ] I updated `docs/WORK_BOARD.md`
- [ ] I updated `docs/HANDOFF.md` if coordinator-visible state changed
- [ ] Product or architecture rules are unchanged, or an approved design spec is linked below

## Risks and rollback
- Risk:
- Rollback:
```

- [ ] **Step 3: Run the same gate locally**

Run:

```bash
pnpm test
pnpm --filter @whale-desktop/dsh-whale-appearance test
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-whale-appearance typecheck
pnpm --filter @whale-desktop/dsh-creator-center typecheck
pnpm run check:release-assets
```

Expected: all commands pass before CI files are committed.

- [ ] **Step 4: Commit the PR gate**

Run:

```bash
git add .github/workflows/ci.yml .github/pull_request_template.md
git commit -m "ci: validate multi-agent pull requests"
```

- [ ] **Step 5: Publish and accept the collaboration baseline**

Run:

```bash
git push origin codex/collaboration-baseline
```

Open a pull request from `codex/collaboration-baseline` to `main`. Review the full diff, require the new CI job to pass, and merge only after confirming that no secret, local configuration, installer, dependency directory, or unrelated user file is present. Then update the integration checkout:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
```

Expected: local `main` and `origin/main` point to the same accepted collaboration baseline before any worker worktree is created.

---

### Task 4: Create the Office Hana Worktree and Prompt

**Files:**
- Create: `docs/agent-prompts/company-hana.md`
- Create outside repository checkout: `/Users/zhengdeweishi/Documents/Codex/2026-08-13/za-hana-company`

**Interfaces:**
- Consumes: the reviewed and pushed baseline branch.
- Produces: an isolated company Hana workspace on `agent/company-hana/catalog-audit`.

- [ ] **Step 1: Write the company Hana startup prompt**

The prompt must direct Hana to:

```markdown
You are the office Hana collaborator for DeepSeek Harness Desktop. Codex is the active coordinator and integration owner. Before editing, run `git status --short --branch` and read `AGENTS.md`, `docs/PROJECT_RULES.md`, `docs/WORK_BOARD.md`, and `docs/HANDOFF.md`.

Work only on the task ID assigned to Company Hana. Modify only the owned catalog data, copy, documentation, and tests listed for that task. Do not modify Electron lifecycle, official Cordis launch integration, global routing, dependency versions, release workflows, or Codex-owned files.

Before delivery, run the relevant package tests and typecheck, update the work board, commit to your branch, push it, and report changed files, test results, risks, and remaining work. If a design rule should change, write a dated proposal in `docs/superpowers/specs/` and wait for approval before implementing the change.
```

- [ ] **Step 2: Commit and push the prompt before creating the worktree**

Run:

```bash
git add docs/agent-prompts/company-hana.md
git commit -m "docs: add office Hana collaboration prompt"
git push
```

Expected: the prompt is available from GitHub to every workstation.

- [ ] **Step 3: Create the isolated office Hana worktree**

From `/Users/zhengdeweishi/Documents/Codex/2026-08-13/za`, run:

```bash
git fetch origin
git worktree add /Users/zhengdeweishi/Documents/Codex/2026-08-13/za-hana-company -b agent/company-hana/catalog-audit origin/main
```

Expected: `git worktree list` shows both `za` and `za-hana-company` on different branches.

- [ ] **Step 4: Install and verify the Hana worktree**

Run:

```bash
cd /Users/zhengdeweishi/Documents/Codex/2026-08-13/za-hana-company
pnpm install --frozen-lockfile
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-creator-center typecheck
```

Expected: installation succeeds and creator-center tests and typecheck pass before Hana edits files.

- [ ] **Step 5: Assign the first bounded company Hana task**

Update `docs/WORK_BOARD.md` so `CH-001` owns only:

```text
packages/dsh-creator-center/src/client/curated-industry-catalog.ts
packages/dsh-creator-center/src/client/catalog.test.ts
docs/upstream-sources.json
THIRD_PARTY_NOTICES.md
```

Expected: Codex does not edit these files while `CH-001` is in progress; Hana does not edit any other product source file.

---

### Task 5: Create the Home Hana Windows Takeover Prompt

**Files:**
- Create: `docs/agent-prompts/home-hana.md`
- Modify: `docs/HANDOFF.md`

**Interfaces:**
- Consumes: accepted GitHub `main`, the current handoff, and Windows build scripts.
- Produces: a repeatable home takeover that advances safe work without changing core architecture.

- [ ] **Step 1: Write the home Hana prompt**

The prompt must direct Hana to:

```markdown
You are the home Hana acting coordinator for DeepSeek Harness Desktop on Windows. The office Codex remains the architecture and final-integration owner but is currently unavailable. Pull the latest accepted GitHub state, then read `AGENTS.md`, `docs/PROJECT_RULES.md`, `docs/WORK_BOARD.md`, and `docs/HANDOFF.md`.

Continue only tasks marked HOME_HANA or explicitly marked home-safe. Prioritize Windows installation, launcher behavior, hidden-console tests, packaged smoke tests, catalog verification, documentation, and bounded fixes with an exact reproduction. Do not redesign Electron lifecycle, official Cordis integration, upstream Harness pinning, or release architecture. Record complex findings for Codex instead of performing speculative refactors.

Use an `agent/home-hana/*` branch. Before handoff, run the relevant tests, push every useful checkpoint, update `docs/WORK_BOARD.md` and `docs/HANDOFF.md`, and report the exact commit, commands, outcomes, open failures, and first recommended action for office Codex.
```

- [ ] **Step 2: Add the Windows bootstrap commands to the prompt**

Include:

```powershell
git clone https://github.com/Nico0713520/deepseek-harness-desktop.git
cd deepseek-harness-desktop
git switch -c agent/home-hana/windows-verification
npm install --global pnpm@11.9.0
pnpm install --frozen-lockfile
pnpm run build:win-launcher
pnpm test
pnpm run test:win-console
pnpm run dist:win
pnpm run smoke:packaged
```

Expected: home Hana can reproduce the GitHub Actions Windows path locally.

- [ ] **Step 3: Add coordinator-switch fields to `docs/HANDOFF.md`**

Require these fields to be filled before leaving the office:

```markdown
- Active coordinator: Home Hana
- Accepted GitHub commit:
- Company Hana branch or PR:
- Tests completed at office:
- HOME_HANA tasks approved for tonight:
- CODEX_CORE tasks that must wait:
- First Windows command to run:
```

- [ ] **Step 4: Commit and push the home takeover material**

Run:

```bash
git add docs/agent-prompts/home-hana.md docs/HANDOFF.md
git commit -m "docs: add home Hana takeover protocol"
git push
```

---

### Task 6: Exercise One Complete Office-to-Home-to-Office Handoff

**Files:**
- Modify: `docs/WORK_BOARD.md`
- Modify: `docs/HANDOFF.md`
- Test: existing root, creator-center, Windows launcher, and packaged smoke tests.

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: evidence that work can continue across agents and machines without private chat context.

- [ ] **Step 1: Complete one office Hana task through a pull request**

Company Hana must:

```bash
git status --short --branch
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-creator-center typecheck
git push -u origin agent/company-hana/catalog-audit
```

Expected: a PR contains only the files owned by `CH-001` and includes the PR-template evidence.

- [ ] **Step 2: Have Codex review and integrate the office task**

Codex checks:

```bash
git diff main...agent/company-hana/catalog-audit --stat
git diff main...agent/company-hana/catalog-audit -- packages/dsh-creator-center/src/client/curated-industry-catalog.ts packages/dsh-creator-center/src/client/catalog.test.ts docs/upstream-sources.json THIRD_PARTY_NOTICES.md
```

Expected: no out-of-scope file change. Merge only after CI passes.

- [ ] **Step 3: Publish the evening checkpoint**

Codex updates `docs/WORK_BOARD.md` and `docs/HANDOFF.md`, records the accepted commit, then runs:

```bash
git add docs/WORK_BOARD.md docs/HANDOFF.md
git commit -m "docs: hand off Windows verification to home Hana"
git push origin main
```

Expected: the home computer can recover the complete accepted state from GitHub without access to the office machine.

- [ ] **Step 4: Run the home Windows verification lane**

Home Hana runs:

```powershell
git pull --rebase origin main
pnpm install --frozen-lockfile
pnpm run build:win-launcher
pnpm test
pnpm run test:win-console
pnpm run dist:win
pnpm run smoke:packaged
```

Expected: each result is written to `docs/HANDOFF.md`; failures include exact commands, exit codes, and relevant log excerpts.

- [ ] **Step 5: Return control to office Codex**

Home Hana updates the active coordinator and pushes:

```powershell
git add docs/WORK_BOARD.md docs/HANDOFF.md
git commit -m "docs: return project control to office Codex"
git push -u origin agent/home-hana/windows-verification
```

Expected: office Codex can inspect one branch or PR and the handoff document to understand all home work.

- [ ] **Step 6: Run the final integration gate on the office Mac**

After reviewing and merging home changes, Codex runs:

```bash
pnpm test
pnpm --filter @whale-desktop/dsh-whale-appearance test
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm --filter @whale-desktop/dsh-whale-appearance typecheck
pnpm --filter @whale-desktop/dsh-creator-center typecheck
pnpm run check:release-assets
pnpm run pack
pnpm run smoke:packaged
```

Expected: all tests pass, the packaged macOS application starts its pinned Harness runtime, and no collaboration file or worker branch changes runtime behavior.

---

## Completion Criteria

- Current product work is preserved in a verified, pushed checkpoint.
- Codex and office Hana use different working directories and different branches.
- Company Hana has a bounded file-ownership task and reusable prompt.
- Home Hana has a Windows-safe task lane and reusable takeover prompt.
- GitHub pull requests run tests and typechecks automatically.
- `PROJECT_RULES`, `WORK_BOARD`, and `HANDOFF` allow either computer to recover project context without reading private chat history.
- One full office-to-home-to-office handoff has been tested successfully.
