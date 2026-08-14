import { spawn } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveDshEntry, unpackedPath } from './dsh-service.js'

const PET_PACKAGE = '@linxin666/dsh-pet'
const WHALE_SKIN_PACKAGE = '@linxin666/dsh-client-ui-skin-whale-song'
export const BUNDLED_FEATURE_PACKAGES = [
  PET_PACKAGE,
  '@linxin666/dsh-client-ui-skin-center',
  WHALE_SKIN_PACKAGE,
]

export function resolveBundledPackage(packageName) {
  return path.dirname(unpackedPath(fileURLToPath(import.meta.resolve(`${packageName}/package.json`))))
}

export function resolveBundledPetPackage() {
  return resolveBundledPackage(PET_PACKAGE)
}

export function resolveBundledSkinsDirectory() {
  return path.dirname(resolveBundledPackage(WHALE_SKIN_PACKAGE))
}

async function inspectProfileLink({ dshHome, packageName, packagePath }) {
  const profileDir = path.join(dshHome, 'profiles', 'web')
  let spec
  try {
    const profile = JSON.parse(await readFile(path.join(profileDir, 'package.json'), 'utf8'))
    spec = profile.dependencies?.[packageName]
  } catch {
    spec = undefined
  }

  let linked = false
  try {
    await access(path.join(profileDir, 'node_modules', ...packageName.split('/')))
    linked = true
  } catch {
    linked = false
  }
  return { spec, linked, packagePath }
}

function installProfileLink({ electronExecutable, entry, environment, spec }) {
  if (!electronExecutable) throw new Error('electronExecutable is required')
  return new Promise((resolve, reject) => {
    const child = spawn(electronExecutable, [
      '--expose-internals',
      entry,
      'plugin',
      '--profile',
      'web',
      'add',
      spec,
      '--offline',
      '--ignore-scripts',
    ], {
      env: {
        ...environment,
        ELECTRON_RUN_AS_NODE: '1',
        NODE_OPTIONS: '',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let output = ''
    const collect = (chunk) => {
      output = `${output}${chunk.toString()}`.slice(-12_000)
    }
    child.stdout.on('data', collect)
    child.stderr.on('data', collect)
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`plugin profile link failed (code ${String(code)}, signal ${String(signal)}).\n${output}`))
      }
    })
  })
}

export async function provisionBundledPlugin({
  packageName,
  electronExecutable,
  entry = resolveDshEntry(),
  environment = process.env,
  packagePath = resolveBundledPackage(packageName),
  inspect,
  install,
} = {}) {
  const spec = `link:${packagePath}`
  const inspectLink = inspect ?? (() => {
    if (!environment.DSH_HOME) throw new Error('DSH_HOME is required for bundled plugin provisioning')
    return inspectProfileLink({
      dshHome: environment.DSH_HOME,
      packageName,
      packagePath,
    })
  })
  const installLink = install ?? ((requestedSpec) => installProfileLink({
    electronExecutable,
    entry,
    environment,
    spec: requestedSpec,
  }))

  try {
    const current = await inspectLink()
    if (current.spec === spec && current.linked) return { status: 'unchanged' }
    await installLink(spec)
    return { status: 'installed' }
  } catch (error) {
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export function provisionBundledPet(options = {}) {
  return provisionBundledPlugin({ ...options, packageName: PET_PACKAGE })
}

export async function provisionBundledFeatures({
  packages = BUNDLED_FEATURE_PACKAGES,
  ...options
} = {}) {
  const results = {}
  for (const packageName of packages) {
    results[packageName] = await provisionBundledPlugin({
      ...options,
      packageName,
    })
  }
  return results
}
