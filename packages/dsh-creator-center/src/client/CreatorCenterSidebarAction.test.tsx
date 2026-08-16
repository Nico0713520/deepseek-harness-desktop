import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CreatorCenterSidebarAction } from './CreatorCenterSidebarAction.tsx'
import { CreatorNavigationController } from './creator-navigation.ts'

afterEach(cleanup)

describe('CreatorCenterSidebarAction', () => {
  it('opens the ability center from the wide sidebar', () => {
    const navigation = new CreatorNavigationController()
    render(<CreatorCenterSidebarAction wide expandSidebar={() => {}} navigation={navigation} />)

    fireEvent.click(screen.getByRole('button', { name: '能力中心' }))

    expect(navigation.getSnapshot()).toBe('creator-center')
    expect(screen.getByText('能力中心')).toBeTruthy()
  })

  it('expands the rail before opening the ability center', () => {
    const navigation = new CreatorNavigationController()
    const calls: string[] = []
    render(<CreatorCenterSidebarAction wide={false} expandSidebar={() => { calls.push('expand') }} navigation={navigation} />)

    fireEvent.click(screen.getByRole('button', { name: '能力中心' }))

    expect(calls).toEqual(['expand'])
    expect(navigation.getSnapshot()).toBe('creator-center')
  })
})
