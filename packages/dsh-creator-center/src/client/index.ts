import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { SettingsSectionOwnerProps } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { CreatorCenter } from './CreatorCenter.tsx'
import { SessionLauncher, type SessionListState, type SessionStore } from './session-launcher.ts'

interface AgentPresetSeatFace {
  select(presetId: string): Promise<void>
}

function agentPresetSeat(ctx: ClientContext): AgentPresetSeatFace | undefined {
  const slots = ctx.slots as unknown as {
    entriesOfSlot(name: string): ReadonlyArray<{ inject?: (...args: never[]) => Record<string, unknown> }>
  }
  const entry = slots.entriesOfSlot('conversation.hero.agentPreset')[0]
  const inject = entry?.inject as (() => Record<string, unknown>) | undefined
  const face = inject?.()
  return typeof face?.select === 'function' ? face as unknown as AgentPresetSeatFace : undefined
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'settings.section': { kind: 'list'; scope: 'root'; owner: SettingsSectionOwnerProps }
  }
}

export const inject = ['slots', 'sessions', 'workspaces']

export function apply(ctx: ClientContext): void {
  const launcher = new SessionLauncher({
    sessions: ctx.sessions.list as unknown as SessionStore,
    startSession: () => { ctx.workspaces.startSession() },
    selectPreset: async (_sessionId, presetId) => {
      const seat = agentPresetSeat(ctx)
      if (seat === undefined) throw new Error('官方 Agent 预设选择器暂时不可用')
      await seat.select(presetId)
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
