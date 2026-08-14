import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  defaultSettings,
  loadSettings,
  sanitizeSettings,
  saveSettings,
} from './persist.ts'

describe('whale appearance persistence', () => {
  it('uses the official appearance and no pet by default', () => {
    const missingDir = join(tmpdir(), `missing-whale-appearance-${Date.now()}`)
    expect(loadSettings(missingDir)).toEqual({
      themeEnabled: false,
      pet: 'off',
      petScale: 1,
      petPosition: { right: 24, bottom: 24 },
    })
  })

  it('rejects unknown choices instead of persisting them', () => {
    expect(sanitizeSettings({ pet: 'unknown', petScale: 99 })).toEqual(defaultSettings())
  })

  it('round-trips a valid selection through the public file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'whale-appearance-'))
    const settings = {
      themeEnabled: true,
      pet: 'abstract-whale' as const,
      petScale: 1.2 as const,
      petPosition: { right: 80, bottom: 120 },
    }
    saveSettings(settings, dir)
    expect(loadSettings(dir)).toEqual(settings)
    expect(JSON.parse(readFileSync(join(dir, 'whale-appearance.json'), 'utf8'))).toEqual(settings)
  })
})
