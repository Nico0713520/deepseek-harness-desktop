import { access, readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

export function checkReleaseAssets(manifest, { allowPrototype = false } = {}) {
  const blocked = (manifest.assets ?? []).filter(asset => asset.redistribution === 'prototype-only')
  if (blocked.length > 0 && !allowPrototype) {
    throw new Error(`Prototype-only artwork cannot enter a public release: ${blocked.map(asset => asset.file).join(', ')}`)
  }
  return { blocked: blocked.length }
}

export async function checkRequiredReleaseFiles(files, checker = access) {
  await Promise.all(files.map(file => checker(file)))
  return { checked: files.length }
}

async function main() {
  const manifestUrl = new URL('../packages/dsh-whale-appearance/assets/provenance.json', import.meta.url)
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'))
  checkReleaseAssets(manifest, { allowPrototype: process.env.WHALE_ALLOW_PROTOTYPE_ASSETS === '1' })
  await checkRequiredReleaseFiles([
    new URL('../packages/dsh-creator-center/lib/client.js', import.meta.url),
    new URL('../packages/dsh-creator-center/advisor/SKILL.md', import.meta.url),
    new URL('../packages/dsh-creator-center/advisor/knowledge/decision-tree.md', import.meta.url),
    new URL('../packages/dsh-creator-center/advisor/knowledge/catalog.md', import.meta.url),
  ])
  process.stdout.write('Release artwork policy passed.\n')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
}
