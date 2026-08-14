import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppearanceController } from './appearance-controller.ts'
import { activityClass, WhalePet } from './WhalePet.tsx'

function response(pet: 'off' | 'whale-maid' | 'abstract-whale', activity = 'idle') {
  return new Response(JSON.stringify({
    themeEnabled: false,
    pet,
    petScale: 1,
    petPosition: { right: 24, bottom: 24 },
    activity,
  }), { status: 200, headers: { 'content-type': 'application/json' } })
}

describe('Whale pet', () => {
  it('renders the selected prototype pet and hides off', async () => {
    const maid = new AppearanceController(async () => response('whale-maid'))
    await maid.refresh()
    const view = render(<WhalePet controller={maid} />)
    expect((screen.getByAltText('鲸鱼女仆桌宠') as HTMLImageElement).src).toContain('/whale-appearance/assets/whale-maid.jpg')

    const abstract = new AppearanceController(async () => response('abstract-whale'))
    await abstract.refresh()
    view.rerender(<WhalePet controller={abstract} />)
    expect((screen.getByAltText('抽象鲸鱼桌宠') as HTMLImageElement).src).toContain('/whale-appearance/assets/abstract-whale.jpg')

    const off = new AppearanceController(async () => response('off'))
    await off.refresh()
    view.rerender(<WhalePet controller={off} />)
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('maps completion to a one-shot jump', () => {
    expect(activityClass('completed')).toBe('completed')
    expect(activityClass('failed')).toBe('failed')
  })
})
