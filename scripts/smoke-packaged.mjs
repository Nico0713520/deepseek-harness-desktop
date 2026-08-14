import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { once } from 'node:events'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startDshService } from '../src/dsh-service.js'
import {
  BUNDLED_FEATURE_PACKAGES,
  provisionBundledPlugin,
} from '../src/plugin-provisioner.js'
import {
  ADVISOR_PRESET_ID,
  isManagedAdvisorProvision,
  provisionAdvisorPreset,
} from '../src/advisor-preset-provisioner.js'

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
  const advisorProvision = await provisionAdvisorPreset({
    dshHome: runtimeHome,
    sourcePresetDir: path.join(resourcesRoot, 'node_modules', '@deepseek-ai', 'dsh', 'config', 'agent-presets', 'cordis'),
    advisorSkillDir: path.join(resourcesRoot, 'node_modules', '@whale-desktop', 'dsh-creator-center', 'advisor'),
  })
  if (advisorProvision.status !== 'installed') {
    throw new Error(`Packaged AI Extension Advisor provisioning failed: ${JSON.stringify(advisorProvision)}`)
  }
  environment.WHALE_ADVISOR_MANAGED = isManagedAdvisorProvision(advisorProvision) ? '1' : '0'
  const advisorComposition = readFileSync(
    path.join(runtimeHome, '.agent-presets', ADVISOR_PRESET_ID, 'agent.cordis.yml'),
    'utf8',
  )
  if (!advisorComposition.includes('<!-- whale-extension-advisor -->')) {
    throw new Error('Packaged AI Extension Advisor marker is missing')
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
  const appearanceStateResponse = await fetch(new URL('/api/whale-appearance/state', url))
  if (!appearanceStateResponse.ok) {
    throw new Error(`Packaged Whale Appearance state returned HTTP ${appearanceStateResponse.status}`)
  }
  const initialAppearance = await appearanceStateResponse.json()
  if (initialAppearance.themeEnabled !== false || initialAppearance.pet !== 'off') {
    throw new Error(`Packaged Whale Appearance did not start from official defaults: ${JSON.stringify(initialAppearance)}`)
  }
  const advisorStatusResponse = await fetch(new URL('/api/whale-creator-center/advisor-status', url))
  const advisorStatus = await advisorStatusResponse.json()
  if (!advisorStatusResponse.ok || advisorStatus.managed !== true) {
    throw new Error(`Packaged AI Extension Advisor status failed: ${JSON.stringify(advisorStatus)}`)
  }
  for (const file of ['whale-maid.jpg', 'abstract-whale.jpg', 'theme-reference.jpg']) {
    const assetResponse = await fetch(new URL(`/whale-appearance/assets/${file}`, url), { method: 'HEAD' })
    if (!assetResponse.ok) {
      throw new Error(`Packaged Whale Appearance asset ${file} returned HTTP ${assetResponse.status}`)
    }
  }
  const applyAppearanceResponse = await fetch(new URL('/api/whale-appearance/config', url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ themeEnabled: true, pet: 'abstract-whale', petScale: 1.2 }),
  })
  const appliedAppearance = await applyAppearanceResponse.json()
  if (!applyAppearanceResponse.ok || appliedAppearance.themeEnabled !== true || appliedAppearance.pet !== 'abstract-whale' || appliedAppearance.petScale !== 1.2) {
    throw new Error(`Packaged Whale Appearance apply failed: ${JSON.stringify(appliedAppearance)}`)
  }
  const resetAppearanceResponse = await fetch(new URL('/api/whale-appearance/config', url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ themeEnabled: false, pet: 'off', petScale: 1, petPosition: { right: 24, bottom: 24 } }),
  })
  const resetAppearance = await resetAppearanceResponse.json()
  if (!resetAppearanceResponse.ok || resetAppearance.themeEnabled !== false || resetAppearance.pet !== 'off') {
    throw new Error(`Packaged official appearance reset failed: ${JSON.stringify(resetAppearance)}`)
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
