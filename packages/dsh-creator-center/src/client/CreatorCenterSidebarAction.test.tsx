import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CreatorCenterSidebarAction } from './CreatorCenterSidebarAction.tsx'
import { CreatorNavigationController } from './creator-navigation.ts'

afterEach(cleanup)

describe('CreatorCenterSidebarAction', () => {
  it('opens the extension center from the wide sidebar', () => {
    const navigation = new CreatorNavigationController()
    const { container } = render(<CreatorCenterSidebarAction wide expandSidebar={() => {}} navigation={navigation} />)

    fireEvent.click(screen.getByRole('button', { name: '扩展中心' }))

    expect(navigation.getSnapshot()).toBe('creator-center')
    expect(screen.getByText('扩展中心')).toBeTruthy()
    expect(screen.queryByRole('button', { name: '能力中心' })).toBeNull()
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1)
    expect(screen.getByRole('button', { name: '扩展中心' }).textContent).not.toContain('✦')
  })

  it('expands the rail before opening the ability center', () => {
    const navigation = new CreatorNavigationController()
    const calls: string[] = []
    render(<CreatorCenterSidebarAction wide={false} expandSidebar={() => { calls.push('expand') }} navigation={navigation} />)

    fireEvent.click(screen.getByRole('button', { name: '扩展中心' }))

    expect(calls).toEqual(['expand'])
    expect(navigation.getSnapshot()).toBe('creator-center')
  })
})
