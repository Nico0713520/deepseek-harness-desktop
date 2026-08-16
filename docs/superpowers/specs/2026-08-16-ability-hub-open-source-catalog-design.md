# Ability Hub Open-Source Catalog Design

**Status:** Approved for implementation by the user's direct request to add the recommended Skills and plugins.

## Goal

把用户已经筛选过的 Vibe Coding 推荐 Skill、插件和项目加入能力 Hub，同时为已经核验的上游项目提供 GitHub 链接、许可证和来源说明。

## Scope

- 保留当前能力 Hub 的白底、行业/种类两行筛选和卡片布局。
- 增加一组面向程序员的开源能力卡片，覆盖开发流程、规格设计、联网研究、网页抓取、趋势调研、代码简化和前端设计。
- 详情页的高级信息显示 GitHub 仓库链接；没有核验到公开上游的本地 Skill 显示“本地内置 / 待补地址”，不伪造 URL。
- 不在本次工作中自动安装第三方代码、不执行远程脚本、不新增远程目录服务。

## Verified sources

| Hub entry | Repository | License | Notes |
| --- | --- | --- | --- |
| 开发流程基础包 | https://github.com/obra/superpowers | MIT | Covers brainstorming, writing plans, TDD, systematic debugging, review handoff, and verification |
| 需求到规格与任务 | https://github.com/Fission-AI/OpenSpec | MIT | Spec-driven development for AI coding assistants |
| 全网检索助手 | https://github.com/Panniantong/Agent-Reach | MIT | Search and read multiple public web platforms |
| Firecrawl 网页抓取 | https://github.com/firecrawl/firecrawl-mcp-server | MIT | Official Firecrawl MCP server; core Firecrawl repository has a different AGPL-3.0 license |
| 最近 30 天趋势调研 | https://github.com/mvanhorn/last30days-skill | MIT | Community Skill for recent-topic research |
| 少写代码的简化准则 | https://github.com/lenML/Ponytail | MIT | Ponytail guidance in one Markdown file |
| 前端视觉设计 | https://github.com/Ilm-Alan/frontend-design | MIT | Community frontend-design Skill |

## Unverified local skills

`implement`、`to-spec`、`to-tickets`、`prototype`、`growth-memory`、`tracegate`、`frontend-design` 的本地版本以及其他工作流 Skill 没有被确认是上述公开仓库的同一份内容。它们可以作为本地能力说明出现，但不显示未经核验的 GitHub 地址；后续用户提供上游后只需补充数据字段。

## Data contract

`AbilityDefinition.implementation.repositoryUrl` is optional. The UI renders an external link only when it is present. Existing fields continue to describe the guarded creation prompt, checks, rollback, and license. Repository links are informational; the primary action remains copying a creation prompt and entering official Creator Mode.

## Acceptance criteria

1. The existing eight local templates remain available and unchanged.
2. Every verified repository appears in exactly one catalog entry with its URL and license.
3. The programmer + coding filter returns the new coding entries and existing coding templates.
4. The research filter returns Agent Reach, Firecrawl, and Last 30 Days entries.
5. A detail panel exposes a labeled external GitHub link only for entries with a verified URL.
6. No UI action silently installs or executes a remote repository.
