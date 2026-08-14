import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type { Session } from '@deepseek-ai/dsh-session'
import { appearanceHomeDir } from './persist.ts'
import { appearancePackageRoot, makeAppearanceRoutes } from './routes.ts'
import { AppearanceState } from './service.ts'

export const name = 'whale-appearance'
export const inject = ['webServer']

export function apply(ctx: Context): void {
  const state = new AppearanceState(appearanceHomeDir())
  const routes = makeAppearanceRoutes({ state, packageRoot: appearancePackageRoot(import.meta.url) })
  ctx.effect(() => {
    const disposers = routes.map(route => ctx.webServer.register(route))
    return () => { for (const dispose of disposers) dispose() }
  }, 'whale-appearance: routes')
  ctx.on('session/event', (_session: Session, event: { type: string; data?: unknown }) => {
    if (event.type !== 'activity/status') return
    const data = typeof event.data === 'object' && event.data !== null
      ? event.data as { phase?: unknown }
      : {}
    state.setActivity(data.phase)
  })
  ctx.on('session/disposed', () => { state.setActivity('idle') })
}
