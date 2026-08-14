export interface LaunchSessionSummary {
  readonly id: string
  readonly blank: boolean
  readonly agentPreset?: string
}

export interface SessionListState {
  readonly current: string | undefined
  readonly byId: Readonly<Record<string, LaunchSessionSummary>>
}

export interface SessionStore {
  getSnapshot(): SessionListState
  subscribe(listener: () => void): () => void
}

export interface SessionLaunchPort {
  readonly sessions: SessionStore
  startSession(): void
  isPresetAvailable(presetId: string): Promise<boolean>
  selectPreset(sessionId: string, presetId: string): Promise<void>
}

export interface LaunchSnapshot {
  readonly busy: boolean
  readonly error: string | null
  readonly launchedPreset: string | null
}

type Listener = () => void

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

const IDLE: LaunchSnapshot = {
  busy: false,
  error: null,
  launchedPreset: null,
}

export class SessionLauncher {
  private snapshot: LaunchSnapshot = IDLE
  private readonly listeners = new Set<Listener>()
  private readonly unsubscribeSessions: () => void
  private pending: string | undefined
  private applying = false
  private disposed = false

  constructor(private readonly port: SessionLaunchPort) {
    this.unsubscribeSessions = port.sessions.subscribe(() => { void this.reconcile() })
  }

  getSnapshot = (): LaunchSnapshot => this.snapshot

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  launch(presetId: string): void {
    if (this.disposed || this.snapshot.busy) return
    this.pending = presetId
    this.publish({ busy: true, error: null, launchedPreset: null })
    try {
      this.port.startSession()
      void this.reconcile()
    } catch (error) {
      this.pending = undefined
      this.publish({ busy: false, error: messageOf(error), launchedPreset: null })
    }
  }

  clearError(): void {
    if (this.snapshot.error === null) return
    this.publish({ ...this.snapshot, error: null })
  }

  async isPresetAvailable(presetId: string): Promise<boolean> {
    return this.port.isPresetAvailable(presetId)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.pending = undefined
    this.listeners.clear()
    this.unsubscribeSessions()
  }

  private publish(next: LaunchSnapshot): void {
    if (this.disposed) return
    this.snapshot = next
    for (const listener of this.listeners) listener()
  }

  private async reconcile(): Promise<void> {
    const preset = this.pending
    if (this.disposed || preset === undefined || this.applying) return
    const state = this.port.sessions.getSnapshot()
    const session = state.current === undefined ? undefined : state.byId[state.current]
    if (session === undefined || !session.blank) return
    if (session.agentPreset === preset) {
      this.pending = undefined
      this.publish({ busy: false, error: null, launchedPreset: preset })
      return
    }

    this.applying = true
    try {
      await this.port.selectPreset(session.id, preset)
      if (this.disposed) return
      this.pending = undefined
      this.publish({ busy: false, error: null, launchedPreset: preset })
    } catch (error) {
      if (this.disposed) return
      this.pending = undefined
      this.publish({ busy: false, error: messageOf(error), launchedPreset: null })
    } finally {
      this.applying = false
    }
  }
}
