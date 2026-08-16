import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

export const USER_EXTENSION_OWNER = 'whale-extension-center'
export const USER_EXTENSION_REGISTRY = 'whale-user-extensions.json'

export interface UserExtensionWebRoute {
  readonly kind: 'exact' | 'prefix'
  readonly path: string
  readonly handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
}

export type UserExtensionKind = 'skill' | 'plugin'

export interface UserExtensionRecord {
  readonly id: string
  readonly title: string
  readonly kind: UserExtensionKind
  readonly category: string
  readonly summary: string
  readonly repositoryUrl: string
  readonly localPath: string
  readonly managedBy: typeof USER_EXTENSION_OWNER
  readonly installedAt: string
  readonly enabled: boolean
  readonly localTestOnly?: boolean
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isKind(value: unknown): value is UserExtensionKind {
  return value === 'skill' || value === 'plugin'
}

function normalizeRecord(value: unknown): UserExtensionRecord | undefined {
  if (!isRecord(value)) return undefined
  const requiredStrings = ['id', 'title', 'category', 'summary', 'repositoryUrl', 'localPath', 'installedAt']
  if (!requiredStrings.every(key => typeof value[key] === 'string' && value[key].length > 0)) return undefined
  if (!isKind(value.kind) || value.managedBy !== USER_EXTENSION_OWNER || typeof value.enabled !== 'boolean') return undefined
  return {
    id: value.id as string,
    title: value.title as string,
    kind: value.kind,
    category: value.category as string,
    summary: value.summary as string,
    repositoryUrl: value.repositoryUrl as string,
    localPath: value.localPath as string,
    managedBy: USER_EXTENSION_OWNER,
    installedAt: value.installedAt as string,
    enabled: value.enabled,
    ...(value.localTestOnly === true ? { localTestOnly: true } : {}),
  }
}

export function userExtensionRegistryPath(dshHome: string): string {
  return join(dshHome, USER_EXTENSION_REGISTRY)
}

export function loadUserExtensions(dshHome: string): UserExtensionRecord[] {
  try {
    const parsed = JSON.parse(readFileSync(userExtensionRegistryPath(dshHome), 'utf8')) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeRecord).filter((item): item is UserExtensionRecord => item !== undefined)
  } catch {
    return []
  }
}

export function saveUserExtensions(dshHome: string, records: readonly UserExtensionRecord[]): void {
  mkdirSync(dshHome, { recursive: true })
  const target = userExtensionRegistryPath(dshHome)
  const temporary = `${target}.tmp`
  writeFileSync(temporary, JSON.stringify(records, null, 2), 'utf8')
  renameSync(temporary, target)
}

function json(res: ServerResponse, status: number, body: unknown): void {
  const encoded = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': String(Buffer.byteLength(encoded)),
  })
  res.end(encoded)
}

function readJsonBody(req: IncomingMessage): Promise<UnknownRecord> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.byteLength
      if (size > 16 * 1024) {
        reject(new Error('body-too-large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const parsed = chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString('utf8'))
        resolveBody(isRecord(parsed) ? parsed : {})
      } catch {
        reject(new Error('invalid-json'))
      }
    })
    req.on('error', reject)
  })
}

function idFromPath(pathname: string): string | undefined {
  const prefix = '/api/whale-creator-center/user-extensions/'
  if (!pathname.startsWith(prefix)) return undefined
  const id = pathname.slice(prefix.length)
  return id.length > 0 && !id.includes('/') ? decodeURIComponent(id) : undefined
}

function isSafeUserPath(dshHome: string, localPath: string): boolean {
  if (!isAbsolute(localPath)) return false
  const root = resolve(dshHome)
  const allowedRoots = [resolve(join(root, 'skills')), resolve(join(root, 'user-extensions'))]
  const candidate = resolve(localPath)
  return allowedRoots.some(allowed => {
    const child = relative(allowed, candidate)
    return child !== '' && child !== '..' && !child.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(child)
  })
}

export function makeUserExtensionRoutes(dshHome: string): UserExtensionWebRoute[] {
  const collectionPath = '/api/whale-creator-center/user-extensions'
  const itemPath = `${collectionPath}/`
  return [
    {
      kind: 'exact',
      path: collectionPath,
      handler(req, res): void {
        if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        json(res, 200, { ok: true, extensions: loadUserExtensions(dshHome) })
      },
    },
    {
      kind: 'prefix',
      path: itemPath,
      handler(req, res): Promise<void> | void {
        const id = idFromPath(new URL(req.url ?? '/', 'http://dsh.local').pathname)
        if (id === undefined) return json(res, 404, { ok: false, error: 'extension-not-found' })
        const records = loadUserExtensions(dshHome)
        const record = records.find(item => item.id === id)
        if (record === undefined) return json(res, 404, { ok: false, error: 'extension-not-found' })

        if (req.method === 'PATCH') {
          return readJsonBody(req).then(body => {
            const enabled = body.enabled
            if (typeof enabled !== 'boolean') return json(res, 400, { ok: false, error: 'invalid-enabled' })
            const next = records.map(item => item.id === id ? { ...item, enabled } : item)
            saveUserExtensions(dshHome, next)
            json(res, 200, { ok: true, extension: next.find(item => item.id === id) })
          }).catch(error => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }))
        }

        if (req.method !== 'DELETE') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        if (record.kind === 'plugin') {
          saveUserExtensions(dshHome, records.filter(item => item.id !== id))
          return json(res, 200, { ok: true, removed: id, localFilesRetained: true })
        }
        if (!isSafeUserPath(dshHome, record.localPath)) {
          return json(res, 409, { ok: false, error: 'extension-path-is-not-user-owned' })
        }
        try {
          rmSync(record.localPath, { recursive: true, force: true })
          saveUserExtensions(dshHome, records.filter(item => item.id !== id))
          json(res, 200, { ok: true, removed: id })
        } catch (error) {
          json(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) })
        }
      },
    },
  ]
}
