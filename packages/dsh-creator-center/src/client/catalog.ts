export type IndustryId = 'programmer' | 'financial-services' | 'healthcare' | 'life-sciences' | 'retail' | 'government' | 'education'
export type AbilityKindId = 'coding' | 'content-creation' | 'research' | 'agents' | 'data-analysis'
export type CollectionId = 'vibe-coding'
export type ExtensionType = 'agent-preset' | 'skill' | 'workflow' | 'plugin' | 'ui-extension'

export interface TaxonomyItem<T extends string> {
  readonly id: T | 'all'
  readonly label: string
  readonly description?: string
}

export interface AbilityDefinition {
  readonly id: string
  readonly title: string
  readonly outcome: string
  readonly summary: string
  readonly industryIds: readonly IndustryId[]
  readonly kindIds: readonly AbilityKindId[]
  readonly collectionIds: readonly CollectionId[]
  readonly aliases: readonly string[]
  readonly examples: readonly string[]
  readonly userProvides: string
  readonly userReceives: string
  readonly suitableFor: string
  readonly readsOrChanges: string
  readonly rollback: string
  readonly estimatedTime: string
  readonly implementation: {
    readonly extensionTypes: readonly ExtensionType[]
    readonly goal: string
    readonly addMethod: string
    readonly checks: readonly string[]
    readonly source: string
    readonly license: string
    readonly repositoryUrl: string
  }
}

export interface AbilityFilters {
  readonly industry: IndustryId | 'all'
  readonly kind: AbilityKindId | 'all'
  readonly query: string
}

export interface VibeCodingGroup {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly starter: string
  readonly access: string
  readonly milestone: string
  readonly confirmation: string
  readonly verify: string
  readonly abilityId?: string
}

export const INDUSTRIES: readonly TaxonomyItem<IndustryId>[] = [
  { id: 'all', label: '全部行业' },
  { id: 'programmer', label: '程序员' },
  { id: 'financial-services', label: '金融服务' },
  { id: 'healthcare', label: '医疗健康' },
  { id: 'life-sciences', label: '生命科学' },
  { id: 'retail', label: '零售与电商' },
  { id: 'government', label: '政府与公共服务' },
  { id: 'education', label: '教育' },
]

export const ABILITY_KINDS: readonly TaxonomyItem<AbilityKindId>[] = [
  { id: 'all', label: '全部种类' },
  { id: 'coding', label: '编程开发', description: '写代码、检查问题、搭建工具' },
  { id: 'content-creation', label: '内容创作', description: '写文案、报告、脚本和说明' },
  { id: 'research', label: '资料研究', description: '搜集、比较并整理资料' },
  { id: 'agents', label: '自动执行', description: '按步骤执行任务、检查并提醒' },
  { id: 'data-analysis', label: '数据分析', description: '清洗数据、找规律、输出结论' },
]

export const INDUSTRY_LABELS: Readonly<Record<IndustryId, string>> = Object.fromEntries(
  INDUSTRIES.filter((item): item is TaxonomyItem<IndustryId> & { id: IndustryId } => item.id !== 'all')
    .map(item => [item.id, item.label]),
) as Readonly<Record<IndustryId, string>>

export const ABILITY_KIND_LABELS: Readonly<Record<AbilityKindId, string>> = Object.fromEntries(
  ABILITY_KINDS.filter((item): item is TaxonomyItem<AbilityKindId> & { id: AbilityKindId } => item.id !== 'all')
    .map(item => [item.id, item.label]),
) as Readonly<Record<AbilityKindId, string>>

function ability(seed: AbilityDefinition): AbilityDefinition {
  return seed
}

const DEV_CHECKS = ['先阅读仓库说明并确认当前 Harness 版本', '只在用户同意后创建用户自己的 Skill 或插件', '完成后说明启用、验证和撤销方法']

export const ABILITIES: readonly AbilityDefinition[] = [
  ability({
    id: 'obra-superpowers',
    title: 'obra/superpowers',
    outcome: '一套完整的 AI 软件开发流程 Skill 集合。',
    summary: '包含 brainstorming、writing-plans、测试驱动开发、系统调试、代码审查协作和完成前验证。',
    industryIds: ['programmer'],
    kindIds: ['coding'],
    collectionIds: ['vibe-coding'],
    aliases: ['Superpowers', 'brainstorming', 'writing-plans', 'verification-before-completion', 'test-driven-development', 'TDD', '代码审查'],
    examples: ['我想让 AI 先规划再写代码', '给我的开发流程增加测试和验证门槛'],
    userProvides: '项目目标、现有代码和你希望的交付方式。',
    userReceives: '一套可以按步骤使用的开发流程 Skill 组合。',
    suitableFor: '你想让 Vibe Coding 少返工、每一步都有验证。',
    readsOrChanges: '读取你指定的项目和 Skill 配置；不会自动发布或修改凭据。',
    rollback: '停用对应 Skill，或删除用户目录中的配置即可。',
    estimatedTime: '约 5–15 分钟',
    implementation: {
      extensionTypes: ['skill'],
      goal: '参考 obra/superpowers 的公开说明，帮我在当前 DeepSeek Harness 中规划一套适合我的开发流程 Skill。先确认当前可用接口，不直接执行远程脚本。',
      addMethod: '打开仓库 README，选择需要的 Skill；回到能力 Hub 点“让 DeepSeek 帮我创建”，让创造模式先检查本机接口，再在用户目录生成适配版本。',
      checks: DEV_CHECKS,
      source: 'GitHub 开源 Skill 集合',
      license: 'MIT',
      repositoryUrl: 'https://github.com/obra/superpowers',
    },
  }),
  ability({
    id: 'mattpocock-skills',
    title: 'mattpocock/skills',
    outcome: '一组面向真实开发工作的工程 Skill。',
    summary: '包含 implement、to-spec、to-tickets、tdd、diagnosing-bugs、code-review 和 prototype。',
    industryIds: ['programmer'],
    kindIds: ['coding'],
    collectionIds: ['vibe-coding'],
    aliases: ['implement', 'to-spec', 'to-tickets', 'tdd', 'diagnosing-bugs', 'code-review', 'prototype', '工程 Skill'],
    examples: ['把规格拆成开发任务', '先定位 Bug 再修改代码', '做一个前端原型'],
    userProvides: '你的项目、规格、待办任务或需要排查的问题。',
    userReceives: '一套可以按需挑选的工程 Skill 和对应使用方法。',
    suitableFor: '你想给 Harness 增加明确的实现、排错、审查和原型工作流。',
    readsOrChanges: '读取你指定的项目和配置；是否创建文件由你确认。',
    rollback: '停用或删除已复制到用户 Skill 目录的对应 Skill。',
    estimatedTime: '约 5–15 分钟',
    implementation: {
      extensionTypes: ['skill'],
      goal: '参考 mattpocock/skills，帮我从 implement、to-spec、to-tickets、tdd、diagnosing-bugs、code-review、prototype 中挑选适合当前 Harness 的 Skill。先解释职责和冲突，再由我确认是否创建。',
      addMethod: '打开仓库中的 skills/engineering 目录，选择需要的 Skill；复制对应名称到创造模式，让它按当前 Harness 的用户 Skill 目录和接口生成，不要整仓库盲目复制。',
      checks: DEV_CHECKS,
      source: 'GitHub 开源 Skill 集合',
      license: 'MIT',
      repositoryUrl: 'https://github.com/mattpocock/skills',
    },
  }),
  ability({
    id: 'panniantong-agent-reach',
    title: 'Panniantong/Agent-Reach',
    outcome: '给 AI 增加搜索和阅读多个公开互联网来源的能力。',
    summary: '适合联网检索 GitHub、网页、视频和社区资料，并保留来源链接。',
    industryIds: ['programmer'],
    kindIds: ['research'],
    collectionIds: [],
    aliases: ['Agent Reach', '联网搜索', 'GitHub 搜索', '多平台调研'],
    examples: ['查一个开源项目的最新用法', '比较多个公开技术方案'],
    userProvides: '研究问题、时间范围和允许访问的公开来源。',
    userReceives: '带来源、日期和不确定性说明的检索结果。',
    suitableFor: '你希望 AI 帮你查资料，而不是只根据已有知识回答。',
    readsOrChanges: '访问你允许的公开来源；默认不登录、不发帖、不修改远程内容。',
    rollback: '停用对应 Skill 或插件即可。',
    estimatedTime: '约 10–20 分钟',
    implementation: {
      extensionTypes: ['skill'],
      goal: '参考 Agent-Reach 的公开说明，帮我为当前 Harness 规划联网检索 Skill。先确认需要的渠道和权限，不自动登录或执行远程写操作。',
      addMethod: '先阅读仓库 README 和渠道要求，再把需要的渠道告诉创造模式；由创造模式生成本机可用的 Skill 配置，逐个做只读验证。',
      checks: ['每个关键结论附来源链接', '区分事实、推断和未知', '访问失败时说明失败来源而不是编造结果'],
      source: 'GitHub 开源 CLI / Skill',
      license: 'MIT',
      repositoryUrl: 'https://github.com/Panniantong/Agent-Reach',
    },
  }),
  ability({
    id: 'firecrawl-mcp-server',
    title: 'firecrawl/firecrawl-mcp-server',
    outcome: '把网页搜索和抓取能力接入 AI 工具调用。',
    summary: '适合把公开网页内容抓取、清理并交给自己的工作流处理。',
    industryIds: ['programmer'],
    kindIds: ['research'],
    collectionIds: [],
    aliases: ['Firecrawl', 'MCP', '网页抓取', '网页搜索', '爬虫'],
    examples: ['抓取公开文档并整理', '比较多个网页中的产品参数'],
    userProvides: '网址、抓取范围、输出格式和 API 使用边界。',
    userReceives: '一个可验证、可停用的网页抓取工具连接。',
    suitableFor: '你需要重复读取公开网站，希望 AI 能直接调用抓取工具。',
    readsOrChanges: '读取指定公开网页；默认不提交表单、不写回网站。',
    rollback: '删除 MCP 配置或停用连接即可。',
    estimatedTime: '约 10–20 分钟',
    implementation: {
      extensionTypes: ['plugin'],
      goal: '参考 Firecrawl 官方 MCP Server 的公开说明，帮我规划一个只读网页抓取连接。先说明 API 密钥、网络权限和费用边界，不自动安装或运行远程脚本。',
      addMethod: '打开仓库 README，准备自己的 API 配置；在创造模式中只添加用户确认过的 MCP 连接，并用一个公开网页做小范围测试。',
      checks: ['只访问用户指定的公开地址', '测试结果保留来源 URL', '说明密钥位置、停用和卸载方法'],
      source: 'Firecrawl 官方 MCP Server',
      license: 'MIT',
      repositoryUrl: 'https://github.com/firecrawl/firecrawl-mcp-server',
    },
  }),
  ability({
    id: 'mvanhorn-last30days-skill',
    title: 'mvanhorn/last30days-skill',
    outcome: '研究一个主题最近 30 天在公开来源上的真实讨论。',
    summary: '把 Reddit、X、YouTube、Hacker News 和网页内容整理成有来源的近期摘要。',
    industryIds: ['programmer'],
    kindIds: ['research'],
    collectionIds: [],
    aliases: ['last30days', '最近一个月', '趋势调研', '近期研究'],
    examples: ['看看最近 30 天大家怎么评价这个工具', '整理某个技术最近一个月的变化'],
    userProvides: '研究主题、时间范围、关注的平台和输出语言。',
    userReceives: '近期讨论、来源链接、观点分歧和待确认事实。',
    suitableFor: '你想知道近期用户真实讨论，而不只看官方文档。',
    readsOrChanges: '读取公开来源；不会替你发帖、评论或点赞。',
    rollback: '停用 Skill 或删除用户目录中的对应配置即可。',
    estimatedTime: '约 15–30 分钟',
    implementation: {
      extensionTypes: ['skill'],
      goal: '参考 last30days-skill 的公开说明，帮我规划一个近期趋势调研 Skill。先确认可用渠道和时间范围，不把搜索结果当成确定事实。',
      addMethod: '阅读仓库 README 和安装说明，将 Skill 放进用户自己的 Skill 目录；启用前先用一个小主题测试来源、日期和输出格式。',
      checks: ['报告明确覆盖的时间范围', '每个关键观点带来源和日期', '区分用户观点、事实和模型推断'],
      source: 'GitHub 开源 Skill',
      license: 'MIT',
      repositoryUrl: 'https://github.com/mvanhorn/last30days-skill',
    },
  }),
  ability({
    id: 'lenml-ponytail',
    title: 'lenML/Ponytail',
    outcome: '让 AI 先质疑是否需要增加代码，再选择最短可行方案。',
    summary: '用 YAGNI、原生能力优先和小改动原则减少不必要的依赖和架构。',
    industryIds: ['programmer'],
    kindIds: ['coding'],
    collectionIds: ['vibe-coding'],
    aliases: ['Ponytail', 'YAGNI', '少写代码', '简化方案', '反过度设计'],
    examples: ['这个功能能不能用更简单的方式做', '帮我删掉不必要的复杂架构'],
    userProvides: '当前需求、已有实现和不能改变的行为。',
    userReceives: '一个最小可行方案、可删除的复杂点和验证方式。',
    suitableFor: '你担心 AI 为小需求引入太多文件、依赖或抽象层。',
    readsOrChanges: '读取目标代码并提出经过确认的最小改动。',
    rollback: '按变更清单回退即可。',
    estimatedTime: '约 5–10 分钟',
    implementation: {
      extensionTypes: ['skill'],
      goal: '参考 Ponytail 的公开说明，帮我加入一条简化开发准则：先判断是否可以不做、用原生能力或减少依赖，未经确认不要扩大范围。',
      addMethod: '阅读仓库中的 Markdown 说明，将需要的规则复制到用户 Skill 目录或项目规则文件；先在一个小任务上验证，再决定是否长期启用。',
      checks: ['先列出不增加代码的可能性', '说明每个新增文件或依赖的必要性', '验证原有行为没有被无意改变'],
      source: 'GitHub 开源 Skill',
      license: 'MIT',
      repositoryUrl: 'https://github.com/lenML/Ponytail',
    },
  }),
  ability({
    id: 'ilm-alan-frontend-design',
    title: 'Ilm-Alan/frontend-design',
    outcome: '让 AI 在做前端时先确定视觉方向，再落成一致的页面细节。',
    summary: '一个社区维护的前端设计 Skill，适合页面、组件和主题改造。',
    industryIds: ['programmer'],
    kindIds: ['coding'],
    collectionIds: ['vibe-coding'],
    aliases: ['frontend-design', '前端设计', 'UI 设计', '页面美化'],
    examples: ['先定一套主题再改前端', '把这个页面做得更有设计感'],
    userProvides: '页面用途、参考风格、品牌色和需要保留的功能。',
    userReceives: '一套视觉方向、组件规则和可运行的页面改动。',
    suitableFor: '你能说清想要的感觉，但不知道如何转成前端规则。',
    readsOrChanges: '读取指定前端项目并修改授权范围内的 UI 文件。',
    rollback: '按文件变更回退，或停用对应 Skill。',
    estimatedTime: '约 15–30 分钟',
    implementation: {
      extensionTypes: ['skill'],
      goal: '参考该社区 frontend-design Skill 的公开说明，帮我为当前项目规划视觉设计规则。先确认许可证和适配范围，再修改指定 UI，不改变现有功能。',
      addMethod: '打开仓库 README 核对版本和许可证，将 Skill 放进用户目录；先让创造模式输出视觉规则，再决定是否应用到项目。',
      checks: ['先说明字体、颜色、间距和视觉取舍', '不改变现有交互契约', '运行构建或页面检查并说明回退文件'],
      source: '社区 GitHub Skill（非官方）',
      license: 'MIT',
      repositoryUrl: 'https://github.com/Ilm-Alan/frontend-design',
    },
  }),
  ability({
    id: 'microsoft-playwright',
    title: 'microsoft/playwright',
    outcome: '让 AI 帮你做浏览器操作、网页测试和边界清楚的公开网页采集。',
    summary: '一个项目级的浏览器自动化框架；适合把具体网页任务做成可运行、可停止的脚本。',
    industryIds: ['programmer'],
    kindIds: ['coding'],
    collectionIds: ['vibe-coding'],
    aliases: ['Playwright', '浏览器自动化', '网页自动化', '爬虫', '网页测试'],
    examples: ['抓取公开网页中的商品信息', '给后台页面写一条自动化测试'],
    userProvides: '目标网址、允许访问的页面、需要提取或验证的内容和停止条件。',
    userReceives: '项目级安装方法、自动化脚本、样例结果和停止方法。',
    suitableFor: '你想做网页测试、公开资料采集或重复的浏览器操作。',
    readsOrChanges: '只访问明确允许的网页；默认不绕过验证、不提交远程表单。',
    rollback: '停止脚本并删除项目级依赖或测试文件即可。',
    estimatedTime: '约 15–30 分钟',
    implementation: {
      extensionTypes: ['plugin'],
      goal: '参考 Microsoft Playwright 的公开说明，帮我在用户指定的新项目中规划浏览器自动化。先确认目标网址和停止条件，优先做只读演示，不绕过验证或提交远程表单。',
      addMethod: '在独立项目目录按官方 README 安装依赖；回到 Harness 创造模式，让它生成项目级脚本和验证命令，不把 Playwright 自动装进 Harness 全局环境。',
      checks: ['只访问明确允许的页面和数据', '用小范围样例验证选择器和输出', '说明停止、清理和扩大范围的方法'],
      source: 'Microsoft 开源浏览器自动化框架',
      license: 'Apache-2.0',
      repositoryUrl: 'https://github.com/microsoft/playwright',
    },
  }),
]

export const FEATURED_SCENES = [
  { id: 'workflow', title: '建立开发工作流', description: '规划、实现、调试、验证', abilityIds: ['obra-superpowers', 'mattpocock-skills', 'lenml-ponytail'] },
  { id: 'research', title: '扩展资料检索', description: '搜索、抓取、近期趋势', abilityIds: ['panniantong-agent-reach', 'firecrawl-mcp-server', 'mvanhorn-last30days-skill'] },
  { id: 'browser', title: '做浏览器自动化', description: '测试网页、采集公开资料', abilityIds: ['microsoft-playwright'] },
] as const

export const VIBE_CODING_GROUPS: readonly VibeCodingGroup[] = [
  { id: 'new-tool', title: '从零做一个小工具', description: '把一个具体需求做成能运行的第一版。', starter: '我想做一个给谁用、解决什么问题的小工具。', access: '一个新项目目录；需要安装依赖时会先询问。', milestone: '能启动、能完成核心任务的最小版本。', confirmation: '确认第一版方向后才继续增加功能。', verify: '提供启动命令和一条完整的使用示例。', abilityId: 'mattpocock-skills' },
  { id: 'add-feature', title: '给现有项目加功能', description: '先理解项目，再做一个边界清楚的改动。', starter: '这个项目现在能做什么，我希望它再多一个什么能力。', access: '读取项目文件；修改前先列出预计变更。', milestone: '一个范围可控、可以单独验收的功能。', confirmation: '确认实现方案和文件范围后再写代码。', verify: '运行现有测试，并给出新功能的验收步骤。', abilityId: 'mattpocock-skills' },
  { id: 'fix-problem', title: '修复一个问题', description: '先复现和定位，再修复并证明问题消失。', starter: '我遇到了什么现象、怎样触发、原本应该怎样。', access: '读取日志和相关代码；不先猜着改。', milestone: '稳定复现问题并确认根因。', confirmation: '说明根因和修复范围后再改动。', verify: '加入回归检查并重跑相关测试。', abilityId: 'mattpocock-skills' },
  { id: 'improve-code', title: '整理和改进代码', description: '做边界明确的整理，不改变原本行为。', starter: '哪部分难维护、慢或容易出错。', access: '读取目标模块和现有测试。', milestone: '列出能删除、合并或简化的具体位置。', confirmation: '确认不改变的行为和改动范围。', verify: '重跑测试并对比整理前后的行为。', abilityId: 'lenml-ponytail' },
  { id: 'browser-task', title: '做一次浏览器自动化', description: '从一个公开网页或测试页面开始。', starter: '我要访问哪个网址、读取或验证什么、什么时候停止。', access: '只访问明确允许的页面，不自动提交远程表单。', milestone: '一个可运行、可停止的小范围脚本。', confirmation: '确认页面范围、选择器和输出后再扩大。', verify: '提供样例结果、停止命令和清理方法。', abilityId: 'microsoft-playwright' },
  { id: 'learn-workflow', title: '学习项目是怎么工作的', description: '先画清结构，再完成一次有指导的小改动。', starter: '我最想理解哪条功能链路或哪个目录。', access: '只读项目即可开始。', milestone: '一张结构说明和一条关键执行路径。', confirmation: '选择一个低风险练习后再修改。', verify: '你可以自己复述流程并跑通练习。', abilityId: 'obra-superpowers' },
]

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, '')
}

function searchableText(item: AbilityDefinition): string {
  return normalize([
    item.title,
    item.outcome,
    item.summary,
    item.userProvides,
    item.userReceives,
    ...item.aliases,
    ...item.examples,
  ].join(' '))
}

export function abilitiesFor(filters: AbilityFilters): readonly AbilityDefinition[] {
  const query = normalize(filters.query)
  return ABILITIES.filter(item => (
    (filters.industry === 'all' || item.industryIds.includes(filters.industry))
    && (filters.kind === 'all' || item.kindIds.includes(filters.kind))
    && (query.length === 0 || searchableText(item).includes(query))
  ))
}

export function collectionAbilities(collectionId: CollectionId): readonly AbilityDefinition[] {
  return ABILITIES.filter(item => item.collectionIds.includes(collectionId))
}

export function recommendAbilities(problem: string): readonly AbilityDefinition[] {
  const query = normalize(problem)
  if (query.length === 0) return []

  return ABILITIES.map((item, index) => {
    const fields = [item.title, ...item.aliases, ...item.examples].map(normalize)
    const score = fields.reduce((total, field) => {
      if (field.length === 0) return total
      if (query.includes(field)) return total + Math.min(field.length, 8) * 3
      if (field.includes(query)) return total + Math.min(query.length, 8) * 2
      return total
    }, searchableText(item).includes(query) ? 12 : 0)
    return { item, index, score }
  })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 3)
    .map(result => result.item)
}

export const EXTENSION_TYPE_LABELS: Readonly<Record<ExtensionType, string>> = {
  'agent-preset': 'Agent 预设',
  skill: 'Skill',
  workflow: '工作流',
  plugin: '插件',
  'ui-extension': '界面扩展',
}
