import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LaunchSnapshot } from './session-launcher.ts'
import { CreatorCenterSurface } from './CreatorCenterSurface.tsx'
import { CreatorNavigationController } from './creator-navigation.ts'
import type { CreatorLauncher } from './CreatorCenter.tsx'

afterEach(cleanup)

function launcher(): CreatorLauncher {
  const snapshot: LaunchSnapshot = { busy: false, error: null, launchedPreset: null }
  return {
    getSnapshot: () => snapshot,
    subscribe: () => () => {},
    launch: vi.fn(),
    clearError: vi.fn(),
    isPresetAvailable: vi.fn(async () => true),
  }
}

describe('CreatorCenterSurface', () => {
  it('renders only after navigation enters the creator route', () => {
    const navigation = new CreatorNavigationController()
    render(<CreatorCenterSurface navigation={navigation} launcher={launcher()} />)

    expect(screen.queryByTestId('creator-center-surface')).toBeNull()
    act(() => { navigation.open() })

    expect(screen.getByTestId('creator-center-surface')).toBeTruthy()
    expect(screen.getByRole('heading', { name: '你希望 DeepSeek 帮你解决什么问题？' })).toBeTruthy()
  })

  it('returns to chat from the full page', () => {
    const navigation = new CreatorNavigationController()
    render(<CreatorCenterSurface navigation={navigation} launcher={launcher()} />)
    act(() => { navigation.open() })

    fireEvent.click(screen.getByRole('button', { name: /返回聊天/ }))

    expect(navigation.getSnapshot()).toBe('chat')
    expect(screen.queryByTestId('creator-center-surface')).toBeNull()
  })
})
