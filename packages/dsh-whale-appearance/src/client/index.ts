import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { AppearanceSettingsCard } from './AppearanceSettingsCard.tsx'
import { AppearanceController } from './appearance-controller.ts'
import { applyWhaleCanvas } from './theme.ts'
import { WhalePet } from './WhalePet.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'web-ui.plugin.item': { kind: 'list'; scope: 'root'; owner: Record<string, never> }
    'shell.overlay': { kind: 'list'; scope: 'root'; owner: Record<string, never> }
  }
}

export const inject = ['slots']

export function apply(ctx: ClientContext): void {
  const controller = new AppearanceController()
  let disposeTheme: (() => void) | undefined
  const syncTheme = (): void => {
    const enabled = controller.getSnapshot().themeEnabled
    if (enabled && disposeTheme === undefined) disposeTheme = applyWhaleCanvas(document)
    if (!enabled && disposeTheme !== undefined) {
      disposeTheme()
      disposeTheme = undefined
    }
  }
  const unsubscribe = controller.subscribe(syncTheme)

  ctx.effect(() => {
    const refresh = (): void => { void controller.refresh().catch(() => {}) }
    let timer: number | undefined
    const stop = (): void => {
      if (timer !== undefined) window.clearInterval(timer)
      timer = undefined
    }
    const start = (): void => {
      if (document.visibilityState !== 'visible' || timer !== undefined) return
      refresh()
      timer = window.setInterval(refresh, 1_000)
    }
    const visibility = (): void => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }
    document.addEventListener('visibilitychange', visibility)
    start()
    return () => {
      stop()
      document.removeEventListener('visibilitychange', visibility)
      unsubscribe()
      disposeTheme?.()
      disposeTheme = undefined
    }
  }, 'whale-appearance: sync')

  ctx.slots.inject('web-ui.plugin.item', () => ctx.slots.register({
    name: 'web-ui.plugin.item',
    id: 'whale-appearance-settings',
    order: 105,
    inject: () => ({ controller }),
  }, AppearanceSettingsCard))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'whale-pet',
    order: 80,
    inject: () => ({ controller }),
  }, WhalePet))
}
