import { act, cleanup, render, screen } from '@testing-library/react'
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
    expect(screen.getByRole('region', { name: '能力 Hub' })).toBeTruthy()
    expect(screen.getByRole('group', { name: '行业分类' })).toBeTruthy()
  })

  it('hides the full page when navigation returns to chat', () => {
    const navigation = new CreatorNavigationController()
    render(<CreatorCenterSurface navigation={navigation} launcher={launcher()} />)
    act(() => { navigation.open() })

    act(() => { navigation.close() })

    expect(navigation.getSnapshot()).toBe('chat')
    expect(screen.queryByTestId('creator-center-surface')).toBeNull()
  })
})
