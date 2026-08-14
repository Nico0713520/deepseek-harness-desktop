import { describe, expect, it, vi } from 'vitest'
import { isManagedAdvisorHost } from './advisor-status.ts'

describe('managed advisor host status', () => {
  it('accepts only an explicit managed response from the desktop host', async () => {
    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({ managed: true }),
    }))

    await expect(isManagedAdvisorHost(fetcher as never)).resolves.toBe(true)
    expect(fetcher).toHaveBeenCalledWith('/api/whale-creator-center/advisor-status', { cache: 'no-store' })
  })

  it('fails closed for conflicts, malformed responses, and network errors', async () => {
    const conflict = vi.fn(async () => ({ ok: true, json: async () => ({ managed: false }) }))
    const malformed = vi.fn(async () => ({ ok: true, json: async () => ({}) }))
    const offline = vi.fn(async () => { throw new Error('offline') })

    await expect(isManagedAdvisorHost(conflict as never)).resolves.toBe(false)
    await expect(isManagedAdvisorHost(malformed as never)).resolves.toBe(false)
    await expect(isManagedAdvisorHost(offline as never)).resolves.toBe(false)
  })
})
