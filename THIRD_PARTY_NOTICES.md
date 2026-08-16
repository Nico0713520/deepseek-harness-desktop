# Third-Party Notices

## steven-kid/deepseek-harness-desktop

- Source: https://github.com/steven-kid/deepseek-harness-desktop
- Imported commit: `4dead6e6a47b39d838e88d396cc2eba68dcc7014`
- License: MIT
- Copyright: Copyright (c) 2026 Steven
- Reused areas: desktop runtime launcher, Electron lifecycle, secure window options, startup UI, tests, packaging scripts, release workflow, and development icons.

The required license text is preserved at
`third-party-licenses/steven-kid-deepseek-harness-desktop-LICENSE`.

The imported icons are MIT-licensed temporary development assets. They will
be replaced by project-owned Whale Maid branding before a public branded
release, while their provenance remains recorded for historical builds.

## ningbainb/deepseek-harness-desktop — dsh-pet

- Source: https://github.com/ningbainb/deepseek-harness-desktop
- Imported commit: `fe04ea9bf181c7c40aec6a7cbfd7cc4bb75236dd`
- Bundled package: `@linxin666/dsh-pet@0.1.2`
- License: BSD-3-Clause
- Copyright: Copyright (c) 2026, zhu1090093659
- Reused areas: DSH host/client pet plugin, profile bundle patch, activity-state mapping, drag/show/hide behavior, settings UI, whale sprite renderer, manifest, and package assets.

The required license text is preserved at
`third-party-licenses/ningbainb-dsh-pet-LICENSE`. The whale sprite sheet and
manifest shipped by version 0.1.2 are treated as BSD-3-Clause package assets.
They may be replaced by separately licensed Whale Maid artwork in a later
theme pack without changing the plugin boundary.

## zhu1090093659/dsh-web-ui — skin center and Whale Song

- Source: https://github.com/zhu1090093659/dsh-web-ui
- Bundled packages: `@linxin666/dsh-client-ui-skin-center@0.1.12` and `@linxin666/dsh-client-ui-skin-whale-song@0.1.2`
- Reused areas: DSH skin discovery, live try-on, apply/reset flow, failure rollback, settings card, Whale Song client bundle, previews, and theme artwork.

Whale Song 0.1.2 declares BSD-3-Clause and includes that license. Skin Center
0.1.12 declares Apache-2.0 in package metadata while its bundled `LICENSE`
file contains BSD-3-Clause. This discrepancy is recorded rather than hidden;
the bundled license text is retained at
`third-party-licenses/linxin666-skin-center-LICENSE`. Whale Song's license is
retained at `third-party-licenses/linxin666-whale-song-LICENSE`.

## DeepSeek Harness packages

The application bundles packages published under the `@deepseek-ai` npm
scope. Their package versions and license files are retained inside the
packaged dependency tree. This project is an unofficial community desktop
distribution and is not endorsed by DeepSeek.

## Project whale artwork

The files under `packages/dsh-whale-appearance/assets/prototype/` were
created and supplied by the project owner for this application. The project
owner has authorized their public redistribution under this repository's MIT
License. Their provenance is recorded in
`packages/dsh-whale-appearance/assets/provenance.json`.

## DeepSeek Harness client build helpers

`shared/tsdown.client.ts` and `shared/web-platform.ts` are adapted from the
official DeepSeek Harness client build setup so the local TypeScript/React
plugin can use Harness's client module loader. The upstream package license
files remain in the bundled `@deepseek-ai` dependency tree.
