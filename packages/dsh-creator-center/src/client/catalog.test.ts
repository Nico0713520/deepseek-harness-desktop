import { describe, expect, it } from 'vitest'
import {
  ABILITIES,
  ABILITY_KINDS,
  INDUSTRIES,
  VIBE_CODING_GROUPS,
  abilitiesFor,
  collectionAbilities,
  recommendAbilities,
} from './catalog.ts'

describe('Creator Center catalog', () => {
  it('uses the agreed official industry and beginner ability-kind labels', () => {
    expect(INDUSTRIES.map(item => item.label)).toEqual([
      '全部行业',
      '程序员',
      '金融服务',
      '医疗健康',
      '生命科学',
      '零售与电商',
      '政府与公共服务',
      '教育',
    ])
    expect(ABILITY_KINDS.map(item => item.label)).toEqual([
      '全部种类',
      '编程开发',
      '内容创作',
      '资料研究',
      '自动执行',
      '数据分析',
    ])
  })

  it('keeps only authoritative GitHub project cards', () => {
    expect(ABILITIES).toHaveLength(8)
    expect(new Set(ABILITIES.map(item => item.id)).size).toBe(8)
    for (const ability of ABILITIES) {
      expect(ability.outcome.length).toBeGreaterThan(5)
      expect(ability.userProvides.length).toBeGreaterThan(3)
      expect(ability.userReceives.length).toBeGreaterThan(3)
      expect(ability.rollback.length).toBeGreaterThan(3)
      expect(ability.implementation.checks.length).toBeGreaterThan(0)
      expect(ability.implementation.repositoryUrl).toMatch(/^https:\/\/github\.com\//)
      expect(ability.implementation.addMethod.length).toBeGreaterThan(10)
    }
  })

  it('records the verified repository for every displayed project', () => {
    expect(Object.fromEntries(ABILITIES.map(item => [item.id, item.implementation.repositoryUrl]))).toEqual({
      'obra-superpowers': 'https://github.com/obra/superpowers',
      'mattpocock-skills': 'https://github.com/mattpocock/skills',
      'panniantong-agent-reach': 'https://github.com/Panniantong/Agent-Reach',
      'firecrawl-mcp-server': 'https://github.com/firecrawl/firecrawl-mcp-server',
      'mvanhorn-last30days-skill': 'https://github.com/mvanhorn/last30days-skill',
      'lenml-ponytail': 'https://github.com/lenML/Ponytail',
      'ilm-alan-frontend-design': 'https://github.com/Ilm-Alan/frontend-design',
      'microsoft-playwright': 'https://github.com/microsoft/playwright',
    })
  })

  it('combines the separate industry and kind filters', () => {
    expect(abilitiesFor({ industry: 'programmer', kind: 'coding', query: '' }).map(item => item.id))
      .toEqual([
        'obra-superpowers',
        'mattpocock-skills',
        'lenml-ponytail',
        'ilm-alan-frontend-design',
        'microsoft-playwright',
      ])
    expect(abilitiesFor({ industry: 'programmer', kind: 'research', query: '' }).map(item => item.id))
      .toEqual(['panniantong-agent-reach', 'firecrawl-mcp-server', 'mvanhorn-last30days-skill'])
    expect(abilitiesFor({ industry: 'all', kind: 'coding', query: '代码审查' }).map(item => item.id))
      .toContain('obra-superpowers')
    expect(abilitiesFor({ industry: 'all', kind: 'research', query: '网页抓取' }).map(item => item.id))
      .toEqual(['firecrawl-mcp-server'])
  })

  it('keeps Vibe Coding as a collection instead of an industry or ability kind', () => {
    expect(INDUSTRIES.some(item => item.id === 'vibe-coding')).toBe(false)
    expect(ABILITY_KINDS.some(item => item.id === 'vibe-coding')).toBe(false)
    expect(VIBE_CODING_GROUPS).toHaveLength(6)
    expect(collectionAbilities('vibe-coding').every(item => item.kindIds.includes('coding'))).toBe(true)
  })

  it('returns at most three deterministic recommendations and rejects blank problems', () => {
    const first = recommendAbilities('每天整理客户反馈')
    const second = recommendAbilities('每天整理客户反馈')

    expect(first).toHaveLength(3)
    expect(second.map(item => item.id)).toEqual(first.map(item => item.id))
    expect(recommendAbilities('   ')).toEqual([])
  })
})
