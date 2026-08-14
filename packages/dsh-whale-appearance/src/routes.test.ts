import { describe, expect, it } from 'vitest'
import { makeAppearanceRoutes } from './routes.ts'

describe('appearance routes', () => {
  it('exposes only the fixed API and artwork allowlist', () => {
    const routes = makeAppearanceRoutes({
      state: {
        snapshot: () => ({
          themeEnabled: false,
          pet: 'off',
          petScale: 1,
          petPosition: { right: 24, bottom: 24 },
          activity: 'idle',
        }),
        update: () => ({
          themeEnabled: false,
          pet: 'off',
          petScale: 1,
          petPosition: { right: 24, bottom: 24 },
          activity: 'idle',
        }),
      },
      packageRoot: '/package',
    })
    expect(routes.map(route => route.path)).toEqual([
      '/api/whale-appearance/state',
      '/api/whale-appearance/config',
      '/whale-appearance/assets/whale-maid.jpg',
      '/whale-appearance/assets/abstract-whale.jpg',
      '/whale-appearance/assets/theme-reference.jpg',
    ])
  })
})
