import assert from 'node:assert/strict'
import test from 'node:test'
import {
  BUNDLED_FEATURE_PACKAGES,
  provisionBundledPet,
  provisionBundledPlugin,
} from '../src/plugin-provisioner.js'

test('provisions whale appearance directly into the official Settings surface', () => {
  assert.deepEqual(BUNDLED_FEATURE_PACKAGES, [
    '@whale-desktop/dsh-whale-appearance',
  ])
})

test('bundled pet provisioning leaves the matching profile link unchanged', async () => {
  let installs = 0
  const result = await provisionBundledPet({
    packagePath: '/app/node_modules/@linxin666/dsh-pet',
    inspect: async () => ({
      spec: 'link:/app/node_modules/@linxin666/dsh-pet',
      linked: true,
    }),
    install: async () => { installs += 1 },
  })

  assert.deepEqual(result, { status: 'unchanged' })
  assert.equal(installs, 0)
})

test('bundled pet provisioning installs a missing profile link', async () => {
  const result = await provisionBundledPet({
    packagePath: '/app/node_modules/@linxin666/dsh-pet',
    inspect: async () => ({ spec: undefined, linked: false }),
    install: async (spec) => assert.equal(spec, 'link:/app/node_modules/@linxin666/dsh-pet'),
  })

  assert.deepEqual(result, { status: 'installed' })
})

test('bundled pet provisioning reports failure without throwing', async () => {
  const result = await provisionBundledPet({
    packagePath: '/app/node_modules/@linxin666/dsh-pet',
    inspect: async () => ({ spec: undefined, linked: false }),
    install: async () => { throw new Error('profile is read-only') },
  })

  assert.equal(result.status, 'failed')
  assert.match(result.error, /profile is read-only/)
})

test('bundled plugin provisioning links the requested skin package', async () => {
  const result = await provisionBundledPlugin({
    packageName: '@linxin666/dsh-client-ui-skin-whale-song',
    packagePath: '/app/node_modules/@linxin666/dsh-client-ui-skin-whale-song',
    inspect: async () => ({ spec: undefined, linked: false }),
    install: async (spec) => assert.equal(
      spec,
      'link:/app/node_modules/@linxin666/dsh-client-ui-skin-whale-song',
    ),
  })

  assert.deepEqual(result, { status: 'installed' })
})
