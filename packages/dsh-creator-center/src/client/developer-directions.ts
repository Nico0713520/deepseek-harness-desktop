export type DeveloperDirectionId =
  | 'development-process'
  | 'frontend'
  | 'backend'
  | 'crawler'
  | 'agent-workflow'
  | 'data-ai'
  | 'operations'

export interface DeveloperDirection {
  readonly id: DeveloperDirectionId | 'all'
  readonly label: string
  readonly description: string
}

export const DEVELOPER_DIRECTIONS: readonly DeveloperDirection[] = [
  { id: 'all', label: '全部方向', description: '查看所有开发方向' },
  { id: 'development-process', label: '开发流程', description: '规划、实现、测试与审查' },
  { id: 'frontend', label: '前端', description: '界面、浏览器与交互' },
  { id: 'backend', label: '后端', description: '服务、接口与业务系统' },
  { id: 'crawler', label: '爬虫', description: '网页访问、搜索与数据采集' },
  { id: 'agent-workflow', label: 'Agent 与工作流', description: 'Agent、MCP 与自动化编排' },
  { id: 'data-ai', label: '数据与 AI', description: '数据处理、模型与知识工具' },
  { id: 'operations', label: '运维', description: '部署、监控、安全与质量' },
]

export const DEVELOPER_DIRECTION_LABELS: Readonly<Record<DeveloperDirectionId, string>> = Object.fromEntries(
  DEVELOPER_DIRECTIONS
    .filter((item): item is DeveloperDirection & { id: DeveloperDirectionId } => item.id !== 'all')
    .map(item => [item.id, item.label]),
) as Readonly<Record<DeveloperDirectionId, string>>

/**
 * A project may serve more than one development direction.
 * Keep this map explicit so the Hub's taxonomy is reviewable and editable
 * without changing the underlying third-party catalog entries.
 */
export const DEVELOPER_DIRECTIONS_BY_ABILITY_ID: Readonly<Record<string, readonly DeveloperDirectionId[]>> = {
  'obra-superpowers': ['development-process'],
  'mattpocock-skills': ['development-process'],
  'panniantong-agent-reach': ['crawler'],
  'firecrawl-mcp-server': ['crawler'],
  'mvanhorn-last30days-skill': ['crawler'],
  'lenml-ponytail': ['development-process'],
  'ilm-alan-frontend-design': ['frontend'],
  'microsoft-playwright': ['crawler'],
  'dsh-official-create-skill': ['agent-workflow', 'development-process'],
  'dsh-official-connect-mcp': ['agent-workflow'],
  'dsh-official-custom-agent-preset': ['agent-workflow'],
  'dsh-official-ui-extension': ['frontend', 'agent-workflow'],
  'dsh-official-plugin-audit': ['operations', 'agent-workflow'],
  'pi-mcp-adapter': ['agent-workflow'],
  'pi-web-access': ['crawler', 'data-ai'],
  'pi-subagents': ['agent-workflow'],
  'pi-lens': ['development-process', 'operations'],
  'pi-hermes-memory': ['agent-workflow'],
  'pi-plan-mode': ['agent-workflow', 'development-process'],
  'pi-ask-user': ['agent-workflow'],
  'pi-skills-collection': ['agent-workflow'],
  'pi-skill-browser-tools': ['crawler'],
  'pi-skill-brave-search': ['crawler'],
  'pi-skill-youtube-transcript': ['crawler', 'data-ai'],
  'microsoft-playwright-mcp': ['crawler', 'agent-workflow'],
  'github-mcp-server': ['agent-workflow', 'backend', 'operations'],
  'upstash-context7': ['data-ai'],
  'microsoft-markitdown': ['data-ai'],
  'stripe-ai': ['backend'],
  'getsentry-sentry-mcp': ['operations'],
  'anionex-dsh-vision-toolkit': ['frontend', 'data-ai'],
  'dsh-plugin-audit-community': ['operations'],
  'dsh-eval-harness': ['operations', 'development-process'],
  'anthropic-skills': ['frontend', 'agent-workflow', 'data-ai'],
  'modelcontextprotocol-servers': ['backend', 'agent-workflow'],
  'browser-use': ['crawler', 'agent-workflow'],
  'piolium': ['operations', 'agent-workflow'],
  'pi-context': ['agent-workflow'],
  'pi-prompt-template-model': ['agent-workflow'],
  'pi-llm-wiki': ['data-ai', 'agent-workflow'],
  'rpiv-pi': ['development-process', 'agent-workflow'],
  'bigpowers': ['development-process'],
  'superpowers-zh': ['development-process'],
  'dsh-plugin-template': ['agent-workflow'],
  'awesome-dsh-plugin': ['agent-workflow'],
  'dsh-market': ['agent-workflow'],
  'dsh-find-plugin': ['agent-workflow'],
  'dsh-continual-evolve': ['agent-workflow', 'operations'],
  'dsh-skill-pack-security': ['operations'],
  'dsh-plugin-knowledge-graph': ['data-ai'],
  'paddleocr': ['data-ai'],
  'docling': ['data-ai'],
  'composio': ['agent-workflow'],
  'mcp-use': ['backend', 'agent-workflow'],
  'mcp-atlassian': ['agent-workflow'],
  'ui-ux-pro-max-skill': ['frontend'],
  'leonxlnx-taste-skill': ['frontend'],
  'pbakaus-impeccable': ['frontend', 'development-process'],
  'emilkowalski-skills': ['frontend'],
  'vercel-agent-skills': ['frontend', 'development-process'],
  'vercel-agent-browser': ['frontend', 'crawler'],
  'github-awesome-copilot': ['development-process'],
  'supabase-mcp': ['backend', 'data-ai'],
  'neon-mcp-server': ['backend'],
  'mongodb-mcp-server': ['backend', 'data-ai'],
  'redis-mcp-server': ['backend', 'data-ai'],
  'awslabs-mcp': ['backend', 'operations', 'agent-workflow'],
  'docker-mcp-gateway': ['backend', 'operations', 'agent-workflow'],
  'crawl4ai': ['crawler', 'data-ai'],
  'apify-mcp-server': ['crawler', 'agent-workflow'],
  'langgraph': ['backend', 'agent-workflow'],
  'microsoft-autogen': ['agent-workflow'],
  'crewai': ['agent-workflow'],
  'agno': ['backend', 'agent-workflow'],
  'nvidia-skills': ['data-ai'],
  'trivy': ['operations', 'development-process'],
  'semgrep': ['operations', 'development-process'],
}
