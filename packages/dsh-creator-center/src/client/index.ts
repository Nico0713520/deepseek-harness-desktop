import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { CreatorCenter } from './CreatorCenter.tsx'
import { SessionLauncher, type SessionListState, type SessionStore } from './session-launcher.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'settings.section': { kind: 'list'; scope: 'root'; owner: Record<string, never> }
  }
}

export const inject = ['slots', 'connection', 'sessions', 'workspaces']

export function apply(ctx: ClientContext): void {
  const { api } = ctx.get('connection')
  const launcher = new SessionLauncher({
    sessions: ctx.sessions.list as unknown as SessionStore,
    startSession: () => { ctx.workspaces.startSession() },
    selectPreset: async (sessionId, presetId) => {
      const response = await api.agentPresets.select({
        sessionId: sessionId as never,
        agentPreset: presetId,
      })
      if (!response.result.ok) throw new Error(response.result.error.message)
    },
  })

  ctx.effect(() => () => { launcher.dispose() }, 'creator-center: session launcher')
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'creator-center',
    order: 19,
    label: () => '创造中心',
    inject: () => ({ launcher }),
  }, CreatorCenter))
}

export type { SessionListState }
