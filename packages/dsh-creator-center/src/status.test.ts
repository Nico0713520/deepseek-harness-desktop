import { EventEmitter } from 'node:events'
import { describe, expect, it, vi } from 'vitest'
import { makeAdvisorStatusRoute } from './status.ts'

describe('advisor status route', () => {
  it('publishes the authoritative desktop provisioning result', () => {
    const route = makeAdvisorStatusRoute({ managed: true })
    const req = Object.assign(new EventEmitter(), { method: 'GET' })
    const writeHead = vi.fn()
    const end = vi.fn()

    route.handler(req as never, { writeHead, end } as never)

    expect(route.path).toBe('/api/whale-creator-center/advisor-status')
    expect(writeHead).toHaveBeenCalledWith(200, expect.objectContaining({ 'cache-control': 'no-store' }))
    expect(end).toHaveBeenCalledWith(JSON.stringify({ managed: true }))
  })
})
