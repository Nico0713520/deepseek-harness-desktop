import { createHash, randomUUID } from 'node:crypto'
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { unpackedPath } from './dsh-service.js'

export const ADVISOR_PRESET_ID = 'whale-extension-advisor'
const MARKER_FILE = '.whale-managed.json'
const MARKER_OWNER = 'deepseek-harness-whale-desktop'
const MARKER_SCHEMA = 1

function packageRoot(specifier) {
  return path.dirname(unpackedPath(fileURLToPath(import.meta.resolve(specifier))))
}

export function resolveOfficialCordisPresetDir() {
  return path.join(packageRoot('@deepseek-ai/dsh/package.json'), 'config', 'agent-presets', 'cordis')
}

export function resolveBundledAdvisorSkillDir() {
  return path.join(packageRoot('@whale-desktop/dsh-creator-center/package.json'), 'advisor')
}

async function exists(file) {
  try {
    await lstat(file)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }
}

async function readMarker(target) {
  try {
    const marker = JSON.parse(await readFile(path.join(target, MARKER_FILE), 'utf8'))
    if (marker?.owner !== MARKER_OWNER || marker?.id !== ADVISOR_PRESET_ID || marker?.schema !== MARKER_SCHEMA) return undefined
    return marker
  } catch {
    return undefined
  }
}

async function digestTree(root, relative = '') {
  const hash = createHash('sha256')
  async function visit(dir, prefix) {
    const entries = await readdir(dir, { withFileTypes: true })
    entries.sort((a, b) => a.name.localeCompare(b.name))
    for (const entry of entries) {
      if (prefix.length === 0 && entry.name === MARKER_FILE) continue
      const rel = prefix.length === 0 ? entry.name : `${prefix}/${entry.name}`
      const full = path.join(dir, entry.name)
      hash.update(`${entry.isDirectory() ? 'd' : 'f'}:${rel}\0`)
      if (entry.isDirectory()) await visit(full, rel)
      else hash.update(await readFile(full))
    }
  }
  await visit(root, relative)
  return hash.digest('hex')
}

function advisorComposition(source) {
  const start = source.indexOf('- id: persona')
  const end = source.indexOf('\n- id: agent-instructions', start)
  if (start < 0 || end < 0) throw new Error('official cordis persona boundary not found')
  const persona = `- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |-
      You are the Whale Desktop AI Extension Advisor powered by {{model}}, running on DeepSeek Harness. Your working directory is {{cwd}}.

      Clearly identify yourself as AI. Before advising, load the whale-extension-advisor Skill and follow its conversation and safety contract.

      You inherit official Creator Mode capabilities, but remain advisory and read-only until the user explicitly asks to start creating the selected solution. Never edit shipped DeepSeek Harness presets or official chat UI source.

      <!-- whale-extension-advisor -->
`
  return source.slice(0, start) + persona + source.slice(end)
}

async function buildStaging({ presetsRoot, sourcePresetDir, advisorSkillDir }) {
  const staging = await mkdtemp(path.join(presetsRoot, '.whale-advisor-stage-'))
  await cp(sourcePresetDir, staging, { recursive: true })
  const compositionPath = path.join(staging, 'agent.cordis.yml')
  const source = await readFile(compositionPath, 'utf8')
  await writeFile(compositionPath, advisorComposition(source), { mode: 0o600 })
  await writeFile(
    path.join(staging, 'preset.yml'),
    'name: AI 扩展顾问（创造模式增强）\ndescription: 面向新手的扩展选型、教程与安全创建顾问；明确确认后才开始修改。\n',
    { mode: 0o600 },
  )
  const targetSkill = path.join(staging, 'skills', ADVISOR_PRESET_ID)
  await rm(targetSkill, { recursive: true, force: true })
  await mkdir(path.dirname(targetSkill), { recursive: true, mode: 0o700 })
  await cp(advisorSkillDir, targetSkill, { recursive: true })
  const contentHash = await digestTree(staging)
  await writeFile(path.join(staging, MARKER_FILE), `${JSON.stringify({
    owner: MARKER_OWNER,
    id: ADVISOR_PRESET_ID,
    schema: MARKER_SCHEMA,
    contentHash,
  }, null, 2)}\n`, { mode: 0o600 })
  return { staging, contentHash }
}

export async function provisionAdvisorPreset({ dshHome, sourcePresetDir, advisorSkillDir }) {
  const presetsRoot = path.join(dshHome, '.agent-presets')
  const target = path.join(presetsRoot, ADVISOR_PRESET_ID)
  let staging
  let backup
  try {
    await mkdir(presetsRoot, { recursive: true, mode: 0o700 })
    const targetExists = await exists(target)
    if (targetExists && await readMarker(target) === undefined) return { status: 'conflict' }

    const built = await buildStaging({ presetsRoot, sourcePresetDir, advisorSkillDir })
    staging = built.staging
    if (targetExists && await digestTree(target) === built.contentHash) {
      await rm(staging, { recursive: true, force: true })
      return { status: 'unchanged' }
    }

    if (!targetExists) {
      await rename(staging, target)
      return { status: 'installed' }
    }

    backup = path.join(presetsRoot, `.whale-advisor-backup-${randomUUID()}`)
    await rename(target, backup)
    try {
      await rename(staging, target)
      await rm(backup, { recursive: true, force: true })
      return { status: 'updated' }
    } catch (error) {
      if (await exists(target)) await rm(target, { recursive: true, force: true })
      await rename(backup, target)
      throw error
    }
  } catch (error) {
    if (staging !== undefined && await exists(staging)) await rm(staging, { recursive: true, force: true })
    return { status: 'failed', error: error instanceof Error ? error.message : String(error) }
  }
}
