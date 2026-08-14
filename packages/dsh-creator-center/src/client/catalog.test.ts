import { describe, expect, it } from 'vitest'
import { CREATOR_TEMPLATES, templatesFor } from './catalog.ts'

describe('Creator Center catalog', () => {
  it('ships eight uniquely identified beginner templates', () => {
    expect(CREATOR_TEMPLATES).toHaveLength(8)
    expect(new Set(CREATOR_TEMPLATES.map(item => item.id)).size).toBe(8)
    for (const item of CREATOR_TEMPLATES) {
      expect(item.checks.length).toBeGreaterThan(0)
      expect(item.benefit.length).toBeGreaterThan(5)
    }
  })

  it('filters the same catalog by use or extension type', () => {
    expect(templatesFor('type', 'skill').map(item => item.id)).toContain('weekly-report')
    expect(templatesFor('use', 'research').map(item => item.id)).toContain('web-research')
    expect(templatesFor('type', 'ui-extension').map(item => item.id)).toEqual(['custom-ui-theme'])
  })
})
