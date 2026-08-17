import type { Context } from '@deepseek-ai/cordis'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { makeUserExtensionRoutes, type UserExtensionWebRoute } from './extensions.ts'

export const name = 'whale-creator-center'
export const inject = ['webServer']

interface CreatorHostContext {
  webServer: { register(route: UserExtensionWebRoute): () => void }
  effect(callback: () => () => void, label: string): void
}

export function apply(ctx: Context): void {
  const host = ctx as unknown as CreatorHostContext
  const userExtensionRoutes = makeUserExtensionRoutes(process.env.DSH_HOME ?? join(homedir(), '.dsh'))
  host.effect(() => {
    const disposers = userExtensionRoutes.map(item => host.webServer.register(item))
    return () => { for (const dispose of disposers) dispose() }
  }, 'whale-creator-center: user extension routes')
}
