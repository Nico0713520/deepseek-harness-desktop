import assert from 'node:assert/strict'
import { lstat, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  LEGACY_ADVISOR_PRESET_ID,
  removeManagedAdvisorPreset,
} from '../src/advisor-preset-cleanup.js'

const MANAGED_MARKER = {
  owner: 'deepseek-harness-whale-desktop',
  id: LEGACY_ADVISOR_PRESET_ID,
  schema: 1,
}

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'whale-advisor-cleanup-'))
  const dshHome = path.join(root, 'dsh')
  const target = path.join(dshHome, '.agent-presets', LEGACY_ADVISOR_PRESET_ID)
  return { dshHome, target }
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

test('reports an absent legacy advisor without creating any directories', async () => {
  const input = await fixture()

  assert.deepEqual(await removeManagedAdvisorPreset({ dshHome: input.dshHome }), { status: 'absent' })
  assert.equal(await exists(input.target), false)
})

test('removes only the legacy advisor carrying the exact desktop-managed marker', async () => {
  const input = await fixture()
  await mkdir(input.target, { recursive: true })
  await writeFile(path.join(input.target, '.whale-managed.json'), JSON.stringify(MANAGED_MARKER))
  await writeFile(path.join(input.target, 'agent.cordis.yml'), 'legacy desktop advisor\n')

  assert.deepEqual(await removeManagedAdvisorPreset({ dshHome: input.dshHome }), { status: 'removed' })
  assert.equal(await exists(input.target), false)
})

test('preserves an unmarked user-owned preset with the legacy id', async () => {
  const input = await fixture()
  await mkdir(input.target, { recursive: true })
  await writeFile(path.join(input.target, 'agent.cordis.yml'), 'user owned\n')

  assert.deepEqual(await removeManagedAdvisorPreset({ dshHome: input.dshHome }), { status: 'preserved' })
  assert.equal(await readFile(path.join(input.target, 'agent.cordis.yml'), 'utf8'), 'user owned\n')
})

test('preserves a preset whose marker does not exactly match our legacy ownership', async () => {
  const input = await fixture()
  await mkdir(input.target, { recursive: true })
  await writeFile(path.join(input.target, '.whale-managed.json'), JSON.stringify({
    ...MANAGED_MARKER,
    owner: 'someone-else',
  }))

  assert.deepEqual(await removeManagedAdvisorPreset({ dshHome: input.dshHome }), { status: 'preserved' })
  assert.equal(await exists(input.target), true)
})
