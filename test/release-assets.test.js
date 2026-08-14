import assert from 'node:assert/strict'
import test from 'node:test'
import { checkReleaseAssets } from '../scripts/check-release-assets.mjs'

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
