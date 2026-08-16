import { useEffect, useMemo, useRef, useState } from 'react'
import type { UserExtensionKind, UserExtensionRecord } from '../extensions.ts'
import styles from './creator-center.module.css'

type ExtensionFetcher = typeof fetch

const EXTENSION_KIND_LABELS: Record<UserExtensionKind, string> = {
  skill: 'Skill',
  plugin: '插件',
}

const EXTENSION_KIND_HINTS: Record<UserExtensionKind, string> = {
  skill: '给 DeepSeek 增加一套可复用的工作方法。',
  plugin: '给 DeepSeek 增加一个可以调用的工具连接。',
}

export async function fetchUserExtensions(fetcher: ExtensionFetcher = globalThis.fetch): Promise<UserExtensionRecord[]> {
  const response = await fetcher('/api/whale-creator-center/user-extensions', { cache: 'no-store' })
  const body = await response.json() as { ok?: boolean; extensions?: UserExtensionRecord[]; error?: string }
  if (!response.ok || body.ok !== true || !Array.isArray(body.extensions)) {
    throw new Error(body.error ?? '无法读取本地扩展')
  }
  return body.extensions
}

async function removeUserExtension(id: string, fetcher: ExtensionFetcher): Promise<void> {
  const response = await fetcher(`/api/whale-creator-center/user-extensions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  const body = await response.json() as { ok?: boolean; error?: string }
  if (!response.ok || body.ok !== true) throw new Error(body.error ?? '删除失败')
}

function typeLabel(extension: UserExtensionRecord): string {
  return EXTENSION_KIND_LABELS[extension.kind]
}

function extensionCard(extension: UserExtensionRecord, onSelect: () => void) {
  return (
    <article
      className={styles.abilityCard}
      data-testid="user-extension-card"
      key={extension.id}
      tabIndex={0}
      aria-label={`打开“${extension.title}”详情`}
      onClick={onSelect}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      <div className={styles.cardTopline}>
        <div className={styles.cardMarker} aria-hidden="true"><span>{extension.title.slice(0, 1).toUpperCase()}</span></div>
        <div className={styles.cardBadges}>
          <span>{typeLabel(extension)}</span>
          <span className={styles.extensionLocalBadge}>本机已添加</span>
        </div>
      </div>
      <h3>{extension.title}</h3>
      <p className={styles.cardOutcome}>{EXTENSION_KIND_HINTS[extension.kind]}</p>
      <p className={styles.cardSummary}>{extension.summary}</p>
      <div className={styles.cardSourceLine}>
        <span>{extension.category}</span>
        <span>用户自己添加</span>
      </div>
      <footer className={styles.cardFooter}>
        <div className={styles.cardTags}><span>{typeLabel(extension)}</span><span>本地管理</span></div>
        <button type="button" aria-label={`查看“${extension.title}”详情`} onClick={event => { event.stopPropagation(); onSelect() }}>
          查看详情 <span aria-hidden="true">→</span>
        </button>
      </footer>
    </article>
  )
}

export interface MyExtensionsProps {
  readonly onClose: () => void
  readonly fetcher?: ExtensionFetcher
}

export function MyExtensions({ onClose, fetcher = globalThis.fetch }: MyExtensionsProps) {
  const [extensions, setExtensions] = useState<UserExtensionRecord[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [kind, setKind] = useState<UserExtensionKind | 'all'>('all')
  const [category, setCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    void fetchUserExtensions(fetcher).then(
      value => {
        if (!active) return
        setExtensions(value)
        setError(null)
      },
      reason => {
        if (!active) return
        setError(reason instanceof Error ? reason.message : '无法读取本地扩展')
      },
    ).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [fetcher])

  const categories = useMemo(() => ['all', ...new Set(extensions.map(item => item.category))], [extensions])
  const visibleExtensions = useMemo(() => {
    return extensions.filter(item => {
      if (kind !== 'all' && item.kind !== kind) return false
      if (category !== 'all' && item.category !== category) return false
      return true
    })
  }, [category, extensions, kind])
  const selected = extensions.find(item => item.id === selectedId)

  useEffect(() => {
    if (selected === undefined) return
    const frame = window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      detailRef.current?.querySelector<HTMLElement>('h3')?.focus()
    })
    return () => { window.cancelAnimationFrame(frame) }
  }, [selected])

  useEffect(() => {
    if (selected === undefined) return
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setSelectedId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [selected])

  const removeSelected = async (): Promise<void> => {
    if (selected === undefined) return
    if (!window.confirm(`确认从本机删除“${selected.title}”吗？`)) return
    try {
      await removeUserExtension(selected.id, fetcher)
      setExtensions(items => items.filter(item => item.id !== selected.id))
      setSelectedId(null)
      setStatus(selected.kind === 'plugin' ? `已从我的扩展移除 ${selected.title}；profile 依赖仍保留。` : `已删除 ${selected.title}`)
      setError(null)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '删除失败')
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.library} aria-label="我的扩展 Hub">
        {selected !== undefined ? (
          <div ref={detailRef} className={styles.detailPage}>
            <section className={styles.abilityDetail} role="region" aria-label={`${selected.title}详情`}>
              <button type="button" className={styles.backButton} aria-label="返回我的扩展" onClick={() => { setSelectedId(null) }}>← 返回我的扩展</button>
              <header className={styles.detailHeader}>
                <div>
                  <span className={styles.sectionKicker}>本机已添加 · {typeLabel(selected)}</span>
                  <h3 tabIndex={-1}>{selected.title}</h3>
                  <p>{selected.summary}</p>
                </div>
              </header>
              <div className={styles.detailMeta} aria-label="扩展信息">
                <span>{selected.category}</span>
                <span>{typeLabel(selected)}</span>
                <span>{selected.enabled ? '已启用记录' : '已标记停用'}</span>
                {selected.localTestOnly === true && <span>仅本机测试</span>}
              </div>
              <div className={styles.detailIntro}>
                <span>它能做什么</span>
                <p>{EXTENSION_KIND_HINTS[selected.kind]} 这是你自己添加的内容，不属于 DeepSeek Harness 官方内置功能。</p>
              </div>
              <div className={styles.repositoryCard}>
                <div>
                  <span className={styles.repositoryLabel}>项目地址</span>
                  <a className={styles.repositoryUrl} href={selected.repositoryUrl} target="_blank" rel="noreferrer">{selected.repositoryUrl}</a>
                </div>
                <a className={styles.repositoryButton} href={selected.repositoryUrl} target="_blank" rel="noreferrer">打开 GitHub</a>
              </div>
              <div className={styles.addMethod}>
                <span>本机安装位置</span>
                <p>{selected.localPath}</p>
                <small>{selected.kind === 'plugin'
                  ? '移除后只会隐藏这条用户扩展记录；profile 依赖会保留，避免破坏当前 Harness 运行环境。'
                  : '删除后只会移除这条用户扩展及其本地目录，不会删除官方 Harness 文件。'}</small>
              </div>
              <div className={styles.detailActions}>
                <button type="button" className={styles.secondaryButton} onClick={onClose}>返回聊天</button>
                <button type="button" className={styles.dangerButton} onClick={() => { void removeSelected() }}>
                  {selected.kind === 'plugin' ? '从我的扩展移除' : '从本机删除'}
                </button>
              </div>
            </section>
          </div>
        ) : (
          <>
            <header className={styles.libraryHeader}>
              <div>
                <h2>我的扩展</h2>
              </div>
            </header>
            <div className={styles.filterRows}>
              <div className={styles.filterRow} role="group" aria-label="扩展类型">
                <div>
                  {(['all', 'skill', 'plugin'] as const).map(item => (
                    <button type="button" key={item} aria-pressed={kind === item} onClick={() => { setKind(item) }}>
                      {item === 'all' ? '全部类型' : EXTENSION_KIND_LABELS[item]}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.filterRow} role="group" aria-label="扩展分类">
                <div>
                  {categories.map(item => (
                    <button type="button" key={item} aria-pressed={category === item} onClick={() => { setCategory(item) }}>
                      {item === 'all' ? '全部分类' : item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {loading ? (
              <div className={styles.emptyState}><span aria-hidden="true">⌁</span><h3>正在读取本机扩展</h3><p>只读取用户扩展登记册，不会扫描官方内置能力。</p></div>
            ) : error !== null ? (
              <div className={styles.emptyState} role="alert"><span aria-hidden="true">!</span><h3>暂时读不到本机扩展</h3><p>{error}</p><button type="button" className={styles.secondaryButton} onClick={() => { window.location.reload() }}>重新读取</button></div>
            ) : visibleExtensions.length === 0 ? (
              <div className={styles.emptyState}>
                <span aria-hidden="true">◈</span>
                <h3>{extensions.length === 0 ? '还没有自己添加的扩展' : '没有找到匹配的扩展'}</h3>
                <p>{extensions.length === 0 ? '从能力中心选择 Skill 或插件，按说明添加后，它们会出现在这里。' : '换个关键词，或者清除筛选条件。'}</p>
                {extensions.length > 0 && <button type="button" className={styles.secondaryButton} onClick={() => { setKind('all'); setCategory('all') }}>清除筛选</button>}
              </div>
            ) : (
              <div className={styles.abilityGrid} data-testid="user-extension-grid">
                {visibleExtensions.map(extension => extensionCard(extension, () => { setSelectedId(extension.id) }))}
              </div>
            )}
          </>
        )}
      </section>
      {status.length > 0 && <p className={styles.status} role="status" aria-live="polite">{status}</p>}
    </main>
  )
}
