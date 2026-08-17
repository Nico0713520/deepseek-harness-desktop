# DeepSeek Harness Desktop 扩展来源总账

日期：2026-08-17

## 1. 这份总账解决什么问题

扩展中心中的“已经收录”“调研候选”和“本机已经安装”必须严格分开：

- **当前目录**：已经出现在 DeepSeek Harness Desktop 扩展中心界面中的推荐卡片，不等于已经安装到用户的 Harness。
- **调研候选**：经过三轮搜索后准备加入目录的 GitHub 项目，仍需在实现时保存许可证、静态 Star、兼容路径和回滚说明。
- **本机 Codex 官方能力**：当前电脑中由 OpenAI 系统、OpenAI bundled 或 OpenAI curated 插件提供的 Skill。它们可以提供产品设计参考，但不能因为本机可见就直接复制进公开仓库。

当前集合关系：

- 已有目录：94 项。
- 最终去重新增候选：111 项。
- 完成扩库后的目标：约 205 项，验收下限为 200 项。
- 本机 Codex 官方参考能力：当前任务可见且确认来源的 21 项，不计入上述 111 项。

Star 继续使用每次发版时人工维护的静态快照，不增加实时请求、更新时间徽标或额外状态标签。

## 2. 三轮搜索是怎样演进的

### 第一轮：广泛发现

目标是证明扩展中心不应只收 DeepSeek 官方扩展，而应覆盖优质 Skill、MCP、插件、Agent 框架、工作流和行业工具。

第一轮没有保存一份完整的冻结 manifest，因此不能伪造“精确 50 项名单”。从会话记录中可以明确追溯的代表项目有 24 个：

- Skill：`addyosmani/agent-skills`、`google/skills`、`K-Dense-AI/scientific-agent-skills`、`nexscope-ai/eCommerce-Skills`、`phuryn/pm-skills`
- MCP：`ChromeDevTools/chrome-devtools-mcp`、`oraios/serena`、`grafana/mcp-grafana`、`makenotion/notion-mcp-server`、`googleapis/mcp-toolbox`
- Agent 与工作流：`n8n-io/n8n`、`activepieces/activepieces`、`openai/openai-agents-python`、`pydantic/pydantic-ai`
- 数据与 AI：`mem0ai/mem0`、`infiniflow/ragflow`、`langfuse/langfuse`、`promptfoo/promptfoo`
- 行业项目：`aliyun/qwen-dianjin`、`Azure-Samples/healthcare-agent-orchestrator`、`deepchem/deepchem`、`medusajs/medusa`、`ckan/ckan`、`moodle/moodle`

这一轮只用于建立方向；其中不少项目在第二轮被重新归类和核验，不重复计算。

### 第二轮：四大行业定向扩库

第二轮形成了第一份可审计的冻结清单，共 92 项：

- IT 与软件开发：26 项。
- 零售与电商：21 项。
- 金融：20 项。
- 科研：25 项。

对应设计提交：`ab7d7c6 docs: design priority industry catalog expansion`。

### 第三轮：科研改为高校与留学生学术工作流

第三轮没有继续拿科学计算库填充“科研”，而是将科研 25 项重构为 44 项高校学术项目，重点服务本科生、研究生、博士生、教师和留学生：

1. 文献检索、筛选与系统综述。
2. Zotero、BibTeX 与引用真实性。
3. 论文精读、笔记、证据与观点整理。
4. 学术写作、英文润色和中英双语辅助。
5. LaTeX、Typst、Pandoc、Word 与期刊格式。
6. 统计分析与可复现研究。
7. 投稿、同行评审、rebuttal 和修改。

对应设计提交：`9d91acc docs: refocus research catalog on academic workflows`。

第二轮的 92 项减去原科研 25 项，再加入第三轮学术 44 项，得到最终去重候选 111 项。

## 3. 最终新增候选 111 项

### 3.1 IT 与软件开发（26）

- 官方与厂商 Skill：`addyosmani/agent-skills`、`google/skills`、`trailofbits/skills`、`cloudflare/skills`、`getsentry/skills`、`expo/skills`、`supabase/agent-skills`
- 浏览器、代码理解与开发 Agent：`ChromeDevTools/chrome-devtools-mcp`、`DeusData/codebase-memory-mcp`、`oraios/serena`、`OpenHands/OpenHands`、`Aider-AI/aider`、`continuedev/continue`、`cline/cline`、`The-PR-Agent/pr-agent`
- 安全与沙箱：`gitleaks/gitleaks`、`google/osv-scanner`、`e2b-dev/E2B`、`daytonaio/daytona`
- 运维、可观测性与数据库 MCP：`SonarSource/sonarqube-mcp-server`、`grafana/mcp-grafana`、`hashicorp/terraform-mcp-server`、`googleapis/mcp-toolbox`、`bytebase/dbhub`、`czlonkowski/n8n-mcp`
- DevOps Skill：`BagelHole/DevOps-Security-Agent-Skills`

### 3.2 零售与电商（21）

- 电商 Skill 与 Agent 协议：`nexscope-ai/eCommerce-Skills`、`Shopify/ucp-cli`、`Shopify/agent-skills`、`Shopify/liquid-skills`、`bagisto/agent-skills`
- 支付和平台 API：`paypal/agent-toolkit`、`amzn/selling-partner-api-models`、`amzn/selling-partner-api-samples`
- 商城和 ERP：`medusajs/medusa`、`saleor/saleor`、`vendurehq/vendure`、`woocommerce/woocommerce`、`spree/spree`、`frappe/erpnext`
- 客服、分析与实验：`chatwoot/chatwoot`、`PostHog/posthog`、`growthbook/growthbook`、`metabase/metabase`、`apache/superset`
- SEO 与商品研究：`AgriciDaniel/claude-seo`、`brightdata/brightdata-mcp`

现有的 `stripe/ai` 和 `Shopify/Shopify-AI-Toolkit` 保留，不创建重复卡片。

### 3.3 金融（20）

- 金融大模型与 Agent：`AI4Finance-Foundation/FinGPT`、`AI4Finance-Foundation/FinRobot`、`aliyun/qwen-dianjin`
- 量化研究与回测：`AI4Finance-Foundation/FinRL`、`microsoft/qlib`、`microsoft/RD-Agent`、`freqtrade/freqtrade`、`vnpy/vnpy`、`polakowo/vectorbt`、`QuantConnect/Lean`、`kernc/backtesting.py`、`stefan-jansen/zipline-reloaded`
- 多 Agent 投研参考：`TauricResearch/TradingAgents`、`virattt/ai-hedge-fund`、`hsliuping/TradingAgents-CN`
- 数据与监管文件：`dgunning/edgartools`、`akfamily/akshare`
- Skill 与资源索引：`rollingSirius/equity-research-skill`、`wilsonfreitas/awesome-quant`、`georgezouq/awesome-ai-in-finance`

金融卡片默认只做资料、研究、回测和开发参考，不自动下单、不转移资金，也不构成投资建议。

### 3.4 科研与学术（44）

#### 学术 Skill 与论文工作流

- `LeonChaoX/qinyan-academic-skills`
- `Imbad0202/academic-research-skills`
- `Research-Equality/RE-paper-writing`
- `bahayonghang/academic-writing-skills`
- `labarba/sciwrite`
- `BESSER-PEARL/research-agent-skills`
- `ShaishavMaisuria/research-paper-lifecycle-skills`
- `ShZhao27208/Aut_Sci_Write`
- `Zhangyanbo/vibe-paper-writing`
- `hyl-ailab/scholar-forge`
- `Orchestra-Research/AI-Research-SKILLs`
- `K-Dense-AI/scientific-agent-skills`

#### 文献检索、系统综述与引用管理

- `openags/paper-search-mcp`
- `54yyyu/zotero-mcp`
- `yilewang/llm-for-zotero`
- `veale/academic-mcp`
- `zotero/zotero`
- `retorquere/zotero-better-bibtex`
- `JabRef/jabref`
- `papis/papis`
- `asreview/asreview`
- `vitorfs/parsifal`
- `citation-style-language/styles`
- `citation-js/citation-js`
- `inukshuk/anystyle`
- `assafelovic/gpt-researcher`
- `langchain-ai/open_deep_research`

#### 论文读取、PDF 与双语辅助

- `grobidOrg/grobid`
- `opendatalab/MinerU`
- `datalab-to/marker`
- `PDFMathTranslate/PDFMathTranslate`

#### 写作、排版与出版

- `typst/typst`
- `jgm/pandoc`
- `quarto-dev/quarto-cli`
- `overleaf/overleaf`
- `James-Yu/LaTeX-Workshop`
- `tectonic-typesetting/tectonic`
- `languagetool-org/languagetool`
- `vale-cli/vale`
- `manubot/manubot`

#### 统计分析与可复现研究

- `marimo-team/marimo`
- `jasp-stats/jasp-desktop`
- `jamovi/jamovi`
- `statsmodels/statsmodels`

现有的 `Future-House/paper-qa`、`stanford-oval/storm`、`jupyterlab/jupyterlab`、`docling-project/docling` 和 `microsoft/markitdown` 只补充“科研与学术”行业映射，不重复创建卡片。

## 4. 当前已经进入扩展中心的 94 项

这里的“进入扩展中心”只表示存在推荐卡片和接入说明，不表示已经安装到用户的 DeepSeek Harness。

### 4.1 DeepSeek Harness 官方机制配方（5）

- 创建自己的 Skill
- 连接一个 MCP 服务
- 定制 Agent Preset
- 增加一个设置或 UI 扩展
- 扩展审计与回滚配方

五张卡片都指向 `deepseek-ai/deepseek-harness`，用于解释官方自由扩展机制。

### 4.2 已收录的 Skill 或包含 Skill 的项目（55）

- 开发流程：`obra/superpowers`、`mattpocock/skills`、`lenML/Ponytail`、`danielvm-git/bigpowers`、`jnMetaCode/superpowers-zh`、`juicesharp/rpiv-mono`
- 联网与研究：`Panniantong/Agent-Reach`、`mvanhorn/last30days-skill`、`badlogic/pi-skills`、`pi-skills/browser-tools`、`pi-skills/brave-search`、`pi-skills/transcribe`、`pi-skills/youtube-transcript`、`pi-skills/gccli · gdcli · gmcli`、`nicobailon/pi-web-access`
- 前端与设计：`Ilm-Alan/frontend-design`、`nextlevelbuilder/ui-ux-pro-max-skill`、`Leonxlnx/taste-skill`、`pbakaus/impeccable`、`emilkowalski/skills`、`vercel-labs/agent-skills`、`vercel-labs/agent-browser`
- Agent、上下文与记忆：`chandra447/pi-hermes-memory`、`ttttmr/pi-context`、`nicobailon/pi-prompt-template-model`、`zosmaai/pi-llm-wiki`、`langchain-ai/langgraph`、`microsoft/autogen`、`crewAIInc/crewAI`
- 厂商与通用 Skill：`anthropics/skills`、`github/awesome-copilot`、`NVIDIA/skills`
- 文档与数据：`microsoft/markitdown`、`docling-project/docling`、`PaddlePaddle/PaddleOCR`、`duckdb/duckdb`、`pandas-dev/pandas`、`OpenRefine/OpenRefine`、`jupyterlab/jupyterlab`
- 行业工具：`stripe/ai`、`Shopify/Shopify-AI-Toolkit`、`OpenBB-finance/OpenBB`、`Future-House/paper-qa`、`ccxt/ccxt`、`ranaroussi/yfinance`、`synthetichealth/synthea`、`biopython/biopython`
- 安全与自动化：`unclecode/crawl4ai`、`aquasecurity/trivy`、`semgrep/semgrep`
- 社区 DSH 参考：`awesome-dsh-plugin/awesome-dsh-plugin`、`awesome-dsh-plugin/dsh-find-plugin`、`ZK-Andy/dsh-continual-evolve`、`PerryLink/dsh-skill-pack-security`、`lunw/shopline-ai-toolkit-dsh`

### 4.3 已收录的插件、MCP 或工具连接（33）

- 浏览器与检索：`firecrawl/firecrawl-mcp-server`、`microsoft/playwright`、`microsoft/playwright-mcp`、`browser-use/browser-use`、`apify/apify-mcp-server`
- 代码与知识：`github/github-mcp-server`、`upstash/context7`、`getsentry/sentry-mcp`、`sooperset/mcp-atlassian`、`Luke-Yong/dsh-plugin-knowledge-graph`
- MCP 框架与网关：`modelcontextprotocol/servers`、`ComposioHQ/composio`、`mcp-use/mcp-use`、`docker/mcp-gateway`、`agno-agi/agno`
- 数据库与云：`supabase/mcp`、`neondatabase/mcp-server-neon`、`mongodb-js/mongodb-mcp-server`、`redis/mcp-redis`、`awslabs/mcp`
- 医疗与科研：`GoogleCloudPlatform/hcls-mcp-servers`、`stanford-oval/storm`
- Pi 生态参考：`nicobailon/pi-mcp-adapter`、`nicobailon/pi-subagents`、`apmantza/pi-lens`、`edlsh/pi-ask-user`、`@vigolium/piolium`
- 社区 DSH 参考：`Anionex/dsh-vision-toolkit`、`jkrandom-sudo/dsh-plugin-audit`、`BiBoyang/dsh-eval-harness`、`omdsh-dev/plugin-template`、`dsh-market/dsh-market`、`xmanrui/dsh-feishu`

### 4.4 已收录的 Agent Preset（1）

- `qmx/pi-plan-mode`

### 4.5 当前目录的质量提醒

当前 94 项是历史累计目录，不代表 94 项都达到同一质量等级。厂商官方、项目维护者官方和成熟社区项目可以继续保留；Pi 与 DSH 社区参考项目需要在下一轮逐项核验来源、许可证、真实仓库状态和适配方式。无法核验的项目应标记为 `HOLD`，不能因为已经有卡片就继续宣传为高质量扩展。

## 5. 本机 Codex 中值得参考的官方 Skill 与插件

### 5.1 只读盘点状态

- 本机可发现的唯一 Skill 实体：126。
- 当前任务暴露的 Skill：126。
- 已启用插件包：12。
- OpenAI 官方且当前任务可见的推荐能力：21。
- 发现 20 组重复暴露路径和 30 个 cache-only 条目；当前没有名称冲突。

这 21 项只包括 OpenAI system、OpenAI primary runtime、OpenAI bundled 和已启用的 OpenAI curated GitHub 插件。个人目录、公司业务 Skill、社区 Skill、Ponytail 和仅存在缓存但未安装的插件不算“官方”。

### 5.2 OpenAI 系统 Skill（5）

- `openai-docs`：查询和核验 OpenAI/Codex 官方用法。
- `skill-creator`：创建结构清晰、触发范围明确的 Skill。
- `skill-installer`：从受控来源安装 Skill。
- `plugin-creator`：创建标准 Codex 插件结构。
- `imagegen`：官方图像生成和编辑能力。

本机还发现 `review-agent` 系统 Skill，但它没有暴露给当前任务，因此不放进“当前可用推荐”清单。

### 5.3 OpenAI 官方文档与办公插件（6）

- `documents`
- `pdf`
- `spreadsheets`
- `excel-live-control`
- `presentations`
- `template-creator`

这些能力适合转化成 Harness 扩展中心的产品方向：文档、PDF、表格、演示文稿和用户模板。不能直接复制本机实现；应优先寻找公开 GitHub 项目，或使用 Harness 创造模式重新设计等价的最小能力。

### 5.4 OpenAI 官方浏览器与桌面操作插件（3）

- `control-in-app-browser`
- `control-chrome`
- `computer-use`

它们适合作为 Harness 浏览器自动化、登录态浏览器和桌面操作能力的设计参考，但权限风险较高，详情页必须写清可访问范围、登录态、上传、点击和远程写操作边界。

### 5.5 OpenAI 官方网站与可视化插件（3）

- `sites-building`
- `sites-hosting`
- `visualize`

适合形成“建站、托管、交互式图表和数据可视化”方向。公开目录中应优先链接公开工具或官方文档，不复制 OpenAI 插件包中的私有实现。

### 5.6 OpenAI curated GitHub 插件（4）

- `github`
- `gh-address-comments`
- `gh-fix-ci`
- `yeet`

这四项来自已启用的 `github@openai-curated` 插件，适合为 Harness 设计 GitHub 仓库巡检、PR 评论处理、CI 修复和受控发布工作流。

## 6. 下一步如何合并进产品

### 6.1 第一批直接写入目录

- 将最终候选 111 项写入独立的 `priority-industry-catalog.ts`。
- 保留当前 94 项，不重复创建已有项目。
- 新增 `research-science` 行业，并给现有 5 个学术相关项目补充映射。
- 每张卡片保留中文价值说明、GitHub 地址、许可证、静态 Star、兼容路径、添加方法、验证方法和撤销办法。

### 6.2 本机官方能力的处理方式

- 有公开仓库或官方公开文档：可以建立“官方参考”卡片。
- 没有可再分发实现：只把能力方向写成 Harness 创造模式配方，不复制 OpenAI 本机文件。
- 需要外部账号、登录态、浏览器控制或远程写操作：必须额外写权限说明。

### 6.3 下一轮质量治理

- 对当前目录中的 Pi 与 DSH 社区项目逐项复核。
- 同一用途保留厂商官方或维护者官方项目作为首选，社区项目作为补充。
- 缺少许可证、来源身份、稳定版本或回滚办法的项目进入 `HOLD`，不进入首屏推荐。
- 扩展中心继续是推荐和教学，不在用户下载桌面应用时预装这些第三方扩展。

