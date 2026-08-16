import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MyExtensions } from './MyExtensions.tsx'

afterEach(cleanup)

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

describe('MyExtensions', () => {
  it('shows local records in the ability-center layout and opens a detail page', async () => {
    const fetcher = vi.fn(async () => response({
      ok: true,
      extensions: [{
        id: 'brainstorming',
        title: 'brainstorming',
        kind: 'skill',
        category: '开发流程',
        summary: '先澄清目标再开始实现。',
        repositoryUrl: 'https://github.com/obra/superpowers',
        localPath: '/tmp/dsh/skills/brainstorming',
        managedBy: 'whale-extension-center',
        installedAt: '2026-08-16T00:00:00.000Z',
        enabled: true,
      }],
    }))
    render(<MyExtensions onClose={vi.fn()} fetcher={fetcher} />)

    expect(await screen.findByTestId('user-extension-card')).toBeTruthy()
    expect(screen.getByRole('group', { name: '扩展类型' })).toBeTruthy()
    expect(screen.queryByRole('textbox', { name: '搜索我的扩展' })).toBeNull()
    fireEvent.click(screen.getByRole('article', { name: '打开“brainstorming”详情' }))

    expect(screen.getByRole('region', { name: 'brainstorming详情' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '打开 GitHub' }).getAttribute('href')).toBe('https://github.com/obra/superpowers')
  })

  it('deletes a selected local record after confirmation', async () => {
    const fetcher = vi.fn(async (_url: string, init?: RequestInit) => (
      init?.method === 'DELETE'
        ? response({ ok: true, removed: 'brainstorming' })
        : response({ ok: true, extensions: [{
          id: 'brainstorming', title: 'brainstorming', kind: 'skill', category: '开发流程', summary: '测试',
          repositoryUrl: 'https://github.com/obra/superpowers', localPath: '/tmp/dsh/skills/brainstorming',
          managedBy: 'whale-extension-center', installedAt: '2026-08-16T00:00:00.000Z', enabled: true,
        }] })
    ))
    vi.stubGlobal('confirm', vi.fn(() => true))
    render(<MyExtensions onClose={vi.fn()} fetcher={fetcher} />)
    fireEvent.click(await screen.findByTestId('user-extension-card'))
    fireEvent.click(screen.getByRole('button', { name: '从本机删除' }))

    await waitFor(() => { expect(screen.getByText('已删除 brainstorming')).toBeTruthy() })
    expect(fetcher).toHaveBeenCalledWith('/api/whale-creator-center/user-extensions/brainstorming', { method: 'DELETE' })
  })
})
