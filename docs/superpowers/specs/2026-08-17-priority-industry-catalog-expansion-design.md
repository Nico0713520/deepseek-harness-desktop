# 扩展中心四大重点行业扩库设计

**状态：** 设计待确认，尚未写入目录数据。

## 目标

把扩展中心从“以程序员通用工具为主”扩充为一个真正可宣传、可检索、可学习的高质量开源能力目录，重点补强：

- IT 与软件开发
- 零售与电商
- 金融
- 科研与学术，重点服务高校学生、研究生、博士生、教师和留学生

目录继续坚持“推荐与教学，不自动安装”。用户可以查看 GitHub 项目、理解用途、判断与 DeepSeek Harness 的接入方式，再决定是否让创造模式生成自己的适配版本。

## 当前缺口

当前目录共有 94 张卡片，但行业覆盖不均：

- 程序员条目多，但缺少安全研究、代码理解、可观测性、IaC、Agent 沙箱和厂商官方 Skills。
- 零售与电商条目大多是通用工具，缺少 Shopify、Amazon SP-API、支付、ERP、客服、商品分析和实验平台的完整链路。
- 金融专用条目主要是 OpenBB、CCXT 和 yfinance，缺少金融 Agent、量化研究、回测、监管文件和金融 Skill。
- “生命科学”不能代替广义科研；高校和留学生更常见的痛点是选题、文献检索、精读、综述、引用管理、论文写作、英文润色、排版、统计分析、投稿和审稿修改。

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

这样“科研与学术”负责跨学科的高校学术流程，“生命科学”继续负责生物、化学、医药和实验计算等垂直方向。一张卡可以同时属于两个行业，但 RDKit、Scanpy、scvi-tools 等专业计算库不进入“科研与学术”的首批核心卡片。

“科研与学术”的内容优先级固定为：

1. 文献检索、筛选与系统综述
2. Zotero、BibTeX 与引用真实性
3. 论文精读、笔记、证据与观点整理
4. 学术写作、英文润色和中英双语辅助
5. LaTeX、Typst、Word/Pandoc 与期刊格式
6. 统计分析与可复现研究
7. 投稿、同行评审、rebuttal 和修改

整篇论文或学位论文自动代写项目不作为主卖点。所有写作类条目都要强调“基于用户自己的研究材料辅助”，不得承诺替用户生成可直接提交的作业、论文或虚构引用。

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

### 科研与学术（44）

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

#### 文献检索、综述与引用管理

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

现有的 `Future-House/paper-qa`、`stanford-oval/storm`、`jupyterlab/jupyterlab`、`docling-project/docling` 和 `microsoft/markitdown` 保留并补充“科研与学术”行业映射，不重复创建卡片。

科研详情页必须明确：保留论文与数据来源、区分事实和模型推断、避免生成不存在的引用，并提示需要人工复核的方法和结果。论文写作类条目必须把用户自己的研究问题、数据、实验、笔记和参考文献作为输入，不把模型生成内容描述成可直接提交的学术成果。

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

- 总目录从 94 项提升到至少 200 项。
- 新增 111 个候选中没有重复 ID 或重复 GitHub URL。
- IT 新增条目全部拥有开发方向。
- 新增“科研与学术”行业可独立筛选，并至少有 35 个高校学术专用条目。
- 科研首屏优先展示文献检索、Zotero、论文阅读、学术写作、排版和统计工具，不优先展示生物化学专业计算库。
- 电商至少有 15 个专用条目，覆盖店铺开发、平台 API、支付、ERP、客服、分析与 SEO。
- 金融至少有 15 个专用条目，覆盖数据、研究、Agent、回测、量化平台和监管文件。
- 归档仓库不得进入目录。
- 所有详情页都有 GitHub 链接、许可证、添加方式、风险检查和回滚说明。
- 不增加实时 Star 请求、不增加新的状态徽标、不修改“我的扩展”的本机逻辑。
- 目录单测、Creator Center 构建和桌面端测试通过。
