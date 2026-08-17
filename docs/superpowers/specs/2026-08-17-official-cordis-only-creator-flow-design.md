# Official Cordis-Only Creator Flow

Date: 2026-08-17

## Decision

DeepSeek Harness Desktop will not ship or provision a cloned `AI Extension Advisor` Agent preset. Every action that asks DeepSeek to evaluate or create an extension will open the official built-in `cordis` Creator Mode.

This design supersedes the dedicated advisor-preset sections in `2026-08-15-creator-center-design.md` and `2026-08-15-creator-center.md`. The Extension Center, project catalog, prompts, and guidance remain unchanged.

## Why

DeepSeek Harness mounts each Agent preset as a persistent standing composition. Both the official `cordis` preset and the cloned `whale-extension-advisor` preset include `@deepseek-ai/dsh-tool-cordis`, which registers process-wide inspect providers such as `Service`. The second preset to mount fails because those provider IDs are already registered.

Controlled tests reproduced the failure in both orders:

- official `cordis` first: official mode succeeds, the cloned advisor fails;
- cloned advisor first: the advisor succeeds, official `cordis` fails.

Using one official preset removes the duplicated runtime, follows upstream behavior, and reduces future maintenance.

## User Flow

### Ask whether an extension is suitable

1. The user selects `Ask DeepSeek if this suits me`.
2. Desktop copies the visible advisor prompt for the selected catalog project.
3. Desktop opens a new blank session with the official `cordis` preset.
4. The user pastes and sends the prepared prompt.

### Ask DeepSeek to create an extension

1. The user selects `Let DeepSeek create it`.
2. Desktop copies the guarded creation prompt for the selected catalog project.
3. Desktop opens a new blank session with the official `cordis` preset.
4. The user pastes and sends the prepared prompt.

Desktop does not silently send either prompt and does not modify files before the user submits it in Creator Mode.

## Managed Legacy Cleanup

On startup, Desktop checks the old user preset directory `.agent-presets/whale-extension-advisor`.

- If the directory contains the exact Desktop ownership marker, Desktop removes it.
- If the marker is missing, unreadable, or belongs to another owner/schema, Desktop leaves the directory untouched.
- Desktop never deletes other user presets.

The app no longer copies the official Cordis preset or provisions the bundled advisor Skill into an Agent preset.

## Failure Handling

- Clipboard failure leaves the user on the project detail page and exposes the prompt for manual copying.
- If official Creator Mode cannot open, the existing actionable error remains visible and offers a retry.
- Legacy cleanup failure is non-fatal: the app starts normally and logs the cleanup error without deleting uncertain data.

## Confirmed Test Seams

Tests observe behavior only through these public boundaries:

1. **Creator Center UI:** both advisor and creation actions copy their respective prompt and call `launcher.launch('cordis')`; neither launches `whale-extension-advisor`.
2. **Startup preset maintenance:** a marker-owned legacy directory is removed; an unmarked or foreign directory is preserved.
3. **Packaged smoke behavior:** after launch, Agent Presets lists only the official built-in Creator Mode, and both Extension Center actions can enter it without a duplicate-provider error.

## Out of Scope

- Replacing or patching the official Cordis preset.
- Automatically installing catalog projects.
- Automatically submitting prompts as the user.
- Refactoring unrelated Extension Center catalog or visual work.

