import { loadSettings, sanitizeSettings, saveSettings } from './persist.ts'
import type {
  AppearanceSnapshot,
  PetActivity,
  WhaleAppearanceSettings,
} from './types.ts'

export function activityFromPhase(phase: unknown): PetActivity {
  switch (phase) {
    case 'idle': return 'idle'
    case 'thinking': return 'thinking'
    case 'tool': return 'tool'
    case 'waiting': return 'waiting'
    case 'done': return 'completed'
    default: return 'failed'
  }
}

export class AppearanceState {
  private settings: WhaleAppearanceSettings
  private activity: PetActivity = 'idle'

  constructor(private readonly persistDir: string) {
    this.settings = loadSettings(persistDir)
  }

  snapshot(): AppearanceSnapshot {
    return { ...this.settings, petPosition: { ...this.settings.petPosition }, activity: this.activity }
  }

  setActivity(phase: unknown): AppearanceSnapshot {
    this.activity = activityFromPhase(phase)
    return this.snapshot()
  }

  update(patch: Partial<WhaleAppearanceSettings>): AppearanceSnapshot {
    this.settings = sanitizeSettings({
      ...this.settings,
      ...patch,
      petPosition: patch.petPosition === undefined
        ? this.settings.petPosition
        : { ...this.settings.petPosition, ...patch.petPosition },
    })
    saveSettings(this.settings, this.persistDir)
    return this.snapshot()
  }
}
