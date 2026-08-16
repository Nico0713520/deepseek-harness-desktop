import { EventEmitter } from 'node:events'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  loadUserExtensions,
  makeUserExtensionRoutes,
  saveUserExtensions,
  type UserExtensionRecord,
} from './extensions.ts'

const roots: string[] = []

afterEach(() => {
  vi.restoreAllMocks()
})

function home(): string {
  const dir = mkdtempSync(join(tmpdir(), 'whale-extension-test-'))
  roots.push(dir)
  return dir
}

function record(localPath: string, overrides: Partial<UserExtensionRecord> = {}): UserExtensionRecord {
  return {
    id: 'brainstorming',
    title: 'brainstorming',
    kind: 'skill',
    category: '开发流程',
    summary: '测试 Skill',
    repositoryUrl: 'https://github.com/openai/skills',
    localPath,
    managedBy: 'whale-extension-center',
    installedAt: '2026-08-16T00:00:00.000Z',
    enabled: true,
    ...overrides,
  }
}

function response() {
  return { writeHead: vi.fn(), end: vi.fn() }
}

describe('user extension registry', () => {
  it('returns an empty list for missing or malformed registry data and hides other owners', () => {
    const dshHome = home()
    expect(loadUserExtensions(dshHome)).toEqual([])
    writeFileSync(join(dshHome, 'whale-user-extensions.json'), JSON.stringify([
      record(join(dshHome, 'skills', 'brainstorming')),
      record(join(dshHome, 'skills', 'official'), { id: 'official', managedBy: 'official' as never }),
      { id: 'incomplete' },
    ]))
    expect(loadUserExtensions(dshHome).map(item => item.id)).toEqual(['brainstorming'])
  })

  it('serves only registered user extensions', () => {
    const dshHome = home()
    saveUserExtensions(dshHome, [record(join(dshHome, 'skills', 'brainstorming'))])
    const [route] = makeUserExtensionRoutes(dshHome)
    const res = response()
    route.handler(Object.assign(new EventEmitter(), { method: 'GET' }) as never, res as never)
    expect(res.writeHead).toHaveBeenCalledWith(200, expect.objectContaining({ 'cache-control': 'no-store' }))
    expect(res.end).toHaveBeenCalledWith(expect.stringContaining('brainstorming'))
  })

  it('refuses deletion outside the DSH user extension roots', () => {
    const dshHome = home()
    saveUserExtensions(dshHome, [record('/tmp/not-owned')])
    const [, route] = makeUserExtensionRoutes(dshHome)
    const res = response()
    route.handler(Object.assign(new EventEmitter(), {
      method: 'DELETE',
      url: '/api/whale-creator-center/user-extensions/brainstorming',
    }) as never, res as never)
    expect(res.writeHead).toHaveBeenCalledWith(409, expect.anything())
  })

  it('deletes a managed Skill directory and its registry entry', () => {
    const dshHome = home()
    const skillDir = join(dshHome, 'skills', 'brainstorming')
    mkdirSync(skillDir, { recursive: true })
    writeFileSync(join(skillDir, 'SKILL.md'), '# test')
    saveUserExtensions(dshHome, [record(skillDir)])
    const [, route] = makeUserExtensionRoutes(dshHome)
    const res = response()
    route.handler(Object.assign(new EventEmitter(), {
      method: 'DELETE',
      url: '/api/whale-creator-center/user-extensions/brainstorming',
    }) as never, res as never)
    expect(res.writeHead).toHaveBeenCalledWith(200, expect.anything())
    expect(loadUserExtensions(dshHome)).toEqual([])
  })

  it('removes a plugin record without deleting the profile dependency directory', () => {
    const dshHome = home()
    const pluginPath = join(dshHome, 'profiles', 'web', 'node_modules', '@playwright', 'mcp')
    saveUserExtensions(dshHome, [record(pluginPath, { id: 'playwright-mcp', kind: 'plugin' })])
    const [, route] = makeUserExtensionRoutes(dshHome)
    const res = response()
    route.handler(Object.assign(new EventEmitter(), {
      method: 'DELETE',
      url: '/api/whale-creator-center/user-extensions/playwright-mcp',
    }) as never, res as never)
    expect(res.writeHead).toHaveBeenCalledWith(200, expect.anything())
    expect(loadUserExtensions(dshHome)).toEqual([])
  })
})
