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

test('bundled whale pet records its BSD source and asset provenance', async () => {
  const sources = JSON.parse(await readFile(new URL('../docs/upstream-sources.json', import.meta.url)))
  const pet = sources.find((source) => source.id === 'ningbainb/deepseek-harness-desktop:dsh-pet')

  assert.equal(pet.commit, 'fe04ea9bf181c7c40aec6a7cbfd7cc4bb75236dd')
  assert.equal(pet.package, '@linxin666/dsh-pet@0.1.2')
  assert.equal(pet.license, 'BSD-3-Clause')
  assert.equal(pet.assets, 'BSD-3-Clause-package-assets')
  await readFile(
    new URL('../third-party-licenses/ningbainb-dsh-pet-LICENSE', import.meta.url),
    'utf8',
  )
})
