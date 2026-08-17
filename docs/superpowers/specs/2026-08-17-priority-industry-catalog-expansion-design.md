# 扩展中心四大重点行业扩库设计

**状态：** 设计待确认，尚未写入目录数据。

## 目标

把扩展中心从“以程序员通用工具为主”扩充为一个真正可宣传、可检索、可学习的高质量开源能力目录，重点补强：

- IT 与软件开发
- 零售与电商
- 金融
- 科研与学术

目录继续坚持“推荐与教学，不自动安装”。用户可以查看 GitHub 项目、理解用途、判断与 DeepSeek Harness 的接入方式，再决定是否让创造模式生成自己的适配版本。

## 当前缺口

当前目录共有 94 张卡片，但行业覆盖不均：

- 程序员条目多，但缺少安全研究、代码理解、可观测性、IaC、Agent 沙箱和厂商官方 Skills。
- 零售与电商条目大多是通用工具，缺少 Shopify、Amazon SP-API、支付、ERP、客服、商品分析和实验平台的完整链路。
- 金融专用条目主要是 OpenBB、CCXT 和 yfinance，缺少金融 Agent、量化研究、回测、监管文件和金融 Skill。
- “生命科学”不能代替广义科研；论文检索、引用管理、学术写作、PDF 解析和科研计算需要独立入口。

## 收录原则

1. **来源可追溯。** 每张卡必须链接到真实 GitHub 仓库。
2. **优先官方与长期维护项目。** 厂商官方仓库、维护者原仓库、活跃成熟项目优先。
3. **不只收 Skill。** Skill、MCP、插件、Agent 框架、工作流和行业级项目工具都可以收录，但必须写清接入方式。
4. **不把高 Star 当成唯一标准。** Shopify、PayPal、Amazon、Sentry 等厂商官方垂直仓库，即使 Star 较少仍有高价值。
5. **排除明显低质量项目。** 归档、失效、来源不明、只有营销文案没有实现、无法确认仓库内容的项目不收录。
6. **不暗示官方兼容。** 只有真实 MCP 或可复制 Skill 才标为直接路径；其余统一写成项目级工具或需要创造模式适配。
7. **不自动执行。** 不自动安装依赖、不运行远程脚本、不写入密钥、不进行交易、不修改线上店铺。
8. **Star 保持静态。** 使用本次核验的 GitHub Star 快照；不增加实时请求、更新时间标记或自动更新逻辑。

## 分类设计

### 一级行业

保留现有行业，并新增：

- `research-science`：科研与学术

这样“科研与学术”负责跨学科研究流程，“生命科学”继续负责生物、化学、医药等垂直方向。一张卡可以同时属于两个行业。

### 程序员开发方向

继续使用现有七个方向，不增加第三行筛选：

- 开发流程
- 前端
- 后端
- 爬虫
- Agent 与工作流
- 数据与 AI
- 运维

新增 IT 项目必须至少映射一个开发方向。

### 能力种类

继续使用现有五类：编程开发、内容创作、资料研究、自动执行、数据分析。电商、金融和科研条目依靠“行业 + 种类”组合筛选，不再增加一排容易让新手困惑的专业标签。

## 本轮候选池

以下候选已经核验为未归档 GitHub 仓库。实现时仍会逐项保存来源、许可证、静态 Star、用途、权限边界、撤销方法和 Harness 适配路径。

### IT 与软件开发（26）

- `addyosmani/agent-skills`
- `google/skills`
- `trailofbits/skills`
- `cloudflare/skills`
- `getsentry/skills`
- `expo/skills`
- `supabase/agent-skills`
- `ChromeDevTools/chrome-devtools-mcp`
- `DeusData/codebase-memory-mcp`
- `oraios/serena`
- `OpenHands/OpenHands`
- `Aider-AI/aider`
- `continuedev/continue`
- `cline/cline`
- `The-PR-Agent/pr-agent`
- `gitleaks/gitleaks`
- `google/osv-scanner`
- `e2b-dev/E2B`
- `daytonaio/daytona`
- `SonarSource/sonarqube-mcp-server`
- `grafana/mcp-grafana`
- `hashicorp/terraform-mcp-server`
- `googleapis/mcp-toolbox`
- `bytebase/dbhub`
- `czlonkowski/n8n-mcp`
- `BagelHole/DevOps-Security-Agent-Skills`

### 零售与电商（21）

- `nexscope-ai/eCommerce-Skills`
- `Shopify/ucp-cli`
- `Shopify/agent-skills`
- `Shopify/liquid-skills`
- `paypal/agent-toolkit`
- `amzn/selling-partner-api-models`
- `amzn/selling-partner-api-samples`
- `medusajs/medusa`
- `saleor/saleor`
- `vendurehq/vendure`
- `woocommerce/woocommerce`
- `spree/spree`
- `frappe/erpnext`
- `chatwoot/chatwoot`
- `PostHog/posthog`
- `growthbook/growthbook`
- `metabase/metabase`
- `apache/superset`
- `AgriciDaniel/claude-seo`
- `brightdata/brightdata-mcp`
- `bagisto/agent-skills`

现有的 `stripe/ai` 与 `Shopify/Shopify-AI-Toolkit` 保留，不重复创建卡片。

### 金融（20）

- `AI4Finance-Foundation/FinGPT`
- `AI4Finance-Foundation/FinRL`
- `AI4Finance-Foundation/FinRobot`
- `microsoft/qlib`
- `TauricResearch/TradingAgents`
- `virattt/ai-hedge-fund`
- `hsliuping/TradingAgents-CN`
- `microsoft/RD-Agent`
- `freqtrade/freqtrade`
- `vnpy/vnpy`
- `polakowo/vectorbt`
- `dgunning/edgartools`
- `QuantConnect/Lean`
- `aliyun/qwen-dianjin`
- `akfamily/akshare`
- `kernc/backtesting.py`
- `stefan-jansen/zipline-reloaded`
- `rollingSirius/equity-research-skill`
- `wilsonfreitas/awesome-quant`
- `georgezouq/awesome-ai-in-finance`

金融详情页必须明确：默认只做资料、研究、回测或开发参考，不自动下单，不转移资金，不构成投资建议。

### 科研与学术（25）

- `K-Dense-AI/scientific-agent-skills`
- `Orchestra-Research/AI-Research-SKILLs`
- `Imbad0202/academic-research-skills`
- `openags/paper-search-mcp`
- `zotero/zotero`
- `retorquere/zotero-better-bibtex`
- `54yyyu/zotero-mcp`
- `assafelovic/gpt-researcher`
- `langchain-ai/open_deep_research`
- `microsoft/graphrag`
- `deepset-ai/haystack`
- `run-llama/llama_index`
- `grobidOrg/grobid`
- `opendatalab/MinerU`
- `datalab-to/marker`
- `PDFMathTranslate/PDFMathTranslate`
- `karpathy/autoresearch`
- `aiming-lab/AutoResearchClaw`
- `pola-rs/polars`
- `dask/dask`
- `apache/arrow`
- `deepchem/deepchem`
- `rdkit/rdkit`
- `scverse/scanpy`
- `scverse/scvi-tools`

科研详情页必须明确：保留论文与数据来源、区分事实和模型推断、避免生成不存在的引用，并提示需要人工复核的方法和结果。

## 数据与代码组织

- 新建 `priority-industry-catalog.ts`，存放本轮行业条目，避免继续扩大现有 `additional-catalog.ts`。
- 使用短种子结构统一生成 `AbilityDefinition`，每个条目必须填写：
  - 行业与能力种类
  - 程序员开发方向（适用时）
  - 简单中文用途
  - GitHub 地址与许可证
  - 静态 Star 快照
  - 兼容路径
  - 添加方法、验证方法、权限边界和回滚方式
- `catalog.ts` 只负责组合三个目录数据源，不在 UI 中增加远程请求。
- 现有卡片、详情页、搜索和两行筛选保持不变。

## 兼容路径表达

- 仓库包含标准 `SKILL.md`：`skill-copy`
- 仓库提供可运行 MCP：`mcp`
- DeepSeek Harness 官方机制配方：`creator-recipe`
- 成熟外部框架或工具：`project-tool`
- 需要参考其思路自行封装：`manual-adapter`

“让 DeepSeek 帮我创建”必须根据兼容路径生成不同提示，不能把 Medusa、Qlib、Zotero 等外部项目说成可以直接复制到 Skill 目录。

## 验收标准

- 总目录从 94 项提升到至少 180 项。
- 新增 92 个候选中没有重复 ID 或重复 GitHub URL。
- IT 新增条目全部拥有开发方向。
- 新增“科研与学术”行业可独立筛选，并至少有 20 个专用条目。
- 电商至少有 15 个专用条目，覆盖店铺开发、平台 API、支付、ERP、客服、分析与 SEO。
- 金融至少有 15 个专用条目，覆盖数据、研究、Agent、回测、量化平台和监管文件。
- 归档仓库不得进入目录。
- 所有详情页都有 GitHub 链接、许可证、添加方式、风险检查和回滚说明。
- 不增加实时 Star 请求、不增加新的状态徽标、不修改“我的扩展”的本机逻辑。
- 目录单测、Creator Center 构建和桌面端测试通过。

