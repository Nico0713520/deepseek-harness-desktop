import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppearanceSettingsCard } from './AppearanceSettingsCard.tsx'
import { AppearanceController } from './appearance-controller.ts'

describe('Appearance settings card', () => {
  it('keeps every theme and pet control inside Settings', async () => {
    const requests: unknown[] = []
    const controller = new AppearanceController(async (_input, init) => {
      requests.push(init?.body === undefined ? null : JSON.parse(String(init.body)))
      return new Response(JSON.stringify({
        themeEnabled: true,
        pet: 'off',
        petScale: 1,
        petPosition: { right: 24, bottom: 24 },
        activity: 'idle',
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    })
    render(<AppearanceSettingsCard controller={controller} />)

    expect(screen.getByText('主题与桌宠')).toBeTruthy()
    expect(screen.getByText('官方外观')).toBeTruthy()
    expect(screen.getByText('鲸鱼女仆')).toBeTruthy()
    expect(screen.getByText('抽象鲸鱼')).toBeTruthy()
    expect(screen.getByText('恢复官方外观')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '使用鲸鱼画布' }))
    await vi.waitFor(() => expect(requests).toContainEqual({ themeEnabled: true }))
  })
})
