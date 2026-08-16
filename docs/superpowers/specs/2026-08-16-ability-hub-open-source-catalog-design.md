# Ability Hub GitHub 项目目录设计

**状态：** 按用户最新方向收敛并进入实现。

## 目标

把用户推荐的公开 Skill、插件和项目整理成“能力 Hub”目录。Hub 只负责帮助用户看懂、筛选和学习，不把这些项目自动安装到 DeepSeek Harness。

## 本次范围

- 保留白底、简洁的能力库和“行业 / 种类”两行筛选。
- 删除之前的每周总结、SOP、网页调研、文件分析等自设计示例卡片。
- 每个 GitHub 项目独占一张卡片，卡片明确显示项目名、行业、能力种类和扩展类型（Skill / 插件）。
- 点进详情后显示适合谁、怎么添加、检查清单、许可证和 GitHub 地址。
- “让 DeepSeek 帮我创建”只复制安全说明并进入官方创造模式；不自动安装远程仓库、不执行远程脚本。

## 当前保留的已核验项目

| 项目 | 类型 | GitHub | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| obra/superpowers | Skill | https://github.com/obra/superpowers | MIT | 规划、TDD、调试、审查和完成前验证 |
| mattpocock/skills | Skill | https://github.com/mattpocock/skills | MIT | implement、to-spec、to-tickets、排错、审查和原型 |
| Panniantong/Agent-Reach | Skill | https://github.com/Panniantong/Agent-Reach | MIT | 多来源公开互联网检索 |
| firecrawl/firecrawl-mcp-server | 插件 | https://github.com/firecrawl/firecrawl-mcp-server | MIT | Firecrawl 官方 MCP 网页抓取服务 |
| mvanhorn/last30days-skill | Skill | https://github.com/mvanhorn/last30days-skill | MIT | 最近 30 天公开讨论研究 |
| lenML/Ponytail | Skill | https://github.com/lenML/Ponytail | MIT | YAGNI 和减少过度设计 |
| Ilm-Alan/frontend-design | Skill | https://github.com/Ilm-Alan/frontend-design | MIT | 社区前端设计 Skill，非官方上游 |
| microsoft/playwright | 插件 | https://github.com/microsoft/playwright | Apache-2.0 | 浏览器测试和自动化框架 |

没有核验到公开上游的本地 Skill（例如 growth-memory、tracegate）不放进这一版项目目录，避免把不同项目误标为同一个 GitHub 来源。

## 数据约束

- `repositoryUrl` 在当前目录中是必填字段，因为展示的都是已核验 GitHub 项目。
- `addMethod` 是必填字段，详情页必须直接告诉小白“去哪里看、复制什么、让创造模式做什么、如何验证和撤销”。
- 项目卡片不代表已安装，也不代表 Harness 官方支持；详情页需保留来源、许可证和风险边界。
