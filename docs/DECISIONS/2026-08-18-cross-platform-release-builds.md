# Cross-platform release builds

- Date: 2026-08-18
- Owner: Codex

## Previous behavior

The repository had a release workflow, but the latest public release pointed to an older commit and the root package version still reported `0.1.0`. A macOS ARM host could also produce an Intel artifact whose native `sharp` and `koffi` modules were built for the wrong architecture.

## Accepted change

- Release the current product checkpoint as `v0.1.3`.
- Build macOS ARM64 on an ARM macOS runner, macOS x64 on an Intel macOS runner, and Windows x64 on a Windows runner.
- Run the packaged smoke test on the same platform and architecture that produced each artifact.
- Publish only artifacts that pass the platform-native build and smoke checks.

## Reason

Electron packages include native modules. Building one architecture on another host can produce a downloadable package that fails during Harness startup even when packaging itself succeeds.

## Compatibility and migration impact

This changes only release provenance and the public version number. It does not change the official Harness UI, user configuration, extension catalog behavior, or local runtime data.

## Rollback plan

Keep `v0.1.2` available as the previous release. If `v0.1.3` fails in the field, mark it as a pre-release or remove its assets and direct users to `v0.1.2` while fixing the release workflow.
