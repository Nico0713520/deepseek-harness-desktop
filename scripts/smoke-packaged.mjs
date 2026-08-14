import { cpSync, mkdtempSync, rmSync } from 'node:fs'
import { once } from 'node:events'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startDshService } from '../src/dsh-service.js'
import {
  BUNDLED_FEATURE_PACKAGES,
  provisionBundledPlugin,
} from '../src/plugin-provisioner.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultAppPath = process.platform === 'win32'
  ? path.join(root, 'dist', 'win-unpacked', 'DeepSeek Harness Whale Desktop.exe')
  : process.platform === 'linux'
    ? path.join(root, 'dist', 'linux-unpacked', 'deepseek-harness')
    : path.join(root, 'dist', process.arch === 'x64' ? 'mac' : 'mac-arm64', 'DeepSeek Harness Whale Desktop.app')
const appPath = process.env.PACKAGED_APP_PATH ?? defaultAppPath
const electronExecutable = process.platform === 'win32' || process.platform === 'linux'
  ? appPath
  : path.join(appPath, 'Contents', 'MacOS', 'DeepSeek Harness Whale Desktop')
const packagedResourcesRoot = process.platform === 'win32' || process.platform === 'linux'
  ? path.join(path.dirname(appPath), 'resources', 'app')
  : path.join(appPath, 'Contents', 'Resources', 'app')
const runtimeHome = mkdtempSync(path.join(os.tmpdir(), 'dsh-packaged-home-'))
const temporaryRoot = process.env.PACKAGED_APP_PATH ? undefined : mkdtempSync(path.join(os.tmpdir(), 'dsh-packaged-smoke-'))
const resourcesRoot = temporaryRoot === undefined
  ? packagedResourcesRoot
  : path.join(temporaryRoot, 'app')

if (temporaryRoot !== undefined) {
  cpSync(packagedResourcesRoot, resourcesRoot, { recursive: true })
}

const entry = path.join(resourcesRoot, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js')
const environment = {
  ...process.env,
  DSH_HOME: runtimeHome,
  DSH_SKINS_DIR: path.join(resourcesRoot, 'node_modules', '@linxin666'),
  NODE_OPTIONS: '',
  NODE_PATH: '',
}
let service

try {
  for (const packageName of BUNDLED_FEATURE_PACKAGES) {
    const provision = await provisionBundledPlugin({
      packageName,
      electronExecutable,
      entry,
      environment,
      packagePath: path.join(resourcesRoot, 'node_modules', ...packageName.split('/')),
    })
    if (provision.status === 'failed') {
      throw new Error(`Packaged feature provisioning failed for ${packageName}: ${provision.error}`)
    }
  }
  service = startDshService({
    electronExecutable,
    entry,
    windowsLauncher: path.join(resourcesRoot, 'assets', 'windows-hidden-console.exe'),
    environment,
  })
  const url = await service.ready
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Packaged DeepSeek Harness returned HTTP ${response.status}`)
  }
  const html = await response.text()
  if (!html.includes('__DSH_BOOT__')) {
    throw new Error('Packaged DeepSeek Harness did not return its Web UI')
  }
  const petStateResponse = await fetch(new URL('/api/pet/state', url))
  if (!petStateResponse.ok) {
    throw new Error(`Packaged whale pet state returned HTTP ${petStateResponse.status}`)
  }
  const petManifestResponse = await fetch(new URL('/pet/whale/pet.json', url))
  if (!petManifestResponse.ok) {
    throw new Error(`Packaged whale pet manifest returned HTTP ${petManifestResponse.status}`)
  }
  const petManifest = await petManifestResponse.json()
  if (petManifest.id !== 'whale-girl' || !Array.isArray(petManifest.frames)) {
    throw new Error('Packaged whale pet did not return its expected asset manifest')
  }
  const skinStateResponse = await fetch(new URL('/api/skin-center/state', url))
  if (!skinStateResponse.ok) {
    throw new Error(`Packaged skin center state returned HTTP ${skinStateResponse.status}`)
  }
  const skinState = await skinStateResponse.json()
  if (skinState.ok !== true) {
    throw new Error(`Packaged skin center returned invalid state: ${JSON.stringify(skinState)}`)
  }
  const skinBundleResponse = await fetch(new URL('/api/skin-center/bundle/whale-song', url))
  if (!skinBundleResponse.ok) {
    throw new Error(`Packaged Whale Song bundle returned HTTP ${skinBundleResponse.status}`)
  }
  const applySkinResponse = await fetch(new URL('/api/skin-center/apply', url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ skin: 'whale-song' }),
  })
  const appliedSkin = await applySkinResponse.json()
  if (!applySkinResponse.ok || appliedSkin.active !== 'whale-song') {
    throw new Error(`Packaged Whale Song apply failed: ${JSON.stringify(appliedSkin)}`)
  }
  const resetSkinResponse = await fetch(new URL('/api/skin-center/apply', url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ official: true }),
  })
  const resetSkin = await resetSkinResponse.json()
  if (!resetSkinResponse.ok || resetSkin.active !== 'none') {
    throw new Error(`Packaged official skin reset failed: ${JSON.stringify(resetSkin)}`)
  }
  if (process.platform === 'win32' && !html.includes('@deepseek-ai/dsh-client-ui-directory-picker-browse')) {
    throw new Error('Packaged Windows app did not mount the browse directory picker')
  }
  console.log(`packaged smoke: ${response.status} ${url}`)
} finally {
  service?.stop()
  if (service?.child.exitCode === null) {
    await once(service.child, 'exit')
  }
  if (temporaryRoot !== undefined) {
    rmSync(temporaryRoot, {
      recursive: true,
      force: true,
      maxRetries: process.platform === 'win32' ? 10 : 0,
      retryDelay: 200,
    })
  }
  rmSync(runtimeHome, {
    recursive: true,
    force: true,
    maxRetries: process.platform === 'win32' ? 10 : 0,
    retryDelay: 200,
  })
}
