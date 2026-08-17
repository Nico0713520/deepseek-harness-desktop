import { describe, expect, it } from 'vitest'
import {
  ABILITIES,
  ABILITY_KINDS,
  DEVELOPER_DIRECTIONS,
  INDUSTRIES,
  VIBE_CODING_GROUPS,
  abilitiesFor,
  collectionAbilities,
  githubStarLabel,
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

  it('defines seven developer directions and assigns every programmer ability', () => {
    expect(DEVELOPER_DIRECTIONS.map(item => item.label)).toEqual([
      '全部方向',
      '开发流程',
      '前端',
      '后端',
      '爬虫',
      'Agent 与工作流',
      '数据与 AI',
      '运维',
    ])
    const programmer = ABILITIES.filter(item => item.industryIds.includes('programmer'))
    expect(programmer.length).toBeGreaterThan(70)
    expect(programmer.every(item => item.developerDirectionIds.length > 0)).toBe(true)
    const frontend = abilitiesFor({ industry: 'programmer', kind: 'all', developerDirection: 'frontend', query: '' })
      .map(item => item.id)
    expect(frontend.length).toBeGreaterThanOrEqual(10)
    expect(frontend).toEqual(expect.arrayContaining([
      'ui-ux-pro-max-skill',
      'leonxlnx-taste-skill',
      'pbakaus-impeccable',
      'vercel-agent-skills',
      'addyosmani-agent-skills',
      'chrome-devtools-mcp',
    ]))
    const backend = abilitiesFor({ industry: 'programmer', kind: 'all', developerDirection: 'backend', query: '' })
      .map(item => item.id)
    expect(backend.length).toBeGreaterThanOrEqual(10)
    expect(backend).toEqual(expect.arrayContaining([
      'stripe-ai',
      'supabase-mcp',
      'mongodb-mcp-server',
      'awslabs-mcp',
      'docker-mcp-gateway',
      'cloudflare-skills',
      'serena',
    ]))
  })

  it('keeps a broad but curated industry catalog and hides duplicate low-signal cards', () => {
    expect(ABILITIES.length).toBeGreaterThanOrEqual(150)
    expect(ABILITIES.filter(item => item.industryIds.includes('programmer')).length).toBeGreaterThanOrEqual(100)
    expect(ABILITIES.filter(item => item.industryIds.includes('retail')).length).toBeGreaterThanOrEqual(35)
    expect(ABILITIES.filter(item => item.industryIds.includes('financial-services')).length).toBeGreaterThanOrEqual(45)
    expect(ABILITIES.filter(item => item.industryIds.includes('education')).length).toBeGreaterThanOrEqual(55)

    const ids = new Set(ABILITIES.map(item => item.id))
    expect(ids.has('scientific-agent-skills')).toBe(true)
    expect(ids.has('shopify-agent-skills')).toBe(true)
    expect(ids.has('microsoft-qlib')).toBe(true)
    expect(ids.has('chrome-devtools-mcp')).toBe(true)
    expect(ids.has('dsh-plugin-audit-community')).toBe(false)
    expect(ids.has('dsh-skill-pack-security')).toBe(false)
    expect(ids.has('shopline-ai-toolkit-dsh')).toBe(false)
    expect(ids.has('lenml-ponytail')).toBe(false)
    expect(ids.has('pi-plan-mode')).toBe(false)
    expect(ids.has('ilm-alan-frontend-design')).toBe(false)
    expect(ABILITIES.filter(item => item.implementation.repositoryUrl && /约 0 星(?:；|$)/.test(item.popularity ?? '')).length).toBe(0)
  })

  it('formats the GitHub star badge without inventing missing counts', () => {
    expect(githubStarLabel('GitHub 约 12.4K 星；官方项目')).toBe('★ 12.4K')
    expect(githubStarLabel('GitHub Star 未同步')).toBe('★ 未同步')
    expect(githubStarLabel('官方能力；无独立 GitHub 项目')).toBe('官方能力')
  })

  it('shows the verified browser-use GitHub star snapshot', () => {
    const ability = ABILITIES.find(item => item.id === 'browser-use')

    expect(ability?.popularity).toContain('109.5K')
    expect(githubStarLabel(ability?.popularity)).toBe('★ 109.5K')
  })

  it('includes Computer Use as an official reference adapter', () => {
    const ability = ABILITIES.find(item => item.id === 'openai-computer-use')

    expect(ability).toMatchObject({
      title: 'Computer Use（Codex 官方能力）',
      ecosystem: 'vendor',
      trust: 'vendor-official',
      compatibility: 'manual-adapter',
      developerDirectionIds: ['agent-workflow'],
      implementation: {
        repositoryUrl: 'https://github.com/openai/openai-cua-sample-app',
      },
    })
    expect(ability?.popularity).toContain('1.7K')
    expect(ability?.summary).toContain('不是可直接复制')
  })

  it('keeps the strongest local capabilities as honest official capability cards', () => {
    const officialIds = [
      'codex-browser-control',
      'codex-extension-toolkit',
      'codex-file-workbench',
      'codex-visualization',
      'codex-github-workflow',
    ]

    for (const id of officialIds) {
      const ability = ABILITIES.find(item => item.id === id)
      expect(ability?.trust).toBe('vendor-official')
      expect(ability?.implementation.sourceLabel).toMatch(/Codex 官方能力说明/)
      expect(ability?.implementation.sourceUrl).toMatch(/^https:\/\/developers\.openai\.com\/codex\/use-cases/)
      expect(ability?.implementation.repositoryUrl).toBeUndefined()
      expect(githubStarLabel(ability?.popularity)).toBe('官方能力')
    }
  })

  it('keeps a large, uniquely identified GitHub catalog with provenance metadata', () => {
    expect(ABILITIES.length).toBeGreaterThan(60)
    expect(new Set(ABILITIES.map(item => item.id)).size).toBe(ABILITIES.length)
    for (const ability of ABILITIES) {
      expect(ability.outcome.length).toBeGreaterThan(5)
      expect(ability.userProvides.length).toBeGreaterThan(3)
      expect(ability.userReceives.length).toBeGreaterThan(3)
      expect(ability.rollback.length).toBeGreaterThan(3)
      expect(ability.implementation.checks.length).toBeGreaterThan(0)
      if (ability.implementation.repositoryUrl !== undefined) {
        expect(ability.implementation.repositoryUrl).toMatch(/^https:\/\/github\.com\//)
      } else {
        expect(ability.implementation.sourceUrl).toMatch(/^https:\/\/developers\.openai\.com\//)
      }
      expect(ability.implementation.addMethod.length).toBeGreaterThan(10)
      expect(ability.ecosystem).toBeDefined()
      expect(ability.trust).toBeDefined()
      expect(ability.compatibility).toBeDefined()
      expect(ability.popularity).toBeDefined()
    }
    expect(ABILITIES.some(item => item.id === 'dsh-official-create-skill')).toBe(true)
    expect(ABILITIES.some(item => item.id === 'pi-web-access')).toBe(true)
    expect(ABILITIES.some(item => item.id === 'microsoft-markitdown')).toBe(true)
  })

  it('records the previously verified and newly curated repositories', () => {
    const repositories = Object.fromEntries(ABILITIES.map(item => [item.id, item.implementation.repositoryUrl]))
    expect(repositories['obra-superpowers']).toBe('https://github.com/obra/superpowers')
    expect(repositories['microsoft-playwright-mcp']).toBe('https://github.com/microsoft/playwright-mcp')
    expect(repositories['anionex-dsh-vision-toolkit']).toBe('https://github.com/Anionex/dsh-vision-toolkit')
    expect(repositories['jupyterlab']).toBe('https://github.com/jupyterlab/jupyterlab')
    expect(repositories['ui-ux-pro-max-skill']).toBe('https://github.com/nextlevelbuilder/ui-ux-pro-max-skill')
    expect(repositories['leonxlnx-taste-skill']).toBe('https://github.com/Leonxlnx/taste-skill')
    expect(repositories['vercel-agent-skills']).toBe('https://github.com/vercel-labs/agent-skills')
    expect(repositories['supabase-mcp']).toBe('https://github.com/supabase/mcp')
    expect(repositories['awslabs-mcp']).toBe('https://github.com/awslabs/mcp')
    expect(repositories['crawl4ai']).toBe('https://github.com/unclecode/crawl4ai')
    expect(repositories['trivy']).toBe('https://github.com/aquasecurity/trivy')
  })

  it('combines the separate industry and kind filters', () => {
    const programmerCoding = abilitiesFor({ industry: 'programmer', kind: 'coding', developerDirection: 'all', query: '' }).map(item => item.id)
    expect(programmerCoding).toContain('obra-superpowers')
    expect(programmerCoding).toContain('microsoft-playwright-mcp')
    expect(programmerCoding.length).toBeGreaterThan(20)
    const programmerResearch = abilitiesFor({ industry: 'programmer', kind: 'research', developerDirection: 'all', query: '' }).map(item => item.id)
    expect(programmerResearch).toContain('panniantong-agent-reach')
    expect(programmerResearch).toContain('pi-web-access')
    expect(programmerResearch.length).toBeGreaterThan(10)
    expect(abilitiesFor({ industry: 'all', kind: 'coding', developerDirection: 'all', query: '代码审查' }).map(item => item.id))
      .toContain('obra-superpowers')
    expect(abilitiesFor({ industry: 'all', kind: 'research', developerDirection: 'all', query: '网页抓取' }).map(item => item.id))
      .toEqual(expect.arrayContaining(['firecrawl-mcp-server', 'apify-mcp-server']))
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
