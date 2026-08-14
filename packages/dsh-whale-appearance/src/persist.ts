import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { PetKind, PetScale, WhaleAppearanceSettings } from './types.ts'

const PETS: readonly PetKind[] = ['off', 'whale-maid', 'abstract-whale']
const SCALES: readonly PetScale[] = [0.8, 1, 1.2]
const MAX_INSET = 10_000

export function appearanceHomeDir(): string {
  return process.env.DSH_HOME ?? join(homedir(), '.dsh')
}

export function defaultSettings(): WhaleAppearanceSettings {
  return {
    themeEnabled: false,
    pet: 'off',
    petScale: 1,
    petPosition: { right: 24, bottom: 24 },
  }
}

function inset(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.round(Math.min(MAX_INSET, Math.max(0, value)))
}

export function sanitizeSettings(value: unknown): WhaleAppearanceSettings {
  const base = defaultSettings()
  if (typeof value !== 'object' || value === null) return base
  const raw = value as Partial<WhaleAppearanceSettings>
  const position = typeof raw.petPosition === 'object' && raw.petPosition !== null
    ? raw.petPosition
    : base.petPosition
  return {
    themeEnabled: typeof raw.themeEnabled === 'boolean' ? raw.themeEnabled : base.themeEnabled,
    pet: PETS.includes(raw.pet as PetKind) ? raw.pet as PetKind : base.pet,
    petScale: SCALES.includes(raw.petScale as PetScale) ? raw.petScale as PetScale : base.petScale,
    petPosition: {
      right: inset(position.right, base.petPosition.right),
      bottom: inset(position.bottom, base.petPosition.bottom),
    },
  }
}

export function loadSettings(dir: string = appearanceHomeDir()): WhaleAppearanceSettings {
  try {
    return sanitizeSettings(JSON.parse(readFileSync(join(dir, 'whale-appearance.json'), 'utf8')))
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(settings: WhaleAppearanceSettings, dir: string = appearanceHomeDir()): void {
  mkdirSync(dir, { recursive: true })
  const target = join(dir, 'whale-appearance.json')
  const temporary = `${target}.tmp`
  writeFileSync(temporary, JSON.stringify(sanitizeSettings(settings), null, 2), 'utf8')
  renameSync(temporary, target)
}
