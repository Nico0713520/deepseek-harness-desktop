# DeepSeek Harness Desktop Agent Rules

This repository is shared by independent development tools, including office Codex, office Hana, and home Hana. The active coordinator can change by location, but the repository rules and handoff state are shared through GitHub.

## Before editing

1. Run `git status --short --branch`.
2. Read `docs/PROJECT_RULES.md`.
3. Read `docs/WORK_BOARD.md`.
4. Read `docs/HANDOFF.md`.
5. Read the newest relevant design in `docs/superpowers/specs/`.

## Collaboration rules

- Work only on the assigned branch and file ownership listed in `docs/WORK_BOARD.md`.
- Preserve existing user changes; never use destructive reset or checkout commands to discard them.
- Do not push directly to `main`; use a branch and pull request.
- Do not silently change accepted product or architecture rules.
- Record important design changes in a dated document under `docs/DECISIONS/` or `docs/superpowers/specs/` before implementing them.
- Run the task-specific tests before committing.
- Report changed files, tests, risks, and remaining work in the pull request and handoff.
- Never commit API keys, `.env` files, local Harness configuration, `node_modules`, `dist`, or logs.

## Coordinator rules

- Office Codex owns architecture, Electron lifecycle, official Cordis integration, merging, and release decisions.
- Office Hana owns bounded catalog, copy, documentation, and test work assigned in the work board.
- Home Hana owns Windows verification and tasks explicitly marked home-safe.
- A coordinator switch is valid only after `docs/HANDOFF.md` is updated and pushed.
