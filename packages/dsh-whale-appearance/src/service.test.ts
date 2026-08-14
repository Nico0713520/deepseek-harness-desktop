import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { activityFromPhase, AppearanceState } from './service.ts'

describe('appearance state', () => {
  it('maps Harness activity to pet activity', () => {
    expect(activityFromPhase('thinking')).toBe('thinking')
    expect(activityFromPhase('tool')).toBe('tool')
    expect(activityFromPhase('done')).toBe('completed')
    expect(activityFromPhase('unexpected')).toBe('failed')
  })

  it('persists only validated configuration fields', () => {
    const dir = mkdtempSync(join(tmpdir(), 'whale-state-'))
    const state = new AppearanceState(dir)
    expect(state.update({
      themeEnabled: true,
      pet: 'whale-maid',
      petScale: 1.2,
      petPosition: { right: -5, bottom: 90 },
    })).toMatchObject({
      themeEnabled: true,
      pet: 'whale-maid',
      petScale: 1.2,
      petPosition: { right: 0, bottom: 90 },
    })
  })
})
