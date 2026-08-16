# DeepSeek Harness Desktop

把 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
做成方便所有人下载和使用的跨平台桌面版。项目保留官方 Web UI，并在本地桌面窗口中运行，提供开箱即用的安装体验、更完整的桌面能力，以及适合不同用户和行业的扩展资料。

> 社区项目，非 DeepSeek 官方发行版。当前提供 macOS Apple Silicon、macOS Intel 和 Windows x64 安装包。

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

## 为什么做这个项目

DeepSeek Harness 的核心设计是“所有能力皆可扩展”，但许多用户不知道如何安装、选择和定制适合自己的扩展。DeepSeek Harness Desktop 希望让每个人都能先轻松用起来，再逐步把 Harness 变成适合自己的智能工作台：

- 提供可直接下载的 Mac 与 Windows 桌面安装包；
- 保留官方 Harness 使用体验，不需要重新学习另一套前端；
- 提供主题、桌宠和更完整的桌面功能；
- 提供按开发方向与行业整理的扩展中心和开源项目资料；
- 帮助用户理解 Skill、插件、MCP、Agent 与工作流，并设计自己的 DeepSeek Harness；
- 所有推荐项目保留来源和 GitHub 地址，不冒充官方插件市场，也不会自动安装。

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
- App: `dist/mac-arm64/DeepSeek Harness Desktop.app`
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
