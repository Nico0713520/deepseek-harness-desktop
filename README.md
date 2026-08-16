# DeepSeek Harness Whale Desktop

An unofficial cross-platform desktop distribution for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It keeps the official Harness Web UI and runs it locally inside a desktop window.

> Early preview. The desktop shell, settings-based Whale Canvas theme, two selectable whale pets, and local extension academy work in development on macOS ARM64; signed installers and Windows release verification are in progress.

## What already works

- Starts the pinned DeepSeek Harness runtime on a free loopback port.
- Loads the official Web UI instead of replacing or forking its frontend.
- Uses Electron isolation defaults, a native title bar, tray controls, and a startup screen.
- Stops the managed Harness process when the desktop app quits.
- Provisions the settings group and local Whale Appearance plugin into a dedicated DSH profile without replacing user-installed extensions.
- Adds a reversible Whale Canvas layer only inside the conversation canvas; the official sidebar, header, composer, messages, and settings shell remain unchanged.
- Adds settings controls for the official theme, whale theme, pet selection, pet scale, pet position reset, and one-click restoration of the official appearance.
- Keeps those controls directly discoverable at `Settings → Appearance`, without adding a floating theme button to the chat canvas.
- Supports draggable whale-maid and abstract-whale pets with lightweight Harness activity reactions through the standard DSH plugin interface.
- Adds `Settings → 创造中心` with eight beginner templates that can be browsed by everyday use or by Agent preset, Skill, workflow, plugin, and UI-extension type.
- Builds guarded creation prompts, copies them for final user review, and opens the official Creator Mode only on a blank session.
- Adds a clearly labelled AI Extension Advisor with local decision guidance and a safe fallback to official Creator Mode; it does not pretend to be human support or modify files before approval.
- Adds a secure local Extensions & Tutorials page from the system tray with curated GitHub links and the standard DSH plugin command.
- Packages macOS ARM64 successfully and verifies the packaged Web UI with an isolated smoke test.
- Includes macOS ARM64/x64 and Windows x64 GitHub Actions release jobs.

## Why this project exists

DeepSeek Harness is powerful and extensible, but installing and customizing a local agent is still unfamiliar to many users. Whale Desktop aims to provide:

- one-click desktop installers;
- the original Harness experience without a second frontend to learn;
- a whale-maid desktop pet and switchable visual packs;
- an extension center with curated recommendations and practical tutorials;
- transparent links back to upstream projects and extension repositories.

## Development

Requirements: Node.js 24+ and pnpm 11.9.0.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm --filter @whale-desktop/dsh-whale-appearance test
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm start
```

The first local start may ask Harness to initialize its own user directory and provider configuration.

Creator Center's first catalog is intentionally local and versioned in
`packages/dsh-creator-center/src/client/catalog.ts`. Reviewed repositories and
tutorials can be added later as data entries without replacing the Settings UI
or weakening the creation approval boundary.

## Build

```bash
# macOS Apple Silicon
pnpm run dist:mac:arm64

# macOS Intel
pnpm run dist:mac:x64

# Windows x64 (run on Windows)
pnpm run dist:win
```

Run the packaged-app check after a directory build:

```bash
pnpm run smoke:packaged
```

The included whale artwork was created for this project and is released with
the repository under the MIT License. Asset provenance is recorded in
`packages/dsh-whale-appearance/assets/provenance.json`.

The smoke test creates a temporary `DSH_HOME`, starts the packaged runtime, verifies the official Web UI over loopback HTTP, then removes its temporary files and process.

## Current verified build

- Platform: macOS ARM64
- App: `dist/mac-arm64/DeepSeek Harness Whale Desktop.app`
- Source tests: 31 shell tests and 10 Whale Appearance tests passing
- Packaged runtime smoke test: official Web UI, Whale Appearance state/assets, theme/pet apply, and official-appearance reset verified over HTTP 200
- Signing: development ad-hoc signature only; not notarized for public distribution yet

## Project boundaries

- This is a community project and is not an official DeepSeek release.
- DeepSeek Harness remains an upstream dependency; this project does not claim its code or branding.
- Third-party code provenance and license texts are recorded in `THIRD_PARTY_NOTICES.md`, `docs/upstream-sources.json`, and `third-party-licenses/`.
- Temporary development icons will be replaced before a public release. Fan art or other images without clear redistribution rights may be used only in a gated local prototype and will not enter a public release.

## Roadmap

1. Expand the curated academy after checking more community extensions and licenses.
2. Signed and notarized DMG/ZIP and Windows NSIS installers.
3. Safe updater with rollback to the previous working runtime.

## License

Desktop-shell code in this repository is released under the MIT License. Upstream and bundled third-party components retain their own licenses; see the notices above.
