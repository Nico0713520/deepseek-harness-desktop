import assert from 'node:assert/strict'
import test from 'node:test'
import { checkReleaseAssets, checkRequiredReleaseFiles } from '../scripts/check-release-assets.mjs'

test('public releases reject prototype-only artwork', () => {
  assert.throws(() => checkReleaseAssets({ assets: [
    { file: 'assets/prototype/whale-maid.jpg', redistribution: 'prototype-only' },
  ] }, { allowPrototype: false }), /whale-maid\.jpg/)
})

test('local prototypes can opt in without weakening the public default', () => {
  assert.doesNotThrow(() => checkReleaseAssets({ assets: [
    { file: 'assets/prototype/whale-maid.jpg', redistribution: 'prototype-only' },
  ] }, { allowPrototype: true }))
})

test('release gate requires the Creator Center bundle and advisor knowledge', async () => {
  const seen = []
  const result = await checkRequiredReleaseFiles(['client.js', 'SKILL.md', 'catalog.md'], async file => { seen.push(file) })
  assert.deepEqual(result, { checked: 3 })
  assert.deepEqual(seen, ['client.js', 'SKILL.md', 'catalog.md'])
})
