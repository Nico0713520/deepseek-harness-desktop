export const INDUSTRIES = [
    { id: 'all', label: '全部行业' },
    { id: 'financial-services', label: '金融服务' },
    { id: 'healthcare', label: '医疗健康' },
    { id: 'life-sciences', label: '生命科学' },
    { id: 'retail', label: '零售与电商' },
    { id: 'government', label: '政府与公共服务' },
    { id: 'education', label: '教育' },
];
export const ABILITY_KINDS = [
    { id: 'all', label: '全部种类' },
    { id: 'coding', label: '编程开发', description: '写代码、检查问题、搭建工具' },
    { id: 'content-creation', label: '内容创作', description: '写文案、报告、脚本和说明' },
    { id: 'research', label: '资料研究', description: '搜集、比较并整理资料' },
    { id: 'agents', label: '自动执行', description: '按步骤执行任务、检查并提醒' },
    { id: 'data-analysis', label: '数据分析', description: '清洗数据、找规律、输出结论' },
];
export const INDUSTRY_LABELS = Object.fromEntries(INDUSTRIES.filter((item) => item.id !== 'all')
    .map(item => [item.id, item.label]));
export const ABILITY_KIND_LABELS = Object.fromEntries(ABILITY_KINDS.filter((item) => item.id !== 'all')
    .map(item => [item.id, item.label]));
function ability(seed) {
    return seed;
}
export const ABILITIES = [
    ability({
        id: 'weekly-report',
        title: '每周工作总结',
        outcome: '把零散记录变成结构清楚、可以直接检查的周报。',
        summary: '整理笔记、项目变更、客户反馈和关键数字，缺信息时先向你确认。',
        industryIds: ['retail', 'government', 'education'],
        kindIds: ['content-creation'],
        collectionIds: [],
        aliases: ['周报', '工作总结', '客户反馈', '整理笔记', '每天整理'],
        examples: ['把这周的聊天记录整理成周报', '按固定格式汇总客户反馈'],
        userProvides: '零散笔记、项目进展或你现有的周报格式。',
        userReceives: '一份结构固定、缺失信息有标记的周报草稿。',
        suitableFor: '你经常重复整理记录，但输出格式基本固定。',
        readsOrChanges: '只读取你主动提供的资料，并新增你的个人能力说明。',
        rollback: '在个人能力目录里停用或删除这份说明即可。',
        estimatedTime: '约 5–10 分钟',
        implementation: {
            extensionTypes: ['skill'],
            goal: '创建一个“每周工作总结”能力：把我提供的零散笔记、项目变更和数据整理成固定格式的周报；信息不足时先询问，不得编造。',
            checks: ['用一份真实笔记生成周报', '缺少数据时明确询问，不编造结果', '给出启用位置和撤销方法'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
    ability({
        id: 'company-sop',
        title: '公司 SOP 助手',
        outcome: '让 DeepSeek 按固定流程做事，并把每一步结果列清楚。',
        summary: '把容易漏步骤的日常流程变成可确认、可追踪的执行清单。',
        industryIds: ['healthcare', 'retail', 'government'],
        kindIds: ['agents'],
        collectionIds: [],
        aliases: ['SOP', '固定流程', '客户反馈', '售后流程', '重复步骤'],
        examples: ['每次按同一流程处理售后', '执行前先检查资料是否齐全'],
        userProvides: '你的流程文档、需要人工确认的节点和禁止操作。',
        userReceives: '一个按步骤执行、遇到风险会停下询问的专用助手。',
        suitableFor: '你有稳定的操作规范，希望每次都按同一流程执行。',
        readsOrChanges: '读取你提供的流程；新增个人助手和能力说明，不改官方界面。',
        rollback: '在个人助手设置里停用，并删除对应能力说明。',
        estimatedTime: '约 10–20 分钟',
        implementation: {
            extensionTypes: ['agent-preset', 'skill'],
            goal: '根据我提供的公司 SOP 创建一个专用助手。它必须逐项执行、记录完成状态，在高风险或信息不全时停下来向我确认。',
            checks: ['使用一份示例 SOP 跑完整流程', '高风险步骤停在人工确认处', '输出逐项完成状态和异常原因'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
    ability({
        id: 'web-research',
        title: '网页调研整理',
        outcome: '搜索并比较多个来源，交付带链接的简明结论。',
        summary: '把事实、推断和未知分开，保留每个关键结论的出处。',
        industryIds: ['financial-services', 'healthcare', 'life-sciences', 'retail', 'government', 'education'],
        kindIds: ['research'],
        collectionIds: [],
        aliases: ['搜索', '调研', '资料', '竞品', '行业研究'],
        examples: ['比较三个竞品的公开信息', '整理一项政策的最新资料'],
        userProvides: '研究问题、范围、时间要求和你信任或排除的来源。',
        userReceives: '一份带来源链接、日期和不确定性标记的研究摘要。',
        suitableFor: '你经常调研产品、行业或技术，需要保留证据来源。',
        readsOrChanges: '访问公开网页和你主动提供的资料；不修改原始资料。',
        rollback: '停用该助手即可，不会留下对官方前端的改动。',
        estimatedTime: '约 10–15 分钟',
        implementation: {
            extensionTypes: ['agent-preset'],
            goal: '创建一个网页调研助手：先搜索和比较多个可靠来源，再输出简明结论；关键事实必须带链接，并区分事实、推断和未知。',
            checks: ['至少比较两个独立来源', '每个关键结论附可访问链接', '明确标注推断、冲突与日期'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
    ability({
        id: 'file-data-analysis',
        title: '文件与数据分析',
        outcome: '把表格或本地资料整理成口径清楚、能够复查的报告。',
        summary: '先检查字段和缺失值，再按确认过的口径计算和解释。',
        industryIds: ['financial-services', 'life-sciences', 'retail'],
        kindIds: ['data-analysis'],
        collectionIds: [],
        aliases: ['Excel', 'CSV', '数据', '表格', '客户反馈', '销售分析'],
        examples: ['分析近 30 天销售表', '把客户反馈按问题类型分类'],
        userProvides: 'CSV、Excel 或资料文件，以及你关心的指标。',
        userReceives: '字段检查、计算过程和结论都可复查的分析报告。',
        suitableFor: '你反复使用相同口径查看表格、文档或项目文件。',
        readsOrChanges: '只读取你选择的文件；结果写到新文件，不覆盖原件。',
        rollback: '删除新生成的报告和个人能力说明即可，原文件不受影响。',
        estimatedTime: '约 10–20 分钟',
        implementation: {
            extensionTypes: ['skill'],
            goal: '创建一个文件与数据分析能力：读取我选择的 CSV、Excel 或资料文件，先检查字段和缺失值，再按确认过的口径生成可复查报告；不得覆盖原文件。',
            checks: ['先报告文件字段与缺失值', '计算口径可复查', '不覆盖原始文件并说明输出位置'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
    ability({
        id: 'github-review',
        title: '代码变更检查',
        outcome: '按严重程度检查代码变更，并给出位置、证据和建议。',
        summary: '默认只读，不会自动修改、提交、推送或创建合并请求。',
        industryIds: [],
        kindIds: ['coding'],
        collectionIds: ['vibe-coding'],
        aliases: ['GitHub', '代码审查', 'review', '检查代码', '找 bug'],
        examples: ['检查这次代码改动有没有风险', '帮我看这个 PR'],
        userProvides: '项目目录或明确的代码变更范围。',
        userReceives: '按严重程度排序、带文件位置和验证证据的问题清单。',
        suitableFor: '你希望每次提交或代码变更都按统一标准检查。',
        readsOrChanges: '默认只读取指定代码和变更记录，不写入项目。',
        rollback: '只读检查无需撤销；若后续同意修复，会先列出改动。',
        estimatedTime: '约 15–25 分钟',
        implementation: {
            extensionTypes: ['agent-preset', 'skill'],
            goal: '创建一个 GitHub 代码审查助手：检查指定变更，按严重程度列出问题、证据和修复建议；默认只读，不得自动修改、提交、推送或创建 PR。',
            checks: ['问题按严重程度排序', '每条问题带文件位置和可验证证据', '没有问题时明确说明检查范围'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
    ability({
        id: 'project-scaffold',
        title: '做出第一个可运行版本',
        outcome: '把一个明确想法变成可以启动、可以验证的最小版本。',
        summary: '先说清楚谁要用和完成后是什么样，再决定最简单的实现方式。',
        industryIds: [],
        kindIds: ['coding'],
        collectionIds: ['vibe-coding'],
        aliases: ['Vibe Coding', '做网站', '做工具', '做软件', '第一版', '脚手架'],
        examples: ['做一个库存查询小工具', '做一个能分享的内部网页'],
        userProvides: '使用人群、要解决的问题、参考样式和项目目录。',
        userReceives: '一个可运行的第一版、启动说明和下一步改进清单。',
        suitableFor: '你有明确需求，但不想先研究框架和目录结构。',
        readsOrChanges: '只在你选定的新目录创建文件；安装依赖前单独确认。',
        rollback: '保留原项目，删除新目录或回退明确列出的改动即可。',
        estimatedTime: '约 15–30 分钟',
        implementation: {
            extensionTypes: ['agent-preset'],
            goal: '创建一个项目搭建助手：先询问使用人群、目标和目录，给出文件计划，经确认后创建最小可运行版本并执行验证；不得覆盖现有文件。',
            checks: ['在指定目录创建最小示例', '运行构建或启动检查', '列出依赖、生成文件和清理方法'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
    ability({
        id: 'scheduled-check',
        title: '定时检查与提醒',
        outcome: '按固定时间检查一个条件，只在真正需要处理时提醒你。',
        summary: '适合重复巡检、状态检查、数据汇总和异常通知。',
        industryIds: ['financial-services', 'healthcare', 'retail', 'government'],
        kindIds: ['agents'],
        collectionIds: [],
        aliases: ['定时', '每天', '提醒', '巡检', '自动检查', '整理'],
        examples: ['每天九点检查库存', '每周汇总一次异常记录'],
        userProvides: '检查对象、时间、时区、触发条件和提醒内容。',
        userReceives: '一个可试跑、暂停和删除的定时检查任务。',
        suitableFor: '你有重复巡检、状态检查或定期汇总任务。',
        readsOrChanges: '读取确认过的数据源，并新增一个本地自动任务。',
        rollback: '在任务列表中暂停或删除；凭据和原始数据不会被删除。',
        estimatedTime: '约 15–30 分钟',
        implementation: {
            extensionTypes: ['workflow'],
            goal: '创建一个定时检查与提醒流程：先向我确认检查对象、时间、时区、触发条件和提醒内容；支持手动试跑、暂停和删除。',
            checks: ['显示下一次运行时间和时区', '用一次手动运行验证条件', '提供暂停、恢复和删除方法'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
    ability({
        id: 'custom-ui-theme',
        title: '自定义界面与主题',
        outcome: '给 Harness 增加可关闭的主题、桌宠或快捷入口。',
        summary: '保留官方聊天核心，视觉功能失败时自动回到官方界面。',
        industryIds: [],
        kindIds: ['coding'],
        collectionIds: ['vibe-coding'],
        aliases: ['主题', '桌宠', '界面', '皮肤', '壁纸', 'UI'],
        examples: ['增加一个鲸鱼主题开关', '做一个不挡聊天框的桌宠'],
        userProvides: '想要的视觉效果、可用素材和需要保留的官方区域。',
        userReceives: '一个可关闭、可卸载、失败时可恢复的界面扩展。',
        suitableFor: '你想增加主题、桌宠、快捷入口或独立设置功能。',
        readsOrChanges: '新增本地界面扩展和资源，不直接修改官方前端源码。',
        rollback: '在外观设置关闭并卸载扩展，即可恢复官方界面。',
        estimatedTime: '约 20–40 分钟',
        implementation: {
            extensionTypes: ['plugin', 'ui-extension'],
            goal: '创建一个可逆的 DeepSeek Harness 界面扩展：只通过官方扩展接口增加设置或视觉功能，不改官方聊天控件；关闭或失败时恢复官方界面。',
            checks: ['关闭扩展后恢复官方界面', '不遮挡官方输入框和侧栏', '记录资源来源、许可证和卸载方法'],
            source: 'Whale Desktop 内置示例',
            license: 'MIT',
        },
    }),
];
export const FEATURED_SCENES = [
    { id: 'work', title: '把重复工作交给 DeepSeek', description: '总结、分类、按流程检查', abilityIds: ['weekly-report', 'company-sop', 'scheduled-check'] },
    { id: 'research', title: '把资料变成可靠结论', description: '检索、对比、数据分析', abilityIds: ['web-research', 'file-data-analysis'] },
    { id: 'build', title: '把想法做成可运行版本', description: '搭工具、查代码、改界面', abilityIds: ['project-scaffold', 'github-review', 'custom-ui-theme'] },
];
export const VIBE_CODING_GROUPS = [
    { id: 'new-tool', title: '从零做一个小工具', description: '把一个具体需求做成能运行的第一版。', starter: '我想做一个给谁用、解决什么问题的小工具。', access: '一个新项目目录；需要安装依赖时会先询问。', milestone: '能启动、能完成核心任务的最小版本。', confirmation: '确认第一版方向后才继续增加功能。', verify: '提供启动命令和一条完整的使用示例。', abilityId: 'project-scaffold' },
    { id: 'add-feature', title: '给现有项目加功能', description: '先理解项目，再做一个边界清楚的改动。', starter: '这个项目现在能做什么，我希望它再多一个什么能力。', access: '读取项目文件；修改前先列出预计变更。', milestone: '一个范围可控、可以单独验收的功能。', confirmation: '确认实现方案和文件范围后再写代码。', verify: '运行现有测试，并给出新功能的验收步骤。' },
    { id: 'fix-problem', title: '修复一个问题', description: '先复现和定位，再修复并证明问题消失。', starter: '我遇到了什么现象、怎样触发、原本应该怎样。', access: '读取日志和相关代码；不先猜着改。', milestone: '稳定复现问题并确认根因。', confirmation: '说明根因和修复范围后再改动。', verify: '加入回归检查并重跑相关测试。', abilityId: 'github-review' },
    { id: 'improve-code', title: '整理和改进代码', description: '做边界明确的整理，不改变原本行为。', starter: '哪部分难维护、慢或容易出错。', access: '读取目标模块和现有测试。', milestone: '列出能删除、合并或简化的具体位置。', confirmation: '确认不改变的行为和改动范围。', verify: '重跑测试并对比整理前后的行为。', abilityId: 'github-review' },
    { id: 'shareable', title: '做出可以分享的版本', description: '补齐说明、检查、打包和发布清单。', starter: '现在项目怎样启动，希望分享给什么人。', access: '读取项目配置；发布动作必须单独确认。', milestone: '别人按文档可以在本地跑起来。', confirmation: '确认安装方式和发布目标后再打包。', verify: '在干净环境执行一次安装和启动检查。', abilityId: 'project-scaffold' },
    { id: 'learn-project', title: '学习项目是怎么工作的', description: '先画清结构，再完成一次有指导的小改动。', starter: '我最想理解哪条功能链路或哪个目录。', access: '只读项目即可开始。', milestone: '一张结构说明和一条关键执行路径。', confirmation: '选择一个低风险练习后再修改。', verify: '你可以自己复述流程并跑通练习。' },
];
function normalize(value) {
    return value.trim().toLocaleLowerCase().replace(/\s+/g, '');
}
function searchableText(item) {
    return normalize([
        item.title,
        item.outcome,
        item.summary,
        item.userProvides,
        item.userReceives,
        ...item.aliases,
        ...item.examples,
    ].join(' '));
}
export function abilitiesFor(filters) {
    const query = normalize(filters.query);
    return ABILITIES.filter(item => ((filters.industry === 'all' || item.industryIds.includes(filters.industry))
        && (filters.kind === 'all' || item.kindIds.includes(filters.kind))
        && (query.length === 0 || searchableText(item).includes(query))));
}
export function collectionAbilities(collectionId) {
    return ABILITIES.filter(item => item.collectionIds.includes(collectionId));
}
export function recommendAbilities(problem) {
    const query = normalize(problem);
    if (query.length === 0)
        return [];
    return ABILITIES.map((item, index) => {
        const fields = [item.title, ...item.aliases, ...item.examples].map(normalize);
        const score = fields.reduce((total, field) => {
            if (field.length === 0)
                return total;
            if (query.includes(field))
                return total + Math.min(field.length, 8) * 3;
            if (field.includes(query))
                return total + Math.min(query.length, 8) * 2;
            return total;
        }, searchableText(item).includes(query) ? 12 : 0);
        return { item, index, score };
    })
        .sort((left, right) => right.score - left.score || left.index - right.index)
        .slice(0, 3)
        .map(result => result.item);
}
export const EXTENSION_TYPE_LABELS = {
    'agent-preset': 'Agent 预设',
    skill: 'Skill',
    workflow: '工作流',
    plugin: '插件',
    'ui-extension': '界面扩展',
};
