import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {
  ABILITIES,
  FEATURED_SCENES,
  abilitiesFor,
  recommendAbilities,
  type AbilityKindId,
  type IndustryId,
} from './catalog.ts'
import { AbilityLibrary } from './AbilityLibrary.tsx'
import { CreatorGuide } from './CreatorGuide.tsx'
import { VibeCodingColumn } from './VibeCodingColumn.tsx'
import { ADVISOR_FALLBACK_PROMPT } from './prompt.ts'
import type { LaunchSnapshot } from './session-launcher.ts'
import styles from './creator-center.module.css'

const ADVISOR_PRESET_ID = 'whale-extension-advisor'
type CreatorView = 'discover' | 'vibe' | 'guide' | 'principles'

export interface CreatorLauncher {
  getSnapshot(): LaunchSnapshot
  subscribe(listener: () => void): () => void
  launch(presetId: string): void
  clearError(): void
  isPresetAvailable(presetId: string): Promise<boolean>
}

export interface ClipboardPort {
  writeText(text: string): Promise<void>
}

export interface CreatorCenterProps {
  readonly launcher: CreatorLauncher
  readonly onClose?: () => void
  readonly clipboard?: ClipboardPort
}

const NAV_ITEMS: readonly { id: CreatorView; label: string }[] = [
  { id: 'discover', label: '找能力' },
  { id: 'vibe', label: 'Vibe Coding' },
  { id: 'guide', label: '创建指南' },
  { id: 'principles', label: '扩展原理' },
]

export function CreatorCenter({ launcher, onClose, clipboard = navigator.clipboard }: CreatorCenterProps) {
  const pageRef = useRef<HTMLElement>(null)
  const launch = useSyncExternalStore(launcher.subscribe, launcher.getSnapshot)
  const [view, setView] = useState<CreatorView>('discover')
  const [industry, setIndustry] = useState<IndustryId | 'all'>('all')
  const [kind, setKind] = useState<AbilityKindId | 'all'>('all')
  const [query, setQuery] = useState('')
  const [problem, setProblem] = useState('')
  const [recommendationIds, setRecommendationIds] = useState<readonly string[] | null>(null)
  const [recommendationLabel, setRecommendationLabel] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [advisorRequested, setAdvisorRequested] = useState(false)
  const [closeOnLaunch, setCloseOnLaunch] = useState(false)
  const [creatorAvailable, setCreatorAvailable] = useState<boolean | null>(null)

  const busy = launch.busy
  const creatorDisabled = busy || creatorAvailable === false
  const visibleAbilities = useMemo(() => {
    if (recommendationIds !== null) {
      return recommendationIds
        .map(id => ABILITIES.find(item => item.id === id))
        .filter((item): item is (typeof ABILITIES)[number] => item !== undefined)
    }
    return abilitiesFor({ industry, kind, query })
  }, [industry, kind, query, recommendationIds])

  useEffect(() => {
    let active = true
    void launcher.isPresetAvailable('cordis').then(
      available => { if (active) setCreatorAvailable(available) },
      () => { if (active) setCreatorAvailable(false) },
    )
    return () => { active = false }
  }, [launcher])

  useEffect(() => {
    if (closeOnLaunch && launch.launchedPreset !== null) onClose?.()
  }, [closeOnLaunch, launch.launchedPreset, onClose])

  useEffect(() => {
    if (closeOnLaunch && !advisorRequested && launch.error !== null) {
      setStatus('创建说明已准备好，但创造会话未能启动。')
    }
  }, [advisorRequested, closeOnLaunch, launch.error])

  useEffect(() => {
    const page = pageRef.current
    if (page !== null && typeof page.scrollIntoView === 'function') {
      page.scrollIntoView({ block: 'start' })
    }
  }, [view])

  const switchView = (next: CreatorView): void => {
    setView(next)
    setValidationError(null)
  }

  const resetDiscovery = (): void => {
    setIndustry('all')
    setKind('all')
    setQuery('')
    setRecommendationIds(null)
    setRecommendationLabel(null)
    setSelectedId(null)
  }

  const updateIndustry = (next: IndustryId | 'all'): void => {
    setIndustry(next)
    setRecommendationIds(null)
    setRecommendationLabel(null)
    setSelectedId(null)
  }

  const updateKind = (next: AbilityKindId | 'all'): void => {
    setKind(next)
    setRecommendationIds(null)
    setRecommendationLabel(null)
    setSelectedId(null)
  }

  const updateQuery = (value: string): void => {
    setQuery(value)
    setRecommendationIds(null)
    setRecommendationLabel(null)
    setSelectedId(null)
    setView('discover')
  }

  const findForProblem = (): void => {
    if (problem.trim().length === 0) {
      setValidationError('先简单说说你想解决的问题。')
      return
    }
    const matches = recommendAbilities(problem)
    setValidationError(null)
    setIndustry('all')
    setKind('all')
    setQuery('')
    setRecommendationIds(matches.map(item => item.id))
    setRecommendationLabel(`为你推荐 ${matches.length} 个接近的能力`)
    setSelectedId(null)
    setStatus('推荐来自本地能力库；你可以先查看方案，再决定是否创建。')
  }

  const showScene = (scene: (typeof FEATURED_SCENES)[number]): void => {
    setIndustry('all')
    setKind('all')
    setQuery('')
    setRecommendationIds(scene.abilityIds)
    setRecommendationLabel(`精选场景 · ${scene.title}`)
    setSelectedId(null)
  }

  const copyOnly = async (prompt: string): Promise<boolean> => {
    setCopyError(null)
    try {
      await clipboard.writeText(prompt)
      setStatus('创建说明已准备好。')
      return true
    } catch {
      setCopyError('复制失败。创建说明仍在高级信息中，请手动选择复制。')
      return false
    }
  }

  const copyAndCreate = async (prompt: string, presetId = 'cordis'): Promise<void> => {
    if (!await copyOnly(prompt)) return
    launcher.clearError()
    setAdvisorRequested(false)
    setCloseOnLaunch(true)
    launcher.launch(presetId)
    setStatus('创建说明已准备好；进入创造会话后请粘贴并发送。')
  }

  const askAdvisor = (): void => {
    setAdvisorRequested(true)
    setCopyError(null)
    launcher.clearError()
    setCloseOnLaunch(true)
    launcher.launch(ADVISOR_PRESET_ID)
    setStatus('正在打开 AI 顾问；进入对话后直接说你想解决的问题。')
  }

  const fallbackAdvisor = async (): Promise<void> => {
    setAdvisorRequested(false)
    await copyAndCreate(ADVISOR_FALLBACK_PROMPT)
  }

  const retryCreator = (): void => {
    setAdvisorRequested(false)
    launcher.clearError()
    setCloseOnLaunch(true)
    launcher.launch('cordis')
    setStatus('正在重新打开创造模式…')
  }

  const startVibe = (abilityId: string | undefined, starter: string): void => {
    setView('discover')
    resetDiscovery()
    if (abilityId === undefined) {
      setProblem(starter)
      return
    }
    setSelectedId(abilityId)
  }

  return (
    <main className={styles.page} ref={pageRef}>
      <header className={styles.topbar}>
        <div className={styles.topbarStart}>
          {onClose !== undefined && (
            <button type="button" className={styles.backButton} onClick={onClose}>← 返回聊天</button>
          )}
          <nav className={styles.nav} aria-label="创造中心导航">
            {NAV_ITEMS.map(item => (
              <button
                type="button"
                key={item.id}
                aria-current={view === item.id ? 'page' : undefined}
                onClick={() => { switchView(item.id) }}
              >{item.label}</button>
            ))}
          </nav>
        </div>
        <label className={styles.search}>
          <span aria-hidden="true">⌕</span>
          <span className={styles.srOnly}>搜索能力</span>
          <input
            type="search"
            value={query}
            placeholder="搜索你想增加的能力"
            aria-label="搜索能力"
            onChange={(event) => { updateQuery(event.currentTarget.value) }}
          />
        </label>
      </header>

      {view === 'discover' && (
        <>
          <section className={styles.discoveryHero}>
            <div className={styles.problemCard}>
              <span className={styles.sectionKicker}>从你的问题开始</span>
              <h2>你希望 DeepSeek 帮你解决什么问题？</h2>
              <p>不用知道实现方式，像平时聊天一样描述就可以。</p>
              <label className={styles.problemInput}>
                <span className={styles.srOnly}>描述你想解决的问题</span>
                <textarea
                  value={problem}
                  rows={4}
                  aria-label="描述你想解决的问题"
                  placeholder="例如：每天把客户反馈分成产品、物流和售后三类"
                  onChange={(event) => { setProblem(event.currentTarget.value) }}
                />
              </label>
              <div className={styles.exampleRow} aria-label="问题示例">
                {['整理每周工作', '分析一份表格', '做一个小工具'].map(example => (
                  <button type="button" key={example} onClick={() => { setProblem(example) }}>{example}</button>
                ))}
              </div>
              <div className={styles.problemActions}>
                <button type="button" className={styles.primaryButton} onClick={findForProblem}>帮我找适合的能力</button>
                <button type="button" className={styles.textButton} disabled={busy} onClick={askAdvisor}>让 AI 帮我定制</button>
              </div>
              {validationError !== null && <p className={styles.error} role="alert">{validationError}</p>}
              <ol className={styles.capabilityRail} aria-label="创建能力流程">
                <li><i />说问题</li><li><i />看方案</li><li><i />开始创建</li>
              </ol>
            </div>

            <div className={styles.featured}>
              <header><div><span className={styles.sectionKicker}>不用从空白开始</span><h2>精选场景</h2></div><span>选择一个接近的方向</span></header>
              <div className={styles.sceneStrip}>
                {FEATURED_SCENES.map((scene, index) => (
                  <article className={styles.sceneCard} data-scene={index + 1} data-testid="featured-scene" key={scene.id}>
                    <div className={styles.sceneGraphic} aria-hidden="true"><i /><i /><i /></div>
                    <span>场景 {String(index + 1).padStart(2, '0')}</span>
                    <h3>{scene.title}</h3>
                    <p>{scene.description}</p>
                    <button type="button" aria-label={`查看“${scene.title}”场景`} onClick={() => { showScene(scene) }}>查看这个方向 <span aria-hidden="true">→</span></button>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {creatorAvailable === false && (
            <div className={styles.notice} role="alert">
              <div><strong>创造功能暂时不可用</strong><p>浏览和查看方案不受影响。请到“设置 → Agent 预设”恢复内置创造模式。</p></div>
            </div>
          )}

          <AbilityLibrary
            abilities={visibleAbilities}
            industry={industry}
            kind={kind}
            selectedId={selectedId}
            recommendationLabel={recommendationLabel}
            creatorDisabled={creatorDisabled}
            onIndustryChange={updateIndustry}
            onKindChange={updateKind}
            onSelect={setSelectedId}
            onClear={resetDiscovery}
            onCreate={(prompt) => { void copyAndCreate(prompt) }}
            onAskAdvisor={askAdvisor}
          />
        </>
      )}

      {view === 'vibe' && <VibeCodingColumn onStart={startVibe} />}
      {(view === 'guide' || view === 'principles') && (
        <CreatorGuide
          view={view}
          onDiscover={() => { switchView('discover') }}
          onAskAdvisor={askAdvisor}
        />
      )}

      {advisorRequested && launch.error !== null && (
        <div className={styles.notice} role="alert">
          <div><strong>AI 顾问暂时不可用</strong><p>{launch.error}</p></div>
          <button type="button" disabled={busy} onClick={() => { void fallbackAdvisor() }}>复制顾问提问模板并打开创造模式</button>
        </div>
      )}
      {!advisorRequested && launch.error !== null && (
        <div className={styles.notice} role="alert">
          <div>
            <strong>创建说明已准备好，但创造会话未能启动</strong>
            <p>{launch.error}。你可以重试；若仍失败，请到“设置 → Agent 预设”检查内置创造模式。</p>
          </div>
          <button type="button" disabled={busy} onClick={retryCreator}>重试打开创造模式</button>
        </div>
      )}
      {copyError !== null && <p className={styles.error} role="alert">{copyError}</p>}
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </main>
  )
}
