import { describe, expect, it, vi } from 'vitest'
import { apply, inject } from './index.ts'

describe('Creator Center client registration', () => {
  it('registers a top-level Settings section and mirrors a selected preset into session state', async () => {
    const registrations: Array<Record<string, unknown>> = []
    const sessionListeners = new Set<() => void>()
    const noteAgentPreset = vi.fn()
    const apiSelect = vi.fn(async () => ({ result: { ok: true, value: { agentPreset: 'whale-extension-advisor' } } }))
    const presetSelect = vi.fn(async (presetId: string) => {
      noteAgentPreset('blank-session', presetId)
    })
    const ctx = {
      get: () => ({
        api: {
          agentPresets: {
            select: apiSelect,
          },
        },
      }),
      sessions: {
        list: {
          getSnapshot: () => ({
            current: 'blank-session',
            byId: {
              'blank-session': { id: 'blank-session', blank: true },
            },
          }),
          subscribe(listener: () => void) {
            sessionListeners.add(listener)
            return () => { sessionListeners.delete(listener) }
          },
        },
        noteAgentPreset,
      },
      workspaces: { startSession: vi.fn() },
      effect: vi.fn(),
      slots: {
        entriesOfSlot(name: string) {
          expect(name).toBe('conversation.hero.agentPreset')
          return [{ inject: () => ({ select: presetSelect }) }]
        },
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

    expect(inject).toEqual(['slots', 'sessions', 'workspaces'])
    expect(registrations).toHaveLength(1)
    expect(registrations[0]).toMatchObject({
      name: 'settings.section',
      id: 'creator-center',
      order: 19,
    })
    expect((registrations[0].label as () => string)()).toBe('创造中心')
    expect(registrations[0].inject).toEqual(expect.any(Function))

    const injected = (registrations[0].inject as () => { launcher: { launch(presetId: string): void } })()
    injected.launcher.launch('whale-extension-advisor')
    await vi.waitFor(() => {
      expect(noteAgentPreset).toHaveBeenCalledWith('blank-session', 'whale-extension-advisor')
    })
    expect(presetSelect).toHaveBeenCalledWith('whale-extension-advisor')
    expect(apiSelect).not.toHaveBeenCalled()
  })
})
