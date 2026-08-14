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

test('bundled skin center and Whale Song record exact packages and licenses', async () => {
  const sources = JSON.parse(await readFile(new URL('../docs/upstream-sources.json', import.meta.url)))
  const center = sources.find((source) => source.id === 'zhu1090093659/dsh-web-ui:skin-center')
  const whaleSong = sources.find((source) => source.id === 'zhu1090093659/dsh-web-ui:whale-song')

  assert.equal(center.package, '@linxin666/dsh-client-ui-skin-center@0.1.12')
  assert.equal(center.license, 'Apache-2.0 metadata; BSD-3-Clause bundled LICENSE')
  assert.equal(whaleSong.package, '@linxin666/dsh-client-ui-skin-whale-song@0.1.2')
  assert.equal(whaleSong.license, 'BSD-3-Clause')
  await readFile(new URL('../third-party-licenses/linxin666-skin-center-LICENSE', import.meta.url), 'utf8')
  await readFile(new URL('../third-party-licenses/linxin666-whale-song-LICENSE', import.meta.url), 'utf8')
})
