import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply, inject } from './index.ts'

afterEach(() => { vi.unstubAllGlobals() })

describe('Creator Center client registration', () => {
  it('registers a top-level Settings section and mirrors a selected preset into session state', async () => {
    const advisorStatus = vi.fn(async () => ({ ok: true, json: async () => ({ managed: true }) }))
    vi.stubGlobal('fetch', advisorStatus)
    const registrations: Array<Record<string, unknown>> = []
    const injectedSlots: string[] = []
    const sessionListeners = new Set<() => void>()
    const noteAgentPreset = vi.fn()
    const apiRead = vi.fn(async () => ({
      result: { ok: true, value: { content: '<!-- whale-extension-advisor -->' } },
    }))
    const apiList = vi.fn(async () => ({
      result: { ok: true, value: { presets: [{ id: 'cordis' }, { id: 'whale-extension-advisor' }] } },
    }))
    let sessionState = {
      current: 'blank-session',
      byId: {
        'blank-session': { id: 'blank-session', blank: true, agentPreset: 'standard' },
      },
    }
    let seatState = { current: 'standard', error: null as string | null }
    const presetSelect = vi.fn(async (presetId: string) => {
      seatState = { current: presetId, error: null }
      sessionState = {
        ...sessionState,
        byId: {
          'blank-session': { ...sessionState.byId['blank-session'], agentPreset: presetId },
        },
      }
      noteAgentPreset('blank-session', presetId)
    })
    const ctx = {
      get: () => ({
        api: {
          agentPresets: {
            list: apiList,
            read: apiRead,
          },
        },
      }),
      sessions: {
        list: {
          getSnapshot: () => sessionState,
          subscribe(listener: () => void) {
            sessionListeners.add(listener)
            return () => { sessionListeners.delete(listener) }
          },
        },
        noteAgentPreset,
      },
      workspaces: { startSession: vi.fn() },
      layout: { closeDetails: vi.fn() },
      effect: vi.fn(),
      slots: {
        entriesOfSlot(name: string) {
          expect(name).toBe('conversation.hero.agentPreset')
          return [{ inject: () => ({
            hooks: { agentPresetSeat: { getSnapshot: () => seatState } },
            select: presetSelect,
          }) }]
        },
        inject(name: string, factory: () => unknown) {
          injectedSlots.push(name)
          factory()
        },
        register(options: Record<string, unknown>) {
          registrations.push(options)
          return () => {}
        },
      },
    }

    apply(ctx as never)

    expect(inject).toEqual(['slots', 'connection', 'sessions', 'workspaces', 'layout'])
    expect(injectedSlots).toEqual(['sidebar.primary.action', 'sidebar.primary.action', 'shell.overlay'])
    expect(registrations.map(item => [item.name, item.id, item.order])).toEqual([
      ['sidebar.primary.action', 'creator-center', 10],
      ['sidebar.primary.action', 'my-extensions', 20],
      ['shell.overlay', 'creator-center', 60],
    ])
    expect(registrations[2].inject).toEqual(expect.any(Function))

    const injected = (registrations[2].inject as () => { launcher: { launch(presetId: string): void } })()
    injected.launcher.launch('whale-extension-advisor')
    await vi.waitFor(() => {
      expect(noteAgentPreset).toHaveBeenCalledWith('blank-session', 'whale-extension-advisor')
    })
    expect(presetSelect).toHaveBeenCalledWith('whale-extension-advisor')
    expect(advisorStatus).toHaveBeenCalledOnce()
    expect(apiRead).toHaveBeenCalledWith({ agentPreset: 'whale-extension-advisor' })
  })
})
