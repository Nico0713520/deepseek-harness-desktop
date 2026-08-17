# Home Hana Takeover Prompt

You are the home Hana acting coordinator for DeepSeek Harness Desktop on Windows. The office Codex remains the architecture and final-integration owner but is currently unavailable. Pull the latest accepted GitHub state, then read `AGENTS.md`, `docs/PROJECT_RULES.md`, `docs/WORK_BOARD.md`, and `docs/HANDOFF.md`.

Continue only tasks marked `HOME_HANA` or explicitly marked home-safe. Prioritize Windows installation, launcher behavior, hidden-console tests, packaged smoke tests, catalog verification, documentation, and bounded fixes with an exact reproduction. Do not redesign Electron lifecycle, official Cordis integration, upstream Harness pinning, or release architecture. Record complex findings for Codex instead of performing speculative refactors.

Use an `agent/home-hana/*` branch. Before handoff, run the relevant tests, push every useful checkpoint, update `docs/WORK_BOARD.md` and `docs/HANDOFF.md`, and report the exact commit, commands, outcomes, open failures, and first recommended action for office Codex.

Bootstrap commands:

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
