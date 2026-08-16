# 我的扩展：本机测试与用户扩展管理

## 目标

在能力中心旁边增加一个同版式的“我的扩展”页面。它只展示用户主动添加的 Skill 和插件，不展示 DeepSeek Harness 内置能力、鲸鱼主题插件或官方随包组件。

本轮只为当前 Mac 的本地测试数据安装三个扩展：

- `brainstorming`：Skill，开发流程
- `frontend-design`：Skill，前端
- `Playwright MCP`：插件，爬虫 / Agent 与工作流

这些文件只写入当前用户的 DSH_HOME，不进入仓库源代码、发布包或默认安装数据。新用户没有扩展登记记录时，页面显示空状态。

## 用户界面

复用能力中心的视觉和信息结构：

1. 左侧在“能力中心”下方增加“我的扩展”一级入口。
2. 主区域沿用能力中心的白底页面、标题区、搜索框、筛选行和三列卡片。
3. 筛选分为“类型”（全部、Skill、插件）和“分类”（开发流程、前端、爬虫、Agent 与工作流等）。
4. 卡片展示名称、类型、分类、用途、GitHub 地址、安装状态和“查看详情”。
5. 详情页展示来源、GitHub、安装位置、启用状态和“删除扩展”。
6. 删除前要求确认；只有扩展登记册中由本程序登记的用户扩展可以删除。

## 数据和权限边界

主进程中的 DSH web 端通过 `webServer` 提供用户扩展 API。登记文件为：

```text
$DSH_HOME/whale-user-extensions.json
```

Skill 文件放在 DSH 官方用户 Skill 根目录：

```text
$DSH_HOME/skills/<skill-name>/SKILL.md
```

扩展记录包含 `id`、`title`、`kind`、`category`、`summary`、`repositoryUrl`、`localPath`、`managedBy`、`installedAt` 和 `enabled`。API 只返回 `managedBy: whale-extension-center` 的记录。

删除 API 只允许删除登记记录及其位于 `$DSH_HOME/skills` 或 `$DSH_HOME/user-extensions` 下的路径，不允许删除 profile、官方预设、会话、凭据或工作区。

## 本机测试安装

- `brainstorming` 和 `frontend-design` 以本机已存在的 Skill 文件为来源，复制到 DSH_HOME 的用户 Skill 根目录；复制时保留原始 frontmatter 和来源记录。
- Playwright MCP 使用官方 `@playwright/mcp` 包，通过 DSH 官方 `@deepseek-ai/dsh-mcp-client` 的用户 profile patch 启动。它只修改当前 Mac 的 profile，不修改仓库里的 bundle 或发布构建配置。
- 三项记录都标记为“仅本机测试”，发布构建检查不得读取或复制该登记文件。

## 失败和回滚

- 读取登记文件失败时返回空列表，不阻塞 Harness 启动。
- 写入失败时保留原文件，API 返回错误，UI 不更新为成功状态。
- 删除只在成功移除用户路径后删除登记记录；任何路径校验失败都拒绝操作。
- 需要回滚本机测试时，删除三个用户 Skill 目录、移除 Playwright profile patch 和本地依赖，再删除登记文件；仓库文件不需要回滚。

## 验收标准

- 干净的 DSH_HOME 打开“我的扩展”显示空状态。
- 当前 Mac 测试环境显示三张卡片，并能按类型和分类筛选。
- 点击卡片打开详情，详情中的 GitHub 链接可访问，删除后卡片消失。
- `brainstorming` 和 `frontend-design` 能被 DSH 用户 Skill 发现。
- Playwright MCP 配置失败时 Harness 仍可启动，页面显示失败状态而不误报已启用。
- `check:release-assets`、类型检查、单测和构建通过；发布目录不包含 DSH_HOME 的登记文件、用户 Skill 或 Playwright 依赖。
