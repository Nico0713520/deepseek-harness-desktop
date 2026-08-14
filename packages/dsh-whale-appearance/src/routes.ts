import { readFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
import type { AppearanceState } from './service.ts'
import type { PetKind, PetScale, WhaleAppearanceSettings } from './types.ts'

const API = '/api/whale-appearance'
const ASSET = '/whale-appearance/assets'
const PETS: readonly PetKind[] = ['off', 'whale-maid', 'abstract-whale']
const SCALES: readonly PetScale[] = [0.8, 1, 1.2]
const ASSETS = [
  { name: 'whale-maid.jpg', mime: 'image/jpeg' },
  { name: 'abstract-whale.jpg', mime: 'image/jpeg' },
  { name: 'theme-reference.jpg', mime: 'image/jpeg' },
] as const

export function appearancePackageRoot(importMetaUrl: string): string {
  return fileURLToPath(new URL('../', importMetaUrl))
}

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > 64 * 1024) {
        reject(new Error('body-too-large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const value = chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString('utf8'))
        resolve(typeof value === 'object' && value !== null ? value as Record<string, unknown> : {})
      } catch {
        reject(new Error('invalid-json'))
      }
    })
    req.on('error', reject)
  })
}

function patchFrom(body: Record<string, unknown>): Partial<WhaleAppearanceSettings> {
  const patch: Partial<WhaleAppearanceSettings> = {}
  if (typeof body.themeEnabled === 'boolean') patch.themeEnabled = body.themeEnabled
  if (body.pet !== undefined) {
    if (!PETS.includes(body.pet as PetKind)) throw new Error('invalid-pet')
    patch.pet = body.pet as PetKind
  }
  if (body.petScale !== undefined) {
    if (!SCALES.includes(body.petScale as PetScale)) throw new Error('invalid-pet-scale')
    patch.petScale = body.petScale as PetScale
  }
  if (body.petPosition !== undefined) {
    if (typeof body.petPosition !== 'object' || body.petPosition === null) throw new Error('invalid-pet-position')
    const raw = body.petPosition as Record<string, unknown>
    if (typeof raw.right !== 'number' || typeof raw.bottom !== 'number') throw new Error('invalid-pet-position')
    patch.petPosition = { right: raw.right, bottom: raw.bottom }
  }
  return patch
}

export function makeAppearanceRoutes(deps: {
  state: Pick<AppearanceState, 'snapshot' | 'update'>
  packageRoot: string
}): WebRoute[] {
  const { state, packageRoot } = deps
  const apiRoutes: WebRoute[] = [
    {
      kind: 'exact',
      path: `${API}/state`,
      handler(req: IncomingMessage, res: ServerResponse): void {
        if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        json(res, 200, state.snapshot())
      },
    },
    {
      kind: 'exact',
      path: `${API}/config`,
      handler(req: IncomingMessage, res: ServerResponse): Promise<void> | void {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        return readJsonBody(req).then(
          body => json(res, 200, state.update(patchFrom(body))),
          error => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }),
        ).catch(error => {
          json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
        })
      },
    },
  ]
  const assetRoutes: WebRoute[] = ASSETS.map(file => ({
    kind: 'exact',
    path: `${ASSET}/${file.name}`,
    handler(req: IncomingMessage, res: ServerResponse): Promise<void> | void {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405)
        res.end()
        return
      }
      return readFile(join(packageRoot, 'assets', 'prototype', file.name)).then(body => {
        res.writeHead(200, {
          'content-type': file.mime,
          'content-length': String(body.byteLength),
          'cache-control': 'no-cache',
        })
        res.end(req.method === 'HEAD' ? undefined : body)
      }, () => {
        res.writeHead(404)
        res.end()
      })
    },
  }))
  return [...apiRoutes, ...assetRoutes]
}
