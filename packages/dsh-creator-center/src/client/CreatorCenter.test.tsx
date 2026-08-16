import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LaunchSnapshot } from './session-launcher.ts'
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

    expect(screen.queryByRole('heading', { name: '能力库' })).toBeNull()
    expect(screen.getByRole('region', { name: '能力 Hub' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /返回聊天/ })).toBeNull()
    expect(screen.queryByRole('heading', { name: '你希望 DeepSeek 帮你解决什么问题？' })).toBeNull()
    expect(screen.queryByRole('heading', { name: '精选场景' })).toBeNull()
    expect(screen.queryByRole('searchbox', { name: '搜索能力' })).toBeNull()
    expect(screen.getByRole('group', { name: '行业分类' })).toBeTruthy()
    expect(screen.getByRole('group', { name: '能力种类' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '程序员' })).toBeTruthy()
    expect(screen.getAllByTestId('ability-card')).toHaveLength(8)
    expect(screen.getAllByText('Skill').length).toBeGreaterThan(0)
    expect(screen.getAllByText('插件').length).toBeGreaterThan(0)
  })

  it('combines industry and kind filters and offers a clean reset', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '程序员' }))
    fireEvent.click(screen.getByRole('button', { name: '资料研究' }))

    expect(screen.getByRole('button', { name: '程序员' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: '资料研究' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getAllByTestId('ability-card')).toHaveLength(3)
    expect(screen.getByText('Panniantong/Agent-Reach')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '全部行业' }))
    fireEvent.click(screen.getByRole('button', { name: '全部种类' }))
    expect(screen.getAllByTestId('ability-card')).toHaveLength(8)
  })

  it('shows the project type, add method, and verified GitHub link', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“obra/superpowers”方案' }))
    const verifiedReview = screen.getByRole('region', { name: 'obra/superpowers方案' })
    fireEvent.click(within(verifiedReview).getByText('高级信息'))
    expect(within(verifiedReview).getByText('怎么添加')).toBeTruthy()
    expect(within(verifiedReview).getByRole('link', { name: '查看 GitHub 仓库 ↗' }).getAttribute('href'))
      .toBe('https://github.com/obra/superpowers')

    fireEvent.click(within(verifiedReview).getByRole('button', { name: '关闭“obra/superpowers”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '查看“microsoft/playwright”方案' }))
    const playwrightReview = screen.getByRole('region', { name: 'microsoft/playwright方案' })
    fireEvent.click(within(playwrightReview).getByText('高级信息'))
    expect(within(playwrightReview).getByRole('link', { name: '查看 GitHub 仓库 ↗' }).getAttribute('href'))
      .toBe('https://github.com/microsoft/playwright')
  })

  it('opens a beginner review in-page and keeps implementation details collapsed', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))

    const review = screen.getByRole('region', { name: 'Panniantong/Agent-Reach方案' })
    expect(within(review).getByText('它会帮你完成什么')).toBeTruthy()
    expect(within(review).getByText('你需要准备什么')).toBeTruthy()
    expect(within(review).getByText('最后会得到什么')).toBeTruthy()
    expect(within(review).getByText('它会读取或修改什么')).toBeTruthy()
    expect(within(review).getByText('不想用了怎么关闭')).toBeTruthy()

    const advanced = within(review).getByText('高级信息').parentElement as HTMLDetailsElement
    expect(advanced.open).toBe(false)
    fireEvent.click(within(review).getByText('高级信息'))
    expect(advanced.open).toBe(true)
    expect(within(review).getByText('Skill')).toBeTruthy()
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

  it('opens the AI advisor without copying a synthetic user message', () => {
    const kit = setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '先问 AI 是否适合我' }))

    expect(kit.launch).toHaveBeenCalledWith('whale-extension-advisor')
    expect(kit.clipboard.writeText).not.toHaveBeenCalled()
  })

  it('leaves Settings after the requested blank session is ready', async () => {
    const kit = setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '先问 AI 是否适合我' }))
    expect(kit.close).not.toHaveBeenCalled()

    kit.publish({ busy: false, error: null, launchedPreset: 'whale-extension-advisor' })
    await vi.waitFor(() => expect(kit.close).toHaveBeenCalledOnce())
  })

  it('offers the official Creator Mode fallback when advisor selection fails', async () => {
    const kit = setup()
    fireEvent.click(screen.getByRole('button', { name: '查看“Panniantong/Agent-Reach”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '先问 AI 是否适合我' }))
    kit.publish({ busy: false, error: 'advisor preset is unavailable', launchedPreset: null })

    fireEvent.click(await screen.findByRole('button', { name: '复制顾问提问模板并打开创造模式' }))

    await vi.waitFor(() => expect(kit.launch).toHaveBeenLastCalledWith('cordis'))
    expect(kit.clipboard.writeText).toHaveBeenCalledOnce()
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
