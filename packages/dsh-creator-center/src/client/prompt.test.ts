import { describe, expect, it } from 'vitest'
import { CREATOR_TEMPLATES } from './catalog.ts'
import { buildCreationPrompt } from './prompt.ts'

describe('Creator Center prompt builder', () => {
  it('wraps a custom goal in stable safety boundaries', () => {
    const prompt = buildCreationPrompt({ goal: '把访谈整理成周报' })
    expect(prompt).toContain('【用户目标开始】\n把访谈整理成周报\n【用户目标结束】')
    expect(prompt).toContain('优先选择侵入性最低的扩展类型')
    expect(prompt).toContain('不得修改 DeepSeek Harness 官方源码和官方聊天控件')
    expect(prompt).toContain('怎么撤销')
  })

  it('adds template-specific acceptance checks', () => {
    const template = CREATOR_TEMPLATES.find(item => item.id === 'web-research')
    expect(template).toBeDefined()
    const prompt = buildCreationPrompt({ goal: template!.goal, template })
    for (const check of template!.checks) expect(prompt).toContain(`- ${check}`)
  })

  it('rejects an empty custom goal', () => {
    expect(() => buildCreationPrompt({ goal: '  ' })).toThrow('请先描述你想解决的问题')
  })
})
