import { describe, expect, it, vi } from 'vitest'
import { SessionLauncher, type SessionListState, type SessionStore } from './session-launcher.ts'

function harness(initial: SessionListState) {
  let snapshot = initial
  const listeners = new Set<() => void>()
  const sessions: SessionStore = {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
  const publish = (next: SessionListState): void => {
    snapshot = next
    for (const listener of listeners) listener()
  }
  const startSession = vi.fn()
  const selectPreset = vi.fn(async () => {})
  const isPresetAvailable = vi.fn(async () => true)
  const launcher = new SessionLauncher({ sessions, startSession, selectPreset, isPresetAvailable })
  return { launcher, publish, startSession, selectPreset, isPresetAvailable }
}

async function settle(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
}

describe('SessionLauncher', () => {
  it('exposes host preset availability for launch controls', async () => {
    const kit = harness({ current: undefined, byId: {} })
    kit.isPresetAvailable.mockResolvedValue(false)
    await expect(kit.launcher.isPresetAvailable('cordis')).resolves.toBe(false)
  })

  it('stages a preset and applies it only after a blank session becomes current', async () => {
    const kit = harness({
      current: 'running',
      byId: { running: { id: 'running', blank: false, agentPreset: 'standard' } },
    })

    kit.launcher.launch('cordis')
    expect(kit.startSession).toHaveBeenCalledOnce()
    expect(kit.selectPreset).not.toHaveBeenCalled()

    kit.publish({ current: 'new', byId: { new: { id: 'new', blank: true, agentPreset: 'standard' } } })
    await settle()

    expect(kit.selectPreset).toHaveBeenCalledWith('new', 'cordis')
    expect(kit.launcher.getSnapshot()).toEqual({ busy: false, error: null, launchedPreset: 'cordis' })
  })

  it('can reuse the blank session that is already current', async () => {
    const kit = harness({ current: 'blank', byId: { blank: { id: 'blank', blank: true } } })

    kit.launcher.launch('whale-extension-advisor')
    await settle()

    expect(kit.selectPreset).toHaveBeenCalledWith('blank', 'whale-extension-advisor')
  })

  it('coalesces repeated launch clicks while a selection is pending', async () => {
    let finish!: () => void
    const kit = harness({ current: 'blank', byId: { blank: { id: 'blank', blank: true } } })
    kit.selectPreset.mockImplementation(() => new Promise<void>(resolve => { finish = resolve }))

    kit.launcher.launch('cordis')
    kit.launcher.launch('whale-extension-advisor')

    expect(kit.startSession).toHaveBeenCalledOnce()
    expect(kit.selectPreset).toHaveBeenCalledOnce()
    finish()
    await settle()
  })

  it('surfaces preset selection failures and clears the pending stage', async () => {
    const kit = harness({ current: 'blank', byId: { blank: { id: 'blank', blank: true } } })
    kit.selectPreset.mockRejectedValue(new Error('advisor preset is broken'))

    kit.launcher.launch('whale-extension-advisor')
    await settle()

    expect(kit.launcher.getSnapshot()).toEqual({
      busy: false,
      error: 'advisor preset is broken',
      launchedPreset: null,
    })
  })

  it('never applies a staged preset to a nonblank conversation', async () => {
    const kit = harness({ current: 'running', byId: { running: { id: 'running', blank: false } } })

    kit.launcher.launch('cordis')
    kit.publish({ current: 'other', byId: { other: { id: 'other', blank: false } } })
    await settle()

    expect(kit.selectPreset).not.toHaveBeenCalled()
    expect(kit.launcher.getSnapshot().busy).toBe(true)
  })
})
