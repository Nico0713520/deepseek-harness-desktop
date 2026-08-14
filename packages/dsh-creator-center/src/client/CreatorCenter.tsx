import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { SettingsSectionOwnerProps } from '@deepseek-ai/dsh-client-ui-settings/client'
import {
  CREATOR_TEMPLATES,
  EXTENSION_TYPE_LABELS,
  EXTENSION_TYPES,
  USE_CATEGORIES,
  templatesFor,
  type BrowseMode,
  type CreatorTemplate,
} from './catalog.ts'
import { ADVISOR_FALLBACK_PROMPT, buildCreationPrompt } from './prompt.ts'
import type { LaunchSnapshot } from './session-launcher.ts'
import styles from './creator-center.module.css'

const ADVISOR_PRESET_ID = 'whale-extension-advisor'

export interface CreatorLauncher {
  getSnapshot(): LaunchSnapshot
  subscribe(listener: () => void): () => void
  launch(presetId: string): void
  clearError(): void
}

export interface ClipboardPort {
  writeText(text: string): Promise<void>
}

export interface CreatorCenterProps extends SettingsSectionOwnerProps {
  readonly launcher: CreatorLauncher
  readonly clipboard?: ClipboardPort
}

function TemplateDetails({
  template,
  disabled,
  onCopy,
  onCreate,
}: {
  readonly template: CreatorTemplate
  readonly disabled: boolean
  readonly onCopy: (prompt: string) => void
  readonly onCreate: (prompt: string) => void
}) {
  const prompt = buildCreationPrompt({ goal: template.goal, template })
  return (
    <div className={styles.details}>
      <dl className={styles.detailGrid}>
        <div><dt>适合你的情况</dt><dd>{template.suitableFor}</dd></div>
        <div><dt>创建后会得到</dt><dd>{template.result}</dd></div>
        <div><dt>可能修改的位置</dt><dd>{template.changes}</dd></div>
        <div><dt>风险与权限</dt><dd>{template.risk}</dd></div>
      </dl>
      <div className={styles.checks}>
        <strong>完成后的检查清单</strong>
        <ul>{template.checks.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <label className={styles.promptLabel}>
        创建说明
        <textarea readOnly value={prompt} rows={8} />
      </label>
      <div className={styles.actions}>
        <button type="button" disabled={disabled} onClick={() => { onCopy(prompt) }}>仅复制提示词</button>
        <button type="button" className={styles.primary} disabled={disabled} onClick={() => { onCreate(prompt) }}>
          复制提示词并开始创造
        </button>
      </div>
    </div>
  )
}

export function CreatorCenter({ launcher, close, clipboard = navigator.clipboard }: CreatorCenterProps) {
  const launch = useSyncExternalStore(launcher.subscribe, launcher.getSnapshot)
  const [browseMode, setBrowseMode] = useState<BrowseMode>('use')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [customGoal, setCustomGoal] = useState('')
  const [customPrompt, setCustomPrompt] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [advisorRequested, setAdvisorRequested] = useState(false)
  const [closeOnLaunch, setCloseOnLaunch] = useState(false)

  const filters = browseMode === 'use' ? USE_CATEGORIES : EXTENSION_TYPES
  const visibleTemplates = useMemo(() => templatesFor(browseMode, filter), [browseMode, filter])
  const selectedFilter = filters.find(item => item.id === filter)
  const busy = launch.busy

  useEffect(() => {
    if (closeOnLaunch && launch.launchedPreset !== null) close()
  }, [close, closeOnLaunch, launch.launchedPreset])

  const changeMode = (mode: BrowseMode): void => {
    setBrowseMode(mode)
    setFilter('all')
  }

  const copyOnly = async (prompt: string): Promise<boolean> => {
    setCopyError(null)
    try {
      await clipboard.writeText(prompt)
      setStatus('创建说明已复制。')
      return true
    } catch {
      setCopyError('复制失败。创建说明仍显示在页面中，请手动选择复制。')
      return false
    }
  }

  const copyAndCreate = async (prompt: string, presetId = 'cordis'): Promise<void> => {
    if (!await copyOnly(prompt)) return
    launcher.clearError()
    setCloseOnLaunch(true)
    launcher.launch(presetId)
    setStatus('创建说明已复制；请粘贴并发送。')
  }

  const generateCustomPrompt = (): void => {
    try {
      const prompt = buildCreationPrompt({ goal: customGoal })
      setValidationError(null)
      setCustomPrompt(prompt)
    } catch (error) {
      setCustomPrompt(null)
      setValidationError(error instanceof Error ? error.message : String(error))
    }
  }

  const askAdvisor = (): void => {
    setAdvisorRequested(true)
    setCopyError(null)
    launcher.clearError()
    setCloseOnLaunch(true)
    launcher.launch(ADVISOR_PRESET_ID)
    setStatus('正在打开 AI 扩展顾问；进入对话后直接说你想解决的问题。')
  }

  const fallbackAdvisor = async (): Promise<void> => {
    setAdvisorRequested(false)
    await copyAndCreate(ADVISOR_FALLBACK_PROMPT)
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>创造中心 · 新手向导</span>
          <h2>告诉 DeepSeek 你想多会一件什么事</h2>
          <p>不用先学插件。选一个目标，我们会准备好创建说明，并用官方创造模式开始。</p>
          <ol className={styles.steps} aria-label="创造步骤">
            <li><b>1</b>选目标</li><li><b>2</b>看改动</li><li><b>3</b>先出计划</li><li><b>4</b>验证再用</li>
          </ol>
        </div>
        <aside className={styles.advisorCard}>
          <span className={styles.aiBadge}>AI</span>
          <strong>不知道选什么？</strong>
          <p>用普通话说需求。AI 最多问 3 个关键问题，再给你 1–3 个建议。</p>
          <button type="button" className={styles.primary} disabled={busy} onClick={askAdvisor}>问 AI 扩展顾问</button>
        </aside>
      </section>

      <section className={styles.custom}>
        <label htmlFor="creator-custom-goal">没有合适模板？描述你想解决的问题</label>
        <div className={styles.customRow}>
          <textarea
            id="creator-custom-goal"
            value={customGoal}
            rows={2}
            placeholder="例如：每天把客户反馈分成产品、物流和售后三类"
            onChange={(event) => { setCustomGoal(event.currentTarget.value) }}
          />
          <button type="button" onClick={generateCustomPrompt}>为我的需求生成创建说明</button>
        </div>
        {validationError !== null && <p className={styles.error} role="alert">{validationError}</p>}
        {customPrompt !== null && (
          <div className={styles.customPreview}>
            <label className={styles.promptLabel}>
              你的安全创建说明
              <textarea readOnly value={customPrompt} rows={7} />
            </label>
            <div className={styles.actions}>
              <button type="button" onClick={() => { void copyOnly(customPrompt) }}>仅复制提示词</button>
              <button type="button" className={styles.primary} disabled={busy} onClick={() => { void copyAndCreate(customPrompt) }}>
                复制提示词并开始创造
              </button>
            </div>
          </div>
        )}
      </section>

      <section className={styles.catalog}>
        <header className={styles.catalogHeader}>
          <div>
            <h3>从一个实用能力开始</h3>
            <p>默认按用途找最简单；想学原理时再按扩展类型看。</p>
          </div>
          <div className={styles.modeSwitch} aria-label="目录浏览方式">
            <button type="button" aria-pressed={browseMode === 'use'} onClick={() => { changeMode('use') }}>按用途</button>
            <button type="button" aria-pressed={browseMode === 'type'} onClick={() => { changeMode('type') }}>按扩展类型</button>
          </div>
        </header>

        <div className={styles.filters} aria-label={browseMode === 'use' ? '用途分类' : '扩展类型分类'}>
          {filters.map(item => (
            <button
              type="button"
              key={item.id}
              aria-pressed={filter === item.id}
              onClick={() => { setFilter(item.id) }}
            >{item.label}</button>
          ))}
        </div>
        {browseMode === 'type' && selectedFilter?.description !== undefined && (
          <p className={styles.filterHelp}>{selectedFilter.description}</p>
        )}

        <div className={styles.grid}>
          {visibleTemplates.map(template => {
            const open = expanded === template.id
            return (
              <article className={`${styles.template} ${open ? styles.templateOpen : ''}`} data-testid="creator-template" key={template.id}>
                <div className={styles.templateHead}>
                  <div>
                    <div className={styles.badges}>
                      <span>{template.difficulty}</span>
                      <span>{template.duration}</span>
                      {template.extensionTypes.map(type => <span key={type}>{EXTENSION_TYPE_LABELS[type]}</span>)}
                    </div>
                    <h4>{template.title}</h4>
                    <p>{template.benefit}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.detailButton}
                    aria-expanded={open}
                    aria-label={`${open ? '收起' : '查看'}“${template.title}”详情`}
                    onClick={() => { setExpanded(open ? null : template.id) }}
                  >{open ? '收起' : '查看详情'}</button>
                </div>
                {open && (
                  <TemplateDetails
                    template={template}
                    disabled={busy}
                    onCopy={(prompt) => { void copyOnly(prompt) }}
                    onCreate={(prompt) => { void copyAndCreate(prompt) }}
                  />
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className={styles.learn}>
        <div><strong>该做 Skill 还是插件？</strong><p>说明书用 Skill；专用助手用 Agent 预设；固定步骤用工作流；必须写代码时才用插件。</p></div>
        <div><strong>创造模式会怎么做？</strong><p>先检查，再给计划；经你确认后写入用户目录，测试后报告启用和撤销方法。</p></div>
        <div><strong>去哪里看源码和例子？</strong><p><a href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noreferrer">官方 Harness GitHub</a> · <a href="https://github.com/zhu1090093659/dsh-web-ui" target="_blank" rel="noreferrer">社区 UI 示例</a></p></div>
      </section>

      {advisorRequested && launch.error !== null && (
        <div className={styles.fallback} role="alert">
          <div><strong>AI 顾问预设暂时不可用</strong><p>{launch.error}</p></div>
          <button type="button" disabled={busy} onClick={() => { void fallbackAdvisor() }}>复制顾问提问模板并打开创造模式</button>
        </div>
      )}
      {copyError !== null && <p className={styles.error} role="alert">{copyError}</p>}
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </main>
  )
}
