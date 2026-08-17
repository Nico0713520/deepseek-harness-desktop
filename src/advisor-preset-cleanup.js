import { lstat, readFile, rm } from 'node:fs/promises'
import path from 'node:path'

export const LEGACY_ADVISOR_PRESET_ID = 'whale-extension-advisor'

const MARKER_FILE = '.whale-managed.json'
const MARKER_OWNER = 'deepseek-harness-whale-desktop'
const MARKER_SCHEMA = 1

async function inspectTarget(target) {
  try {
    return await lstat(target)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

async function hasExactManagedMarker(target) {
  try {
    const marker = JSON.parse(await readFile(path.join(target, MARKER_FILE), 'utf8'))
    return marker?.owner === MARKER_OWNER
      && marker?.id === LEGACY_ADVISOR_PRESET_ID
      && marker?.schema === MARKER_SCHEMA
  } catch {
    return false
  }
}

export async function removeManagedAdvisorPreset({ dshHome }) {
  const target = path.join(dshHome, '.agent-presets', LEGACY_ADVISOR_PRESET_ID)
  try {
    const stat = await inspectTarget(target)
    if (stat === undefined) return { status: 'absent' }
    if (!stat.isDirectory() || stat.isSymbolicLink() || !await hasExactManagedMarker(target)) {
      return { status: 'preserved' }
    }
    await rm(target, { recursive: true, force: true })
    return { status: 'removed' }
  } catch (error) {
    return { status: 'failed', error: error instanceof Error ? error.message : String(error) }
  }
}
