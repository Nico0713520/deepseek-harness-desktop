# DeepSeek Harness Desktop

DeepSeek Harness Desktop turns [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) into a cross-platform desktop application that anyone can download and start using. It preserves the official Harness Web UI, runs the pinned runtime locally, and removes the friction of manually starting and managing a browser-based development service.

Beyond the desktop shell, the project adds an Extension Center designed around the plugin-first architecture of DeepSeek Harness. It brings together curated Skills, plugins, MCP tools, Agent workflows, and high-quality open-source projects across software development and multiple industries, helping users discover proven building blocks and shape a Harness that fits their own work.

> Community project. Not an official DeepSeek release. Installers are available for macOS Apple Silicon, macOS Intel, and Windows x64.

## Why DeepSeek Harness Desktop

DeepSeek Harness is powerful and highly extensible, but getting from a repository to a dependable everyday application still requires setup, command-line knowledge, and an understanding of its extension model. This project focuses on the practical gap between capability and usability.

- **Download and run:** Use a familiar desktop application instead of manually launching the Web UI.
- **Keep the official experience:** The official Harness frontend remains intact rather than being replaced by a competing interface.
- **Manage the local runtime:** The desktop shell starts Harness on an available loopback port and shuts down its managed process cleanly.
- **Discover useful extensions:** Browse curated open-source Skills, plugins, MCP tools, Agents, and workflows with source links and plain-language explanations.
- **Explore by development direction or industry:** Find relevant capabilities without already knowing the name of a repository or extension format.
- **Build your own Harness:** Guided resources explain how to evaluate, add, and manage extensions using the architecture DeepSeek designed for customization.
- **Stay in control:** Recommendations are transparent and do not silently install or modify third-party projects.

## Core Features

### A desktop application for the official Harness UI

- Starts the pinned DeepSeek Harness runtime on a free local port.
- Loads the official Web UI inside an isolated Electron window.
- Provides native window behavior, startup feedback, tray controls, and lifecycle management.
- Stops the managed Harness process when the application exits.
- Keeps user-installed extensions and existing Harness configuration separate from desktop-managed features.

### Extension Center

- Curates high-quality GitHub projects relevant to DeepSeek Harness.
- Organizes developer resources by workflow, frontend, backend, crawling, Agent and workflow systems, data and AI, and operations.
- Supports broader industry discovery for users outside software development.
- Shows project descriptions, extension type, repository links, and practical integration guidance.
- Separates recommended resources from extensions the user has actually added.
- Provides an AI Extension Advisor and guarded creation guidance without modifying files before approval.

### Cross-platform releases

- macOS Apple Silicon: DMG and ZIP.
- macOS Intel: DMG and ZIP.
- Windows x64: installer and portable ZIP.
- Every release is built through GitHub Actions and checked with an isolated packaged-runtime smoke test.

## Download

Download the latest build from [GitHub Releases](https://github.com/Nico0713520/deepseek-harness-desktop/releases/latest).

The current builds use development signing and are not yet notarized. Your operating system may display an unverified-developer warning during installation.

## Development

Requirements: Node.js 24+ and pnpm 11.9.0.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm --filter @whale-desktop/dsh-whale-appearance test
pnpm --filter @whale-desktop/dsh-creator-center test
pnpm start
```

The first local start may ask Harness to initialize its user directory and provider configuration.

The curated extension catalog is local, reviewable, and versioned in the repository. New projects can be added as data entries without replacing the official Settings UI or weakening the creation approval boundary.

## Collaboration

Independent agents use separate branches and working directories. Read `AGENTS.md`, `docs/PROJECT_RULES.md`, `docs/WORK_BOARD.md`, and `docs/HANDOFF.md` before editing. Office Codex integrates core changes, office Hana handles assigned bounded work, and home Hana validates Windows and other explicitly marked home-safe tasks.

## Build

```bash
# macOS Apple Silicon
pnpm run dist:mac:arm64

# macOS Intel
pnpm run dist:mac:x64

# Windows x64 (run on Windows)
pnpm run dist:win
```

Validate a packaged directory build with:

```bash
pnpm run smoke:packaged
```

The smoke test creates a temporary `DSH_HOME`, starts the packaged runtime, verifies the official Web UI over loopback HTTP, and removes its temporary files and process.

## Project Boundaries

- This is an independent community project and is not endorsed by DeepSeek.
- DeepSeek Harness remains an upstream dependency; this repository does not claim ownership of its code or branding.
- Recommended extensions remain third-party projects under their respective licenses.
- Source provenance and third-party license notices are recorded in `THIRD_PARTY_NOTICES.md`, `docs/upstream-sources.json`, and `third-party-licenses/`.

## Roadmap

1. Expand the curated extension catalog with more verified projects and industry-specific resources.
2. Add signed and notarized macOS and Windows releases.
3. Introduce safe application updates with rollback to the previous working runtime.

## License

The original code and project-owned assets in this repository are released under the MIT License. Upstream and bundled third-party components retain their own licenses; see `THIRD_PARTY_NOTICES.md`.
