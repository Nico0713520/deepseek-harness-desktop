import { describe, expect, it, vi } from 'vitest'
import { apply, inject } from './index.ts'

describe('Creator Center client registration', () => {
  it('registers a top-level Settings section between Appearance and Agent presets', () => {
    const registrations: Array<Record<string, unknown>> = []
    const sessionListeners = new Set<() => void>()
    const ctx = {
      get: () => ({
        api: {
          agentPresets: {
            select: vi.fn(async () => ({ result: { ok: true, value: { agentPreset: 'cordis' } } })),
          },
        },
      }),
      sessions: {
        list: {
          getSnapshot: () => ({ current: undefined, byId: {} }),
          subscribe(listener: () => void) {
            sessionListeners.add(listener)
            return () => { sessionListeners.delete(listener) }
          },
        },
      },
      workspaces: { startSession: vi.fn() },
      effect: vi.fn(),
      slots: {
        inject(name: string, factory: () => unknown) {
          expect(name).toBe('settings.section')
          factory()
        },
        register(options: Record<string, unknown>) {
          registrations.push(options)
          return () => {}
        },
      },
    }

    apply(ctx as never)

    expect(inject).toEqual(['slots', 'connection', 'sessions', 'workspaces'])
    expect(registrations).toHaveLength(1)
    expect(registrations[0]).toMatchObject({
      name: 'settings.section',
      id: 'creator-center',
      order: 19,
    })
    expect((registrations[0].label as () => string)()).toBe('创造中心')
    expect(registrations[0].inject).toEqual(expect.any(Function))
  })
})
