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
    const { container } = render(<CreatorCenterSurface navigation={navigation} launcher={launcher()} />)

    expect(screen.queryByTestId('creator-center-surface')).toBeNull()
    act(() => { navigation.open() })

    expect(screen.getByTestId('creator-center-surface')).toBeTruthy()
    expect(screen.getByRole('region', { name: '能力 Hub' })).toBeTruthy()
    expect(screen.getByRole('group', { name: '行业分类' })).toBeTruthy()
    const organizationLogo = container.querySelector<HTMLElement>('[data-project-logo-owner="firecrawl"]')
    const personalRepository = container.querySelector<HTMLElement>('[data-project-logo-owner="obra"]')
    const deepSeekOfficialLogo = container.querySelector<HTMLElement>('[data-project-logo-owner="deepseek-ai"]')
    const curatedProjectLogo = container.querySelector<HTMLElement>('[data-project-logo-owner="addyosmani"]')
    expect(organizationLogo?.style.backgroundImage).toContain('data:image/jpeg;base64,')
    expect(personalRepository?.style.backgroundImage).toContain('data:image/jpeg;base64,')
    expect(deepSeekOfficialLogo?.style.backgroundImage).toContain('data:image/jpeg;base64,')
    expect(curatedProjectLogo?.style.backgroundImage).toContain('data:image/jpeg;base64,')
    expect(container.innerHTML).not.toContain('https://github.com/obra.png')
    expect(container.innerHTML).not.toContain('avatars.githubusercontent.com')
    expect(screen.getAllByText('Pi 扩展').length).toBeGreaterThan(0)
    expect(screen.getAllByText('高级开发者学习').length).toBeGreaterThan(0)
  })

  it('explains that Pi projects are popular advanced customization references', () => {
    const navigation = new CreatorNavigationController()
    render(<CreatorCenterSurface navigation={navigation} launcher={launcher()} />)
    act(() => { navigation.open() })

    fireEvent.click(screen.getByLabelText('打开“nicobailon/pi-mcp-adapter”详情'))

    expect(screen.getByText('Pi 扩展')).toBeTruthy()
    expect(screen.getByText(/供高级开发者学习与借鉴/)).toBeTruthy()
  })

  it('hides the full page when navigation returns to chat', () => {
    const navigation = new CreatorNavigationController()
    render(<CreatorCenterSurface navigation={navigation} launcher={launcher()} />)
    act(() => { navigation.open() })

    act(() => { navigation.close() })

    expect(navigation.getSnapshot()).toBe('chat')
    expect(screen.queryByTestId('creator-center-surface')).toBeNull()
  })

  it('renders the local extension hub on its own route', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true, extensions: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })))
    const navigation = new CreatorNavigationController()
    render(<CreatorCenterSurface navigation={navigation} launcher={launcher()} />)
    act(() => { navigation.openMyExtensions() })

    expect(await screen.findByRole('region', { name: '我的扩展 Hub' })).toBeTruthy()
    expect(screen.getByRole('group', { name: '扩展类型' })).toBeTruthy()
    expect(screen.getByText('还没有自己添加的扩展')).toBeTruthy()
  })
})
