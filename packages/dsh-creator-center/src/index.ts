import type { Context } from '@deepseek-ai/cordis'
import { makeAdvisorStatusRoute, type AdvisorStatusRoute } from './status.ts'

export const name = 'whale-creator-center'
export const inject = ['webServer']

interface CreatorHostContext {
  webServer: { register(route: AdvisorStatusRoute): () => void }
  effect(callback: () => () => void, label: string): void
}

export function apply(ctx: Context): void {
  const host = ctx as unknown as CreatorHostContext
  const route = makeAdvisorStatusRoute({ managed: process.env.WHALE_ADVISOR_MANAGED === '1' })
  host.effect(() => host.webServer.register(route), 'whale-creator-center: advisor status')
}
