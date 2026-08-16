import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const catalogFiles = [
  resolve(repositoryRoot, 'packages/dsh-creator-center/src/client/catalog.ts'),
  resolve(repositoryRoot, 'packages/dsh-creator-center/src/client/additional-catalog.ts'),
]
const outputFile = resolve(repositoryRoot, 'packages/dsh-creator-center/src/client/project-logos.ts')
const cellSize = 32
const columns = 10

function run(command, args, capture = false) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    child.once('error', reject)
    child.once('exit', code => {
      if (code === 0) resolvePromise(capture ? stdout : undefined)
      else reject(new Error(`${command} exited with ${String(code)}: ${stderr.trim()}`))
    })
  })
}

async function catalogOwners() {
  const owners = new Set()
  for (const file of catalogFiles) {
    const source = await readFile(file, 'utf8')
    for (const match of source.matchAll(/https:\/\/github\.com\/([^/'"?#\s]+)/g)) {
      if (match[1] !== undefined) owners.add(match[1])
    }
  }
  return [...owners].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
}

async function repositoryIcons(owners) {
  const fields = owners.map((owner, index) => `o${index}: repositoryOwner(login: ${JSON.stringify(owner)}) { __typename avatarUrl }`).join('\n')
  const query = `query ExtensionProjectLogos {\n${fields}\n}`
  const output = await run('gh', ['api', 'graphql', '-f', `query=${query}`], true)
  const data = JSON.parse(output).data
  return owners.flatMap((owner, index) => {
    const result = data[`o${index}`]
    return typeof result?.avatarUrl === 'string'
      ? [{ owner, avatarUrl: result.avatarUrl }]
      : []
  })
}

async function fetchLogo(entry, sourcePath, framePath) {
  const avatarUrl = new URL(entry.avatarUrl)
  avatarUrl.searchParams.set('s', '64')
  let avatarBytes
  let finalError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(avatarUrl, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'user-agent': 'DeepSeek-Harness-Whale-Desktop-logo-builder' },
      })
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
      avatarBytes = Buffer.from(await response.arrayBuffer())
      break
    } catch (error) {
      finalError = error
      if (attempt < 3) await new Promise(resolvePromise => setTimeout(resolvePromise, attempt * 400))
    }
  }
  if (avatarBytes === undefined) throw finalError ?? new Error('GitHub avatar download failed')
  await writeFile(sourcePath, avatarBytes)
  await run('ffmpeg', [
    '-loglevel', 'error', '-y', '-i', sourcePath,
    '-vf', `scale=${cellSize}:${cellSize}:force_original_aspect_ratio=increase,crop=${cellSize}:${cellSize}`,
    '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', framePath,
  ])
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'whale-extension-logos-'))
  const downloadedDir = join(tempRoot, 'downloaded')
  await mkdir(downloadedDir)

  try {
    const entries = await repositoryIcons(await catalogOwners())
    const results = new Array(entries.length)
    let cursor = 0
    const workers = Array.from({ length: 6 }, async () => {
      while (cursor < entries.length) {
        const index = cursor++
        const entry = entries[index]
        if (entry === undefined) continue
        try {
          const sourcePath = join(downloadedDir, `${String(index).padStart(3, '0')}.source`)
          const framePath = join(downloadedDir, `${String(index).padStart(3, '0')}.rgb`)
          await fetchLogo(entry, sourcePath, framePath)
          results[index] = { owner: entry.owner, framePath }
          process.stdout.write(`✓ ${entry.owner}\n`)
        } catch (error) {
          process.stderr.write(`skip ${entry.owner}: ${error instanceof Error ? error.message : String(error)}\n`)
        }
      }
    })
    await Promise.all(workers)

    const successful = results.filter(Boolean)
    if (successful.length === 0) throw new Error('No GitHub repository-owner icons could be downloaded')

    const rows = Math.ceil(successful.length / columns)
    const spriteWidth = columns * cellSize
    const spriteHeight = rows * cellSize
    const bytesPerPixel = 3
    const spritePixels = Buffer.alloc(spriteWidth * spriteHeight * bytesPerPixel)
    const finalFramePath = successful.at(-1)?.framePath
    if (finalFramePath === undefined) throw new Error('No final logo frame available')
    const finalFrame = await readFile(finalFramePath)
    for (let index = 0; index < columns * rows; index += 1) {
      const result = successful[index]
      const frame = result === undefined ? finalFrame : await readFile(result.framePath)
      if (frame.length !== cellSize * cellSize * bytesPerPixel) {
        throw new Error(`Unexpected raw icon size: ${frame.length}`)
      }
      const tileX = (index % columns) * cellSize
      const tileY = Math.floor(index / columns) * cellSize
      for (let y = 0; y < cellSize; y += 1) {
        const sourceStart = y * cellSize * bytesPerPixel
        const destinationStart = ((tileY + y) * spriteWidth + tileX) * bytesPerPixel
        frame.copy(spritePixels, destinationStart, sourceStart, sourceStart + cellSize * bytesPerPixel)
      }
    }

    const rawSpritePath = join(tempRoot, 'project-logos.rgb')
    await writeFile(rawSpritePath, spritePixels)
    const spritePath = join(tempRoot, 'project-logos.jpg')
    await run('ffmpeg', [
      '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
      '-s', `${spriteWidth}x${spriteHeight}`, '-i', rawSpritePath,
      '-frames:v', '1', '-c:v', 'mjpeg', '-q:v', '5', spritePath,
    ])

    const sprite = await readFile(spritePath)
    const ownerToIndex = Object.fromEntries(successful.map((result, index) => [result.owner.toLowerCase(), index]))
    const generated = [
      '// Generated by scripts/build-extension-project-logo-sprite.mjs. Mirrors the original GitHub RepositoryOwner icons.',
      `export const PROJECT_LOGO_CELL_SIZE = ${cellSize}`,
      `export const PROJECT_LOGO_COLUMNS = ${columns}`,
      `export const PROJECT_LOGO_ROWS = ${rows}`,
      `export const PROJECT_LOGO_SPRITE = ${JSON.stringify(`data:image/jpeg;base64,${sprite.toString('base64')}`)}`,
      `export const PROJECT_LOGO_INDEX: Readonly<Record<string, number>> = ${JSON.stringify(ownerToIndex, null, 2)}`,
      '',
    ].join('\n')
    await writeFile(outputFile, generated)
    process.stdout.write(`Wrote ${successful.length}/${entries.length} repository-owner icons to ${outputFile} (${sprite.length} bytes JPEG)\n`)
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }
}

await main()
