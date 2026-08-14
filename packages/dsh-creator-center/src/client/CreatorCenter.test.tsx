import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LaunchSnapshot } from './session-launcher.ts'
import { CreatorCenter, type CreatorLauncher } from './CreatorCenter.tsx'

afterEach(cleanup)

function setup() {
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
  }
  const publish = (next: LaunchSnapshot): void => {
    snapshot = next
    for (const listener of listeners) listener()
  }
  const writes: string[] = []
  const clipboard = { writeText: vi.fn(async (text: string) => { writes.push(text) }) }
  render(<CreatorCenter launcher={launcher} clipboard={clipboard} />)
  return { launcher, launch, clipboard, writes, publish }
}

describe('Creator Center', () => {
  it('starts with beginner use categories and can browse the same catalog by extension type', () => {
    setup()

    expect(screen.getByText('告诉 DeepSeek 你想多会一件什么事')).toBeTruthy()
    expect(screen.getByRole('button', { name: '按用途' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: '问 AI 扩展顾问' })).toBeTruthy()
    expect(screen.getAllByTestId('creator-template')).toHaveLength(8)

    fireEvent.click(screen.getByRole('button', { name: '按扩展类型' }))
    fireEvent.click(screen.getByRole('button', { name: 'Skill' }))

    expect(screen.getByText('每周工作总结')).toBeTruthy()
    expect(screen.getByText('公司 SOP 助手')).toBeTruthy()
    expect(screen.queryByText('定时检查与提醒')).toBeNull()
    expect(screen.getByText('把一套稳定做法写成 AI 可以反复调用的说明书。')).toBeTruthy()
  })

  it('validates custom goals and previews a guarded creation request', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: '为我的需求生成创建说明' }))
    expect(screen.getByRole('alert').textContent).toContain('请先描述你想解决的问题')

    fireEvent.change(screen.getByLabelText('没有合适模板？描述你想解决的问题'), {
      target: { value: '每天整理客户反馈' },
    })
    fireEvent.click(screen.getByRole('button', { name: '为我的需求生成创建说明' }))

    expect((screen.getByLabelText('你的安全创建说明') as HTMLTextAreaElement).value).toContain('每天整理客户反馈')
  })

  it('copies before opening Creator Mode and never auto-sends', async () => {
    const order: string[] = []
    const kit = setup()
    kit.clipboard.writeText.mockImplementation(async () => { order.push('copy') })
    kit.launch.mockImplementation(() => { order.push('launch') })

    fireEvent.click(screen.getByRole('button', { name: '查看“网页调研整理”详情' }))
    fireEvent.click(screen.getByRole('button', { name: '复制提示词并开始创造' }))

    await vi.waitFor(() => expect(order).toEqual(['copy', 'launch']))
    expect(kit.launch).toHaveBeenCalledWith('cordis')
    expect(screen.getByRole('status').textContent).toContain('请粘贴并发送')
  })

  it('opens the AI advisor without copying a synthetic user message', () => {
    const kit = setup()

    fireEvent.click(screen.getByRole('button', { name: '问 AI 扩展顾问' }))

    expect(kit.launch).toHaveBeenCalledWith('whale-extension-advisor')
    expect(kit.clipboard.writeText).not.toHaveBeenCalled()
  })

  it('offers the official Creator Mode fallback when advisor selection fails', async () => {
    const kit = setup()
    fireEvent.click(screen.getByRole('button', { name: '问 AI 扩展顾问' }))
    kit.publish({ busy: false, error: 'advisor preset is unavailable', launchedPreset: null })

    fireEvent.click(await screen.findByRole('button', { name: '复制顾问提问模板并打开创造模式' }))

    await vi.waitFor(() => expect(kit.launch).toHaveBeenLastCalledWith('cordis'))
    expect(kit.clipboard.writeText).toHaveBeenCalledOnce()
  })
})
