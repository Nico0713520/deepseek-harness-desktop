import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LaunchSnapshot } from './session-launcher.ts'
import { ABILITIES } from './catalog.ts'
import { CreatorCenter, type CreatorLauncher } from './CreatorCenter.tsx'

afterEach(cleanup)

function setup(presetAvailable = true) {
  let snapshot: LaunchSnapshot = { busy: false, error: null, launchedPreset: null }
  const listeners = new Set<() => void>()
  const launch = vi.fn()
  const launcher: CreatorLauncher = {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    launch,
    clearError: vi.fn(),
    isPresetAvailable: vi.fn(async () => presetAvailable),
  }
  const publish = (next: LaunchSnapshot): void => {
    snapshot = next
    for (const listener of listeners) listener()
  }
  const writes: string[] = []
  const clipboard = { writeText: vi.fn(async (text: string) => { writes.push(text) }) }
  const close = vi.fn()
  render(<CreatorCenter launcher={launcher} clipboard={clipboard} onClose={close} />)
  return { launcher, launch, clipboard, close, writes, publish }
}

describe('Creator Center', () => {
  it('shows only the focused ability library and its two filters', () => {
    setup()

    expect(screen.getByRole('heading', { name: '能力库' })).toBeTruthy()
    expect(screen.getByRole('region', { name: '能力 Hub' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /返回聊天/ })).toBeNull()
    expect(screen.queryByRole('heading', { name: '你希望 DeepSeek 帮你解决什么问题？' })).toBeNull()
    expect(screen.queryByRole('heading', { name: '精选场景' })).toBeNull()
    expect(screen.queryByRole('textbox', { name: '搜索能力' })).toBeNull()
    expect(screen.getByRole('group', { name: '行业分类' })).toBeTruthy()
    expect(screen.getByRole('group', { name: '能力种类' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '程序员' })).toBeTruthy()
    expect(screen.getAllByTestId('ability-card').length).toBeGreaterThan(60)
    expect(screen.getAllByText('Skill').length).toBeGreaterThan(0)
    expect(screen.getAllByText('插件').length).toBeGreaterThan(0)
  })

  it('switches programmer filters to developer directions and offers a clean reset', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '程序员' }))
    expect(screen.getByRole('group', { name: '开发方向' })).toBeTruthy()
    expect(screen.queryByRole('group', { name: '能力种类' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '爬虫' }))

    expect(screen.getByRole('button', { name: '程序员' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: '爬虫' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getAllByTestId('ability-card').length).toBeGreaterThan(5)
    expect(screen.getByText('Panniantong/Agent-Reach')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '全部行业' }))
    fireEvent.click(screen.getByRole('button', { name: '全部种类' }))
    expect(screen.getByRole('group', { name: '能力种类' })).toBeTruthy()
    expect(screen.getAllByTestId('ability-card')).toHaveLength(ABILITIES.length)
  })

  it('opens from the whole card and shows the project intro and verified GitHub link', () => {
    setup()

    const superpowersCard = screen.getByText('obra/superpowers').closest('[data-testid="ability-card"]')
    expect(superpowersCard).not.toBeNull()
    fireEvent.click(superpowersCard!)
    const verifiedReview = screen.getByRole('region', { name: 'obra/superpowers详情' })
    expect(screen.getByRole('region', { name: '能力 Hub' }).getAttribute('data-layout')).toBe('detail')
    expect(screen.queryByTestId('ability-grid')).toBeNull()
    expect(within(verifiedReview).getByText('项目简介')).toBeTruthy()
    expect(within(verifiedReview).getByRole('link', { name: 'https://github.com/obra/superpowers' }).getAttribute('href'))
      .toBe('https://github.com/obra/superpowers')
    expect(within(verifiedReview).getByRole('link', { name: '打开仓库 ↗' }).getAttribute('href'))
      .toBe('https://github.com/obra/superpowers')
    expect(within(verifiedReview).getByText('GitHub 项目')).toBeTruthy()
    expect(within(verifiedReview).queryByText('项目详情')).toBeNull()
    expect(within(verifiedReview).queryByText('怎么加入 DeepSeek Harness')).toBeNull()

    fireEvent.click(within(verifiedReview).getByRole('button', { name: '返回能力库' }))
    expect(screen.getByRole('region', { name: '能力 Hub' }).getAttribute('data-layout')).toBe('list')
    expect(screen.getByTestId('ability-grid')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '查看“microsoft/playwright”方案' }))
    const playwrightReview = screen.getByRole('region', { name: 'microsoft/playwright详情' })
    expect(within(playwrightReview).getByRole('link', { name: 'https://github.com/microsoft/playwright' }).getAttribute('href'))
      .toBe('https://github.com/microsoft/playwright')
  })

  it('opens a beginner review in-page and keeps implementation details collapsed', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))

    const review = screen.getByRole('region', { name: 'Panniantong/Agent-Reach详情' })
    expect(within(review).getByText('GitHub 项目')).toBeTruthy()
    expect(within(review).queryByText('它会帮你完成什么')).toBeNull()
    expect(within(review).queryByText('怎么加入 DeepSeek Harness')).toBeNull()

    const advanced = within(review).getByText('高级信息').parentElement as HTMLDetailsElement
    expect(advanced.open).toBe(false)
    fireEvent.click(within(review).getByText('高级信息'))
    expect(advanced.open).toBe(true)
    expect(within(review).getByText('Skill')).toBeTruthy()
  })

  it('returns from the detail page with Escape and keeps the catalog visible', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“obra/superpowers”方案' }))
    expect(screen.queryByTestId('ability-grid')).toBeNull()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByTestId('ability-grid')).toBeTruthy()
    expect(screen.queryByRole('textbox', { name: '搜索能力' })).toBeNull()
  })

  it('disables creation when the official Creator Mode is missing', async () => {
    setup(false)

    expect((await screen.findByRole('alert')).textContent).toContain('设置 → Agent 预设')
    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    expect(screen.getByRole('button', { name: '让 DeepSeek 帮我创建' }).hasAttribute('disabled')).toBe(true)
  })

  it('copies before opening Creator Mode and never auto-sends', async () => {
    const order: string[] = []
    const kit = setup()
    kit.clipboard.writeText.mockImplementation(async () => { order.push('copy') })
    kit.launch.mockImplementation(() => { order.push('launch') })

    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '让 DeepSeek 帮我创建' }))

    await vi.waitFor(() => expect(order).toEqual(['copy', 'launch']))
    expect(kit.launch).toHaveBeenCalledWith('cordis')
    expect(screen.getByRole('status').textContent).toContain('请粘贴并发送')
  })

  it('copies the advisor prompt before opening official Creator Mode', async () => {
    const order: string[] = []
    const kit = setup()
    kit.clipboard.writeText.mockImplementation(async () => { order.push('copy') })
    kit.launch.mockImplementation(() => { order.push('launch') })

    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '先问 AI 是否适合我' }))

    await vi.waitFor(() => expect(order).toEqual(['copy', 'launch']))
    expect(kit.launch).toHaveBeenCalledWith('cordis')
  })

  it('leaves Settings after the requested blank session is ready', async () => {
    const kit = setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '先问 AI 是否适合我' }))
    expect(kit.close).not.toHaveBeenCalled()

    kit.publish({ busy: false, error: null, launchedPreset: 'cordis' })
    await vi.waitFor(() => expect(kit.close).toHaveBeenCalledOnce())
  })

  it('keeps Settings open and explains an ordinary Creator Mode launch failure', async () => {
    const kit = setup()
    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '让 DeepSeek 帮我创建' }))
    await vi.waitFor(() => expect(kit.launch).toHaveBeenCalledWith('cordis'))

    kit.publish({ busy: false, error: '创造模式不可用', launchedPreset: null })

    expect((await screen.findByRole('alert')).textContent).toContain('创建说明已准备好，但创造会话未能启动')
    expect(screen.getByRole('alert').textContent).toContain('设置 → Agent 预设')
    expect(kit.close).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: '重试打开创造模式' }))

    expect(kit.launcher.clearError).toHaveBeenCalled()
    expect(kit.launch).toHaveBeenCalledTimes(2)
    expect(kit.launch).toHaveBeenLastCalledWith('cordis')
  })
})
