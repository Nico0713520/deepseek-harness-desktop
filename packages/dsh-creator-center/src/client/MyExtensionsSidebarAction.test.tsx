import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MyExtensionsSidebarAction } from './MyExtensionsSidebarAction.tsx'
import { CreatorNavigationController } from './creator-navigation.ts'

afterEach(cleanup)

describe('MyExtensionsSidebarAction', () => {
  it('opens the user extension route and expands a collapsed sidebar', () => {
    const navigation = new CreatorNavigationController()
    const expandSidebar = vi.fn()
    const { container } = render(<MyExtensionsSidebarAction wide={false} expandSidebar={expandSidebar} navigation={navigation} />)

    fireEvent.click(screen.getByRole('button', { name: '我的扩展' }))

    expect(expandSidebar).toHaveBeenCalledOnce()
    expect(navigation.getSnapshot()).toBe('my-extensions')
    expect(screen.getByRole('button', { name: '我的扩展' }).getAttribute('aria-current')).toBe('page')
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1)
    expect(screen.getByRole('button', { name: '我的扩展' }).textContent).not.toContain('◈')
  })
})
