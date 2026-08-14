import type { AppearanceSnapshot, WhaleAppearanceSettings } from '../types.ts'

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
type Listener = () => void

const EMPTY: AppearanceSnapshot = {
  themeEnabled: false,
  pet: 'off',
  petScale: 1,
  petPosition: { right: 24, bottom: 24 },
  activity: 'idle',
}

export class AppearanceController {
  private snapshot: AppearanceSnapshot = EMPTY
  private readonly listeners = new Set<Listener>()

  constructor(private readonly fetcher: FetchLike = globalThis.fetch.bind(globalThis)) {}

  getSnapshot = (): AppearanceSnapshot => this.snapshot

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private publish(snapshot: AppearanceSnapshot): AppearanceSnapshot {
    this.snapshot = snapshot
    for (const listener of this.listeners) listener()
    return snapshot
  }

  async refresh(): Promise<AppearanceSnapshot> {
    const response = await this.fetcher('/api/whale-appearance/state')
    if (!response.ok) throw new Error(`appearance state failed: ${response.status}`)
    return this.publish(await response.json() as AppearanceSnapshot)
  }

  async patch(patch: Partial<WhaleAppearanceSettings>): Promise<AppearanceSnapshot> {
    const response = await this.fetcher('/api/whale-appearance/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!response.ok) throw new Error(`appearance config failed: ${response.status}`)
    return this.publish(await response.json() as AppearanceSnapshot)
  }
}
