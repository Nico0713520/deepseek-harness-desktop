# 程序员能力库扩充设计

## 目标

让“程序员”行业下的七个开发方向都有足够的高质量 GitHub 项目，不再出现后端、前端只剩两三张卡片的情况。

## 选择标准

- 只收录可追溯的 GitHub 仓库，不创建虚构 Skill。
- 优先官方组织、维护者原仓库、许可证清楚且近期仍活跃的项目。
- Star 是热度信号，不是唯一质量标准；数据库 MCP 等垂直官方项目即使 Star 较少也可以收录。
- 一个仓库只生成一张卡片，但可以进入多个开发方向。
- 能力中心只做推荐和创造模式入口，不自动安装、执行脚本或写入凭据。

## 本轮范围

### 前端

- `nextlevelbuilder/ui-ux-pro-max-skill`
- `Leonxlnx/taste-skill`
- `pbakaus/impeccable`
- `emilkowalski/skills`
- `vercel-labs/agent-skills`
- `vercel-labs/agent-browser`
- 已有 `anthropics/skills` 增加前端方向

### 后端

- `supabase/mcp`
- `neondatabase/mcp-server-neon`
- `mongodb-js/mongodb-mcp-server`
- `redis/mcp-redis`
- `awslabs/mcp`
- `docker/mcp-gateway`
- 已有 `github/github-mcp-server`、`modelcontextprotocol/servers` 增加后端方向

### 其他程序员方向

- 开发流程：`github/awesome-copilot`
- 爬虫：`unclecode/crawl4ai`、`apify/apify-mcp-server`、`vercel-labs/agent-browser`
- Agent 与工作流：`langchain-ai/langgraph`、`microsoft/autogen`、`crewAIInc/crewAI`、`agno-agi/agno`
- 数据与 AI：`NVIDIA/skills`，并补齐已有 `docling`、`paddleocr` 映射
- 运维：`aquasecurity/trivy`、`semgrep/semgrep`、`docker/mcp-gateway`

## UI 与数据流

目录继续复用现有卡片、Star 徽标、详情页和 GitHub 链接。新增数据只进入 `ADDITIONAL_ABILITIES`，开发方向集中维护在 `DEVELOPER_DIRECTIONS_BY_ABILITY_ID`；用户点击“让 DeepSeek 帮我创建”时仍先复制安全说明，再打开创造模式。

## 验收

- 程序员能力数量大于 70。
- 前端不少于 10 张，后端不少于 8 张。
- 七个开发方向均有项目，新增 ID 唯一、GitHub URL 合法。
- 目录测试、类型检查、构建和全仓测试通过。

