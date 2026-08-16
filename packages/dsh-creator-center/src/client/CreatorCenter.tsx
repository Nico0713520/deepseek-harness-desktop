import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  abilitiesFor,
  ABILITIES,
  type AbilityKindId,
  type DeveloperDirectionId,
  type IndustryId,
} from './catalog.ts'
import { AbilityLibrary } from './AbilityLibrary.tsx'
import { ADVISOR_FALLBACK_PROMPT } from './prompt.ts'
import type { LaunchSnapshot } from './session-launcher.ts'
import styles from './creator-center.module.css'

const ADVISOR_PRESET_ID = 'whale-extension-advisor'

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

export function CreatorCenter({ launcher, onClose, clipboard = navigator.clipboard }: CreatorCenterProps) {
  const launch = useSyncExternalStore(launcher.subscribe, launcher.getSnapshot)
  const [industry, setIndustry] = useState<IndustryId | 'all'>('all')
  const [kind, setKind] = useState<AbilityKindId | 'all'>('all')
  const [developerDirection, setDeveloperDirection] = useState<DeveloperDirectionId | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [advisorRequested, setAdvisorRequested] = useState(false)
  const [closeOnLaunch, setCloseOnLaunch] = useState(false)
  const [creatorAvailable, setCreatorAvailable] = useState<boolean | null>(null)

  const busy = launch.busy
  const creatorDisabled = busy || creatorAvailable === false
  const visibleAbilities = useMemo(
    () => abilitiesFor({ industry, kind, developerDirection, query: '' }),
    [industry, kind, developerDirection],
  )

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

  const resetDiscovery = (): void => {
    setIndustry('all')
    setKind('all')
    setDeveloperDirection('all')
    setSelectedId(null)
  }

  const updateIndustry = (next: IndustryId | 'all'): void => {
    setIndustry(next)
    setSelectedId(null)
    if (next === 'programmer') setKind('all')
    else setDeveloperDirection('all')
  }

  const updateKind = (next: AbilityKindId | 'all'): void => {
    setKind(next)
    setSelectedId(null)
  }

  const updateDeveloperDirection = (next: DeveloperDirectionId | 'all'): void => {
    setDeveloperDirection(next)
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

  return (
    <main className={styles.page}>
      {creatorAvailable === false && (
        <div className={styles.notice} role="alert">
          <div><strong>创造功能暂时不可用</strong><p>浏览和查看方案不受影响。请到“设置 → Agent 预设”恢复内置创造模式。</p></div>
        </div>
      )}

      <AbilityLibrary
        abilities={visibleAbilities}
        allAbilities={ABILITIES}
        industry={industry}
        kind={kind}
        developerDirection={developerDirection}
        selectedId={selectedId}
        creatorDisabled={creatorDisabled}
        onIndustryChange={updateIndustry}
        onKindChange={updateKind}
        onDeveloperDirectionChange={updateDeveloperDirection}
        onSelect={setSelectedId}
        onClear={resetDiscovery}
        onCreate={(prompt) => { void copyAndCreate(prompt) }}
        onAskAdvisor={askAdvisor}
      />

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
