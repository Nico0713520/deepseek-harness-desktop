import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { SettingsSectionOwnerProps } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { CreatorCenter } from './CreatorCenter.tsx'
import { SessionLauncher, type SessionListState, type SessionStore } from './session-launcher.ts'

interface AgentPresetSeatFace {
  hooks: {
    agentPresetSeat: {
      getSnapshot(): { current: string; error: string | null }
    }
  }
  select(presetId: string): Promise<void>
}

const ADVISOR_PRESET_ID = 'whale-extension-advisor'
const ADVISOR_MARKER = '<!-- whale-extension-advisor -->'

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

export const inject = ['slots', 'connection', 'sessions', 'workspaces']

export function apply(ctx: ClientContext): void {
  const { api } = ctx.get('connection')
  const launcher = new SessionLauncher({
    sessions: ctx.sessions.list as unknown as SessionStore,
    startSession: () => { ctx.workspaces.startSession() },
    isPresetAvailable: async (presetId) => {
      const response = await api.agentPresets.list({})
      if (!response.result.ok) return false
      return response.result.value.presets.some((preset: { id: string; broken?: string }) => (
        preset.id === presetId && preset.broken === undefined
      ))
    },
    selectPreset: async (sessionId, presetId) => {
      const seat = agentPresetSeat(ctx)
      if (seat === undefined) throw new Error('官方 Agent 预设选择器暂时不可用')
      if (presetId === ADVISOR_PRESET_ID) {
        const response = await api.agentPresets.read({ agentPreset: presetId })
        if (!response.result.ok || !response.result.value.content.includes(ADVISOR_MARKER)) {
          throw new Error('内置 AI 扩展顾问不可用，请改用官方创造模式')
        }
      }
      await seat.select(presetId)
      const seatState = seat.hooks.agentPresetSeat.getSnapshot()
      if (seatState.error !== null) throw new Error(seatState.error)
      const sessions = ctx.sessions.list.getSnapshot()
      const current = sessions.current === undefined ? undefined : sessions.byId[sessions.current]
      if (current?.id !== sessionId || current.agentPreset !== presetId || seatState.current !== presetId) {
        throw new Error('预设未能应用到新的空白会话')
      }
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
