import { spawn } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveDshEntry, unpackedPath } from './dsh-service.js'

const PET_PACKAGE = '@linxin666/dsh-pet'

export function resolveBundledPetPackage() {
  return path.dirname(unpackedPath(fileURLToPath(import.meta.resolve(`${PET_PACKAGE}/package.json`))))
}

async function inspectProfileLink({ dshHome, packagePath }) {
  const profileDir = path.join(dshHome, 'profiles', 'web')
  let spec
  try {
    const profile = JSON.parse(await readFile(path.join(profileDir, 'package.json'), 'utf8'))
    spec = profile.dependencies?.[PET_PACKAGE]
  } catch {
    spec = undefined
  }

  let linked = false
  try {
    await access(path.join(profileDir, 'node_modules', '@linxin666', 'dsh-pet'))
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
        reject(new Error(`pet profile link failed (code ${String(code)}, signal ${String(signal)}).\n${output}`))
      }
    })
  })
}

export async function provisionBundledPet({
  electronExecutable,
  entry = resolveDshEntry(),
  environment = process.env,
  packagePath = resolveBundledPetPackage(),
  inspect,
  install,
} = {}) {
  const spec = `link:${packagePath}`
  const inspectLink = inspect ?? (() => {
    if (!environment.DSH_HOME) throw new Error('DSH_HOME is required for bundled plugin provisioning')
    return inspectProfileLink({ dshHome: environment.DSH_HOME, packagePath })
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
