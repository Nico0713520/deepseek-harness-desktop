# Project Rules

## Product

- This is an independent community desktop distribution of DeepSeek Harness.
- The official Harness Web UI remains the primary interface.
- The Extension Center recommends transparent GitHub resources and does not silently install third-party projects.
- Themes and desktop pets are optional appearance features and must not destabilize the official Harness experience.

## Architecture

- Electron owns local runtime startup, loopback-port discovery, window lifecycle, tray behavior, and managed-process cleanup.
- Project extensions integrate through documented DSH interfaces and avoid fragile DOM replacement.
- The official Cordis creator flow is used instead of a cloned custom Agent preset.
- Upstream Harness behavior remains the source of truth for the official UI and built-in Agent presets.

## Catalog

- Catalog entries require a real source URL, plain-language value description, type, industry or development direction, and a manually maintained star snapshot when available.
- Low-quality, duplicate, inaccessible, or zero-star community entries are excluded unless a documented first-party exception exists.
- Star counts are snapshots maintained with catalog updates; the application does not make live GitHub requests.

## Release

- Node.js 24+ and pnpm 11.9.0 are required.
- macOS Apple Silicon, macOS Intel, and Windows x64 remain supported release targets.
- Secrets, local user configuration, generated installers, logs, and dependency directories are not committed.
