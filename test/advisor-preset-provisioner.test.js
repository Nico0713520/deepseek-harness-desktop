import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  ADVISOR_PRESET_ID,
  provisionAdvisorPreset,
} from '../src/advisor-preset-provisioner.js'

const OFFICIAL_COMPOSITION = `# official cordis fixture
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |-
      Official Creator Mode persona.

- id: agent-instructions
  name: '@deepseek-ai/dsh-agent-instructions'

- id: skill-filesystem
  name: '@deepseek-ai/dsh-skill-filesystem'
  config:
    customSkillDirs:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('skills/', baseUrl))"

- id: tool-skill
  name: '@deepseek-ai/dsh-tool-skill'
`

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'whale-advisor-test-'))
  const dshHome = path.join(root, 'dsh')
  const sourcePresetDir = path.join(root, 'official-cordis')
  const advisorSkillDir = path.join(root, 'advisor-skill')
  await mkdir(path.join(sourcePresetDir, 'skills', 'editing-cordis-compositions'), { recursive: true })
  await mkdir(path.join(advisorSkillDir, 'knowledge'), { recursive: true })
  await writeFile(path.join(sourcePresetDir, 'agent.cordis.yml'), OFFICIAL_COMPOSITION)
  await writeFile(path.join(sourcePresetDir, 'preset.yml'), 'name: 创造模式\ndescription: official fixture\norder: 4\n')
  await writeFile(path.join(sourcePresetDir, 'skills', 'editing-cordis-compositions', 'SKILL.md'), '# official authoring skill\n')
  await writeFile(path.join(advisorSkillDir, 'SKILL.md'), '# whale-extension-advisor\n')
  await writeFile(path.join(advisorSkillDir, 'knowledge', 'decision-tree.md'), '# choose the least invasive type\n')
  return { root, dshHome, sourcePresetDir, advisorSkillDir }
}

test('installs a managed advisor without changing the official Cordis preset', async () => {
  const input = await fixture()
  const before = await readFile(path.join(input.sourcePresetDir, 'agent.cordis.yml'), 'utf8')

  const result = await provisionAdvisorPreset(input)

  assert.equal(result.status, 'installed')
  const target = path.join(input.dshHome, '.agent-presets', ADVISOR_PRESET_ID)
  assert.match(await readFile(path.join(target, 'preset.yml'), 'utf8'), /AI 扩展顾问/)
  assert.match(await readFile(path.join(target, 'agent.cordis.yml'), 'utf8'), /whale-extension-advisor/)
  assert.match(await readFile(path.join(target, 'skills', ADVISOR_PRESET_ID, 'SKILL.md'), 'utf8'), /whale-extension-advisor/)
  assert.equal(await readFile(path.join(input.sourcePresetDir, 'agent.cordis.yml'), 'utf8'), before)
})

test('leaves matching managed content unchanged and updates a changed knowledge version', async () => {
  const input = await fixture()
  assert.equal((await provisionAdvisorPreset(input)).status, 'installed')
  assert.equal((await provisionAdvisorPreset(input)).status, 'unchanged')

  await writeFile(path.join(input.advisorSkillDir, 'SKILL.md'), '# whale-extension-advisor\nupdated knowledge\n')
  assert.equal((await provisionAdvisorPreset(input)).status, 'updated')

  const target = path.join(input.dshHome, '.agent-presets', ADVISOR_PRESET_ID)
  assert.match(await readFile(path.join(target, 'skills', ADVISOR_PRESET_ID, 'SKILL.md'), 'utf8'), /updated knowledge/)
})

test('does not overwrite an unmarked preset using the advisor id', async () => {
  const input = await fixture()
  const target = path.join(input.dshHome, '.agent-presets', ADVISOR_PRESET_ID)
  await mkdir(target, { recursive: true })
  await writeFile(path.join(target, 'agent.cordis.yml'), 'user owned\n')

  const result = await provisionAdvisorPreset(input)

  assert.equal(result.status, 'conflict')
  assert.equal(await readFile(path.join(target, 'agent.cordis.yml'), 'utf8'), 'user owned\n')
})

test('reports a malformed official preset without leaving a partial target', async () => {
  const input = await fixture()
  await writeFile(path.join(input.sourcePresetDir, 'agent.cordis.yml'), '[]\n')

  const result = await provisionAdvisorPreset(input)

  assert.equal(result.status, 'failed')
  assert.match(result.error, /persona boundary/)
})
