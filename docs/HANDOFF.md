# Current Handoff

- Active coordinator: Codex
- Location: office Mac
- Last accepted commit: not yet established for this collaboration setup
- Last update: 2026-08-17
- Full test status: current product verification is recorded in the handoff commit and CI

## Open branches

- `agent/deepseek-harness-collaboration`: Codex collaboration setup and current product checkpoint
- `agent/company-hana/catalog-audit`: reserved for office Hana after the baseline is accepted
- `agent/home-hana/windows-verification`: reserved for home Hana on Windows

## Completed since previous handoff

- The official Cordis creator path replaced the cloned custom advisor flow.
- The Extension Center catalog, detail views, static GitHub star snapshots, and related tests were updated.
- Packaged macOS smoke verification has passed during the current work cycle.
- Collaboration rules, task ownership, and prompts are being added in this branch.

## In progress

- Codex is establishing the shared collaboration baseline and PR checks.
- Company Hana has not started until the baseline is pushed and its worktree is created.

## Safe for home Hana

- Windows launcher and hidden-console verification.
- Windows packaged build and smoke test.
- Catalog review, documentation, and bounded fixes with exact reproduction steps.

## Reserved for Codex

- Electron lifecycle changes.
- Official Cordis creator integration.
- Upstream Harness runtime changes.
- Cross-module refactors and release decisions.

## Known problems and reproduction steps

- The repository currently contains a large uncommitted product checkpoint. Do not branch worker work from it until Codex commits and pushes the reviewed baseline.

## First action for the next coordinator

Read this file, `AGENTS.md`, `docs/PROJECT_RULES.md`, and `docs/WORK_BOARD.md`; then run `git status --short --branch` and confirm the accepted GitHub commit before editing.

## Coordinator switch fields

When leaving the office, update these fields before pushing:

- Active coordinator:
- Location:
- Accepted GitHub commit:
- Company Hana branch or PR:
- Tests completed at office:
- HOME_HANA tasks approved for tonight:
- CODEX_CORE tasks that must wait:
- First command for the next coordinator:
