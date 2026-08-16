import { describe, expect, it, vi } from 'vitest'
import { CreatorNavigationController } from './creator-navigation.ts'

describe('CreatorNavigationController', () => {
  it('starts on chat and publishes creator-center when opened', () => {
    const navigation = new CreatorNavigationController()
    const listener = vi.fn()
    navigation.subscribe(listener)

    expect(navigation.getSnapshot()).toBe('chat')
    navigation.open()

    expect(navigation.getSnapshot()).toBe('creator-center')
    expect(listener).toHaveBeenCalledOnce()
  })

  it('does not notify when closing an already closed route', () => {
    const navigation = new CreatorNavigationController()
    const listener = vi.fn()
    navigation.subscribe(listener)

    navigation.close()

    expect(listener).not.toHaveBeenCalled()
  })

  it('publishes the user extension route', () => {
    const navigation = new CreatorNavigationController()
    navigation.openMyExtensions()

    expect(navigation.getSnapshot()).toBe('my-extensions')
  })
})
