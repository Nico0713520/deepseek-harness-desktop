import { describe, expect, it, vi } from 'vitest'
import { apply } from './index.ts'

describe('Whale Appearance client registration', () => {
  it('exposes appearance as a top-level Settings section', () => {
    const injected: string[] = []
    const registrations: Array<Record<string, unknown>> = []
    const ctx = {
      effect: vi.fn(),
      slots: {
        inject(name: string, factory: () => unknown) {
          injected.push(name)
          factory()
        },
        register(options: Record<string, unknown>) {
          registrations.push(options)
          return () => {}
        },
      },
    }

    apply(ctx as never)

    expect(injected).toContain('settings.section')
    expect(injected).toContain('shell.overlay')
    expect(injected).not.toContain('web-ui.plugin.item')
    const appearance = registrations.find(item => item.name === 'settings.section')
    expect(appearance?.id).toBe('appearance')
    expect((appearance?.label as () => string)()).toBe('外观')
  })
})
