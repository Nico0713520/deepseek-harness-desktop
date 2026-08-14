# DeepSeek Harness Desktop Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a rebranded macOS/Windows Electron shell that bundles DeepSeek Harness, starts `dsh web` on a dynamic loopback port, loads the official UI, and shuts down cleanly.

**Architecture:** Import the smallest working source set from `steven-kid/deepseek-harness-desktop` at immutable commit `4dead6e6a47b39d838e88d396cc2eba68dcc7014`, preserve its MIT notice, and keep its existing public seams. Rebrand only product metadata and user-facing labels during this slice; pet, skin, and extension modules remain separate later slices.

**Tech Stack:** Electron 43, Node.js ESM, Node built-in test runner, electron-builder 26, official `@deepseek-ai/dsh` 0.1.0-rc.6 packages, GitHub Actions.

## Global Constraints

- The official `dsh web` renderer remains unmodified.
- DSH binds to `127.0.0.1` and requests port `0`; no fixed port such as 3080 is allowed.
- BrowserWindow uses `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`.
- All copied MIT source and assets retain attribution in `THIRD_PARTY_NOTICES.md` and `third-party-licenses/`.
- Product working name is `DeepSeek Harness Whale Desktop`; npm package name is `deepseek-harness-whale-desktop`; app ID is `com.community.deepseek-harness-whale-desktop`.
- This slice must pass source tests, packaged smoke tests, and macOS arm64 packaging before pet or skin work begins.
- Do not add updater, analytics, account, marketplace, Live2D, or plugin abstractions in this slice.

## File Structure

- `src/dsh-service.js`: resolve, start, detect readiness, and stop bundled DSH.
- `src/main.js`: Electron lifecycle, tray, navigation policy, startup errors, and shutdown.
- `src/window-options.js`: secure BrowserWindow options.
- `src/window-lifecycle.js`: close-to-tray behavior and localized tray actions.
- `src/mac-titlebar.js`: macOS drag region and titlebar integration.
- `src/startup.html`: local startup screen shown before DSH is ready.
- `config/windows-directory-picker.patch.yml`: Windows-only DSH directory-picker patch.
- `native/windows-hidden-console.cs`: source for the no-console Windows launcher.
- `scripts/`: launcher build, after-pack handling, and packaged smoke tests.
- `test/`: public-seam tests for runtime, lifecycle, titlebar, and window security.
- `.github/workflows/release.yml`: cross-platform build matrix and artifact publication.
- `package.json` and `package-lock.json`: pinned runtime, build metadata, and exact dependency graph.
- `assets/`: upstream MIT development icons, recorded in asset provenance and replaced in the theme slice.
- `THIRD_PARTY_NOTICES.md`: readable attribution and copied-path manifest.
- `third-party-licenses/steven-kid-deepseek-harness-desktop-LICENSE`: upstream MIT text.
- `docs/upstream-sources.json`: machine-readable source commit, license, paths, and asset status.

---

### Task 1: Import provenance and license records

**Files:**
- Create: `THIRD_PARTY_NOTICES.md`
- Create: `third-party-licenses/steven-kid-deepseek-harness-desktop-LICENSE`
- Create: `docs/upstream-sources.json`
- Create: `test/provenance.test.js`

**Interfaces:**
- Consumes: immutable upstream commit `4dead6e6a47b39d838e88d396cc2eba68dcc7014`.
- Produces: machine-readable source records consumed by release review and provenance tests.

- [ ] **Step 1: Write the failing provenance test**

```js
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('copied desktop shell records an immutable MIT source', async () => {
  const sources = JSON.parse(await readFile(new URL('../docs/upstream-sources.json', import.meta.url)))
  const shell = sources.find((source) => source.id === 'steven-kid/deepseek-harness-desktop')
  assert.equal(shell.commit, '4dead6e6a47b39d838e88d396cc2eba68dcc7014')
  assert.equal(shell.license, 'MIT')
  assert.equal(shell.repository, 'https://github.com/steven-kid/deepseek-harness-desktop')
  assert.ok(shell.paths.includes('src/'))
  assert.equal(shell.assets, 'temporary-development-assets')
  await readFile(new URL('../third-party-licenses/steven-kid-deepseek-harness-desktop-LICENSE', import.meta.url), 'utf8')
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/provenance.test.js`

Expected: FAIL with `ENOENT` for `docs/upstream-sources.json`.

- [ ] **Step 3: Add the exact source record and license files**

`docs/upstream-sources.json` must contain:

```json
[
  {
    "id": "steven-kid/deepseek-harness-desktop",
    "repository": "https://github.com/steven-kid/deepseek-harness-desktop",
    "commit": "4dead6e6a47b39d838e88d396cc2eba68dcc7014",
    "license": "MIT",
    "paths": ["src/", "test/", "scripts/", "native/", "config/", ".github/workflows/release.yml", "assets/"],
    "assets": "temporary-development-assets"
  }
]
```

Copy the upstream MIT text exactly into `third-party-licenses/steven-kid-deepseek-harness-desktop-LICENSE`. In `THIRD_PARTY_NOTICES.md`, state the repository, commit, MIT license, copied paths, and that the current icons are temporary upstream-licensed development assets.

- [ ] **Step 4: Run the provenance test**

Run: `node --test test/provenance.test.js`

Expected: PASS, one test.

- [ ] **Step 5: Commit**

```bash
git add THIRD_PARTY_NOTICES.md third-party-licenses docs/upstream-sources.json test/provenance.test.js
git commit -m "chore: record desktop shell provenance"
```

### Task 2: Import the DSH runtime lifecycle seam

**Files:**
- Create: `src/dsh-service.js`
- Create: `config/windows-directory-picker.patch.yml`
- Create: `test/dsh-service.test.js`

**Interfaces:**
- Produces: `resolveDshEntry()`, `unpackedPath(value)`, `extractReadyUrl(output)`, `buildDshArgs(entry, options)`, `buildDshCommand(options)`, `startDshService(options)`, and `dshEntryUrl()`.
- Contract: `startDshService()` returns `{ child, ready, stop }`; `ready` resolves only to a URL matching `http://127.0.0.1:<port>`.

- [ ] **Step 1: Import the upstream runtime tests first**

Fetch `test/dsh-service.test.js` from:

```text
https://raw.githubusercontent.com/steven-kid/deepseek-harness-desktop/4dead6e6a47b39d838e88d396cc2eba68dcc7014/test/dsh-service.test.js
```

- [ ] **Step 2: Run the runtime test and verify it fails**

Run: `node --test test/dsh-service.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/dsh-service.js`.

- [ ] **Step 3: Import the tested implementation and Windows patch**

Fetch the exact files at the pinned commit:

```text
src/dsh-service.js
config/windows-directory-picker.patch.yml
```

Verify `buildDshArgs()` contains the literal sequence:

```js
'--profile', 'web', '--host', '127.0.0.1', '--port', '0'
```

and `READY_PATTERN` accepts only `http://127.0.0.1:<digits>`.

- [ ] **Step 4: Run the runtime tests**

Run: `node --test test/dsh-service.test.js`

Expected: PASS for URL extraction, ASAR path conversion, platform commands, and dynamic-port arguments.

- [ ] **Step 5: Commit**

```bash
git add src/dsh-service.js config/windows-directory-picker.patch.yml test/dsh-service.test.js
git commit -m "feat: add bundled DSH lifecycle service"
```

### Task 3: Import secure window and tray behavior

**Files:**
- Create: `src/window-options.js`
- Create: `src/window-lifecycle.js`
- Create: `src/mac-titlebar.js`
- Create: `test/window-options.test.js`
- Create: `test/window-lifecycle.test.js`
- Create: `test/mac-titlebar.test.js`

**Interfaces:**
- Produces: `createWindowOptions(platform, useDarkColors)`, `shouldHideWindowOnClose(isQuitting, hasTray)`, `createTrayMenuTemplate(options)`, and `applyMacTitleBarStyle(webContents)`.
- Contract: Windows and macOS use identical renderer security settings; window-close hides only when a tray is available and the app is not quitting.

- [ ] **Step 1: Import the three upstream public-seam tests**

Import the files under `test/` from the pinned commit, then run:

```bash
node --test test/window-options.test.js test/window-lifecycle.test.js test/mac-titlebar.test.js
```

Expected: FAIL with missing modules under `src/`.

- [ ] **Step 2: Import the three upstream implementations**

Import `src/window-options.js`, `src/window-lifecycle.js`, and `src/mac-titlebar.js` from the pinned commit.

- [ ] **Step 3: Rebrand stable user-facing labels**

In `src/window-options.js`, set:

```js
title: 'DeepSeek Harness Whale Desktop'
```

In `src/window-lifecycle.js`, use these localized labels:

```js
label: isChinese ? '打开 Whale Desktop' : 'Open Whale Desktop'
```

Keep Hide and Quit labels unchanged.

- [ ] **Step 4: Run the window tests**

Run: `node --test test/window-options.test.js test/window-lifecycle.test.js test/mac-titlebar.test.js`

Expected: PASS after updating only title/label literals in their expected values.

- [ ] **Step 5: Commit**

```bash
git add src/window-options.js src/window-lifecycle.js src/mac-titlebar.js test/window-options.test.js test/window-lifecycle.test.js test/mac-titlebar.test.js
git commit -m "feat: add secure desktop window lifecycle"
```

### Task 4: Import the Electron entry point and startup UI

**Files:**
- Create: `src/main.js`
- Create: `src/startup.html`
- Create: `assets/icon.icns`
- Create: `assets/icon.ico`
- Create: `assets/icon.png`
- Create: `assets/tray.png`
- Create: `assets/trayTemplate.png`
- Create: `assets/trayTemplate@2x.png`

**Interfaces:**
- Consumes: `startDshService()`, window options, tray template, and macOS titlebar functions.
- Produces: the Electron application entry point at `src/main.js`.

- [ ] **Step 1: Import the upstream entry point, startup page, and required icons**

Import each listed file from the pinned commit. Do not import the upstream website.

- [ ] **Step 2: Rebrand the application constant and startup copy**

Set in `src/main.js`:

```js
const APP_NAME = 'DeepSeek Harness Whale Desktop'
```

The startup page must display `Whale Desktop is starting DeepSeek Harness…` and must not make an official-product claim.

- [ ] **Step 3: Verify security and navigation policy statically**

Run:

```bash
rg -n "contextIsolation: true|nodeIntegration: false|sandbox: true|setWindowOpenHandler|will-navigate" src
```

Expected: all five controls are present.

- [ ] **Step 4: Commit**

```bash
git add src/main.js src/startup.html assets
git commit -m "feat: launch official Harness UI in desktop shell"
```

### Task 5: Add packaging, pinned dependencies, and release automation

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.npmrc`
- Create: `.gitignore`
- Create: `native/windows-hidden-console.cs`
- Create: `scripts/after-pack.cjs`
- Create: `scripts/build-windows-launcher.ps1`
- Create: `scripts/test-windows-hidden-console.mjs`
- Create: `scripts/smoke-packaged.mjs`
- Create: `test/fixtures/windows-visible-console.cs`
- Create: `.github/workflows/release.yml`

**Interfaces:**
- Produces: `npm test`, `npm run pack`, `npm run dist:mac:arm64`, `npm run dist:mac:x64`, `npm run dist:win`, and `npm run smoke:packaged`.

- [ ] **Step 1: Import packaging support from the pinned commit**

Import all listed files exactly before rebranding. This preserves the already-tested hidden-console launcher and packaged smoke behavior.

- [ ] **Step 2: Rebrand package and builder metadata**

Set these exact `package.json` values:

```json
{
  "name": "deepseek-harness-whale-desktop",
  "version": "0.1.0",
  "description": "An unofficial whale-themed desktop distribution for DeepSeek Harness.",
  "main": "src/main.js",
  "license": "MIT"
}
```

Preserve the upstream exact dependency versions and scripts. In `build`, set:

```json
{
  "appId": "com.community.deepseek-harness-whale-desktop",
  "productName": "DeepSeek Harness Whale Desktop",
  "artifactName": "DeepSeek-Harness-Whale-Desktop-${version}-${arch}.${ext}"
}
```

Set the Windows artifact name to `DeepSeek-Harness-Whale-Desktop-${version}-windows-${arch}.${ext}` and include `THIRD_PARTY_NOTICES.md`, `docs/upstream-sources.json`, and `third-party-licenses/**/*` in packaged files.

- [ ] **Step 3: Regenerate the lockfile metadata without changing pinned versions**

Run: `npm install --package-lock-only --ignore-scripts`

Expected: package and lockfile both identify `deepseek-harness-whale-desktop` version `0.1.0`.

- [ ] **Step 4: Install dependencies**

Run: `npm ci`

Expected: exit code 0 and Electron 43.4.0 installed.

- [ ] **Step 5: Run the complete source test suite**

Run: `npm test`

Expected: all runtime, lifecycle, titlebar, window, and provenance tests pass.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .npmrc .gitignore native scripts test/fixtures .github/workflows/release.yml
git commit -m "build: add cross-platform desktop packaging"
```

### Task 6: Build and smoke-test the macOS application

**Files:**
- Modify only if a test exposes a defect: `src/dsh-service.js`, `src/main.js`, `scripts/smoke-packaged.mjs`, and their corresponding tests.
- Create: `README.md`

**Interfaces:**
- Consumes: packaged Electron app and bundled DSH runtime.
- Produces: a local macOS arm64 app plus a passing packaged smoke test.

- [ ] **Step 1: Build the unpacked application**

Run: `npm run pack -- --mac --arm64`

Expected: an application bundle under `dist/mac-arm64/`.

- [ ] **Step 2: Run the packaged smoke test**

Run: `npm run smoke:packaged -- --app dist/mac-arm64/DeepSeek\ Harness\ Whale\ Desktop.app`

Expected: the packaged app emits a valid loopback URL, returns an HTTP response, exits successfully, and leaves no owned process.

- [ ] **Step 3: Run an interactive local launch check**

Run: `npm start`

Expected: startup page appears first, then the official DSH Web UI loads on a dynamic port; closing through Quit stops DSH. Record only pass/fail and sanitized diagnostics.

- [ ] **Step 4: Add a concise README**

README must state that the project is unofficial, list current platform status, explain the dynamic local runtime, link upstream notices, and provide `npm ci`, `npm test`, `npm start`, and packaging commands. It must not advertise the pet or skin as complete until their slices pass.

- [ ] **Step 5: Run final shell verification**

Run:

```bash
npm test
npm run pack -- --mac --arm64
npm run smoke:packaged -- --app "dist/mac-arm64/DeepSeek Harness Whale Desktop.app"
git status --short
```

Expected: tests and smoke test pass; `git status --short` contains only intentionally generated ignored build output.

- [ ] **Step 6: Commit**

```bash
git add README.md src test scripts
git commit -m "docs: document the working desktop shell"
```

## Self-Review Result

- Spec coverage: desktop startup, dynamic port, official UI preservation, secure window, shutdown, provenance, Mac packaging, Windows workflow, and smoke testing are each assigned to a task.
- Scope: pet, skin, extension academy, signing, updater, and marketplace work are deliberately excluded from this shell plan and remain later vertical slices.
- Placeholder scan: no unresolved implementation placeholders are present.
- Type consistency: lifecycle exports and consumers use the upstream public signatures unchanged.
