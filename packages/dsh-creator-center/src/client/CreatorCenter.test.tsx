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
  render(<CreatorCenter launcher={launcher} clipboard={clipboard} close={close} />)
  return { launcher, launch, clipboard, close, writes, publish }
}

describe('Creator Center', () => {
  it('shows two clear beginner entry routes and a quiet ability library', () => {
    setup()

    expect(screen.getByRole('navigation', { name: '创造中心导航' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '你希望 DeepSeek 帮你解决什么问题？' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '精选场景' })).toBeTruthy()
    expect(screen.getAllByTestId('featured-scene')).toHaveLength(3)
    expect(screen.getByRole('searchbox', { name: '搜索能力' })).toBeTruthy()
    expect(screen.getAllByTestId('ability-card')).toHaveLength(8)
    expect(screen.queryByText('Agent 预设')).toBeNull()
    expect(screen.queryByText('Skill')).toBeNull()
    expect(screen.queryByText('插件')).toBeNull()
  })

  it('combines industry, kind, and search filters and offers a clean reset', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '零售与电商' }))
    fireEvent.click(screen.getByRole('button', { name: '数据分析' }))

    expect(screen.getByRole('button', { name: '零售与电商' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: '数据分析' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getAllByTestId('ability-card')).toHaveLength(1)
    expect(screen.getByText('文件与数据分析')).toBeTruthy()

    fireEvent.change(screen.getByRole('searchbox', { name: '搜索能力' }), { target: { value: '完全不存在的能力' } })
    expect(screen.getByText('没有找到完全匹配的能力')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '清除筛选' }))
    expect(screen.getAllByTestId('ability-card')).toHaveLength(8)
  })

  it('validates a plain-language problem and returns no more than three local suggestions', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '帮我找适合的能力' }))
    expect(screen.getByRole('alert').textContent).toContain('先简单说说你想解决的问题')

    fireEvent.change(screen.getByLabelText('描述你想解决的问题'), {
      target: { value: '每天整理客户反馈' },
    })
    fireEvent.click(screen.getByRole('button', { name: '帮我找适合的能力' }))

    expect(screen.getByText('为你推荐 3 个接近的能力')).toBeTruthy()
    expect(screen.getAllByTestId('ability-card')).toHaveLength(3)
  })

  it('opens a beginner review in-page and keeps implementation details collapsed', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '查看“网页调研整理”方案' }))

    const review = screen.getByRole('region', { name: '网页调研整理方案' })
    expect(within(review).getByText('它会帮你完成什么')).toBeTruthy()
    expect(within(review).getByText('你需要准备什么')).toBeTruthy()
    expect(within(review).getByText('最后会得到什么')).toBeTruthy()
    expect(within(review).getByText('它会读取或修改什么')).toBeTruthy()
    expect(within(review).getByText('不想用了怎么关闭')).toBeTruthy()

    const advanced = within(review).getByText('高级信息').parentElement as HTMLDetailsElement
    expect(advanced.open).toBe(false)
    fireEvent.click(within(review).getByText('高级信息'))
    expect(advanced.open).toBe(true)
    expect(within(review).getByText('Agent 预设')).toBeTruthy()
  })

  it('shows a dedicated Vibe Coding collection with an honest three-stage path', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: 'Vibe Coding' }))

    expect(screen.getByRole('heading', { name: '说出想法，让 DeepSeek 和你一起做出来' })).toBeTruthy()
    expect(screen.getAllByTestId('vibe-group')).toHaveLength(6)
    expect(screen.getByText('先做可运行第一版')).toBeTruthy()
    expect(screen.getByText('用户确认')).toBeTruthy()
    expect(screen.getByText('继续完善')).toBeTruthy()
  })

  it('keeps beginner guidance and optional extension principles in the same calm shell', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '创建指南' }))
    expect(screen.getByRole('heading', { name: '第一次创建能力，只要记住三步' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '扩展原理' }))
    expect(screen.getByRole('heading', { name: 'DeepSeek Harness 的扩展不只有插件' })).toBeTruthy()
  })

  it('disables creation when the official Creator Mode is missing', async () => {
    setup(false)

    expect((await screen.findByRole('alert')).textContent).toContain('设置 → Agent 预设')
    fireEvent.click(screen.getByRole('button', { name: '查看“网页调研整理”方案' }))
    expect(screen.getByRole('button', { name: '让 DeepSeek 帮我创建' }).hasAttribute('disabled')).toBe(true)
  })

  it('copies before opening Creator Mode and never auto-sends', async () => {
    const order: string[] = []
    const kit = setup()
    kit.clipboard.writeText.mockImplementation(async () => { order.push('copy') })
    kit.launch.mockImplementation(() => { order.push('launch') })

    fireEvent.click(screen.getByRole('button', { name: '查看“网页调研整理”方案' }))
    fireEvent.click(screen.getByRole('button', { name: '让 DeepSeek 帮我创建' }))

    await vi.waitFor(() => expect(order).toEqual(['copy', 'launch']))
    expect(kit.launch).toHaveBeenCalledWith('cordis')
    expect(screen.getByRole('status').textContent).toContain('请粘贴并发送')
  })

  it('opens the AI advisor without copying a synthetic user message', () => {
    const kit = setup()

    fireEvent.click(screen.getByRole('button', { name: '让 AI 帮我定制' }))

    expect(kit.launch).toHaveBeenCalledWith('whale-extension-advisor')
    expect(kit.clipboard.writeText).not.toHaveBeenCalled()
  })

  it('leaves Settings after the requested blank session is ready', async () => {
    const kit = setup()

    fireEvent.click(screen.getByRole('button', { name: '让 AI 帮我定制' }))
    expect(kit.close).not.toHaveBeenCalled()

    kit.publish({ busy: false, error: null, launchedPreset: 'whale-extension-advisor' })
    await vi.waitFor(() => expect(kit.close).toHaveBeenCalledOnce())
  })

  it('offers the official Creator Mode fallback when advisor selection fails', async () => {
    const kit = setup()
    fireEvent.click(screen.getByRole('button', { name: '让 AI 帮我定制' }))
    kit.publish({ busy: false, error: 'advisor preset is unavailable', launchedPreset: null })

    fireEvent.click(await screen.findByRole('button', { name: '复制顾问提问模板并打开创造模式' }))

    await vi.waitFor(() => expect(kit.launch).toHaveBeenLastCalledWith('cordis'))
    expect(kit.clipboard.writeText).toHaveBeenCalledOnce()
  })

  it('keeps Settings open and explains an ordinary Creator Mode launch failure', async () => {
    const kit = setup()
    fireEvent.click(screen.getByRole('button', { name: '查看“网页调研整理”方案' }))
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
