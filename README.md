# DeepSeek Harness Whale Desktop

An unofficial cross-platform desktop distribution for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It keeps the official Harness Web UI and runs it locally inside a desktop window.

> Early preview. The desktop shell works on macOS ARM64; the whale-maid pet, theme packs, extension center, signed installers, and Windows release verification are in progress.

## What already works

- Starts the pinned DeepSeek Harness runtime on a free loopback port.
- Loads the official Web UI instead of replacing or forking its frontend.
- Uses Electron isolation defaults, a native title bar, tray controls, and a startup screen.
- Stops the managed Harness process when the desktop app quits.
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
pnpm start
```

The first local start may ask Harness to initialize its own user directory and provider configuration.

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

The smoke test creates a temporary `DSH_HOME`, starts the packaged runtime, verifies the official Web UI over loopback HTTP, then removes its temporary files and process.

## Current verified build

- Platform: macOS ARM64
- App: `dist/mac-arm64/DeepSeek Harness Whale Desktop.app`
- Source tests: 21 passing
- Packaged runtime smoke test: HTTP 200
- Signing: development ad-hoc signature only; not notarized for public distribution yet

## Project boundaries

- This is a community project and is not an official DeepSeek release.
- DeepSeek Harness remains an upstream dependency; this project does not claim its code or branding.
- Third-party code provenance and license texts are recorded in `THIRD_PARTY_NOTICES.md`, `docs/upstream-sources.json`, and `third-party-licenses/`.
- Temporary development icons will be replaced before a public release. Fan art or other images without clear redistribution rights will not be bundled.

## Roadmap

1. Whale-maid desktop pet with show/hide, drag, and notification states.
2. Stable preview/apply/reset theme-pack API that survives upstream UI updates.
3. Curated extension and tutorial center linking to GitHub repositories.
4. Signed DMG/ZIP and Windows NSIS installers with automatic release builds.
5. Safe updater with rollback to the previous working runtime.

## License

Desktop-shell code in this repository is released under the MIT License. Upstream and bundled third-party components retain their own licenses; see the notices above.
