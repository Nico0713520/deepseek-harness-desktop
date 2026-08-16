import { beforeEach, describe, expect, it } from 'vitest'
import { applyWhaleCanvas } from './theme.ts'

describe('Whale Canvas', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <aside data-pane="sidebar" data-official="sidebar"></aside>
      <main data-conversation-scroll data-official="conversation"><article>message</article></main>
      <form data-composer-card data-official="composer"></form>
    `
  })

  it('owns only conversation-canvas layers and fully disposes them', () => {
    const sidebar = document.querySelector('[data-pane="sidebar"]') as HTMLElement
    const composer = document.querySelector('[data-composer-card]') as HTMLElement
    const sidebarBefore = sidebar.outerHTML
    const composerBefore = composer.outerHTML

    const dispose = applyWhaleCanvas(document)

    expect(document.querySelectorAll('[data-whale-canvas]').length).toBe(1)
    expect(document.querySelector('[data-whale-canvas="wallpaper"]')).not.toBeNull()
    expect(document.querySelector('[data-whale-canvas="left"]')).toBeNull()
    expect(document.querySelector('[data-whale-canvas="right"]')).toBeNull()
    expect(document.querySelector('[data-whale-canvas="veil"]')).toBeNull()
    expect(document.querySelector('[data-conversation-scroll]')?.hasAttribute('data-whale-canvas-root')).toBe(true)
    expect(sidebar.outerHTML).toBe(sidebarBefore)
    expect(composer.outerHTML).toBe(composerBefore)

    dispose()
    dispose()

    expect(document.querySelector('[data-whale-canvas]')).toBeNull()
    expect(document.querySelector('[data-conversation-scroll]')?.hasAttribute('data-whale-canvas-root')).toBe(false)
  })
})
