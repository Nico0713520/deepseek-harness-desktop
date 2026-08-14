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
  await readFile(
    new URL('../third-party-licenses/steven-kid-deepseek-harness-desktop-LICENSE', import.meta.url),
    'utf8',
  )
})
