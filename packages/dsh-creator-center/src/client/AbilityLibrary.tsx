import { useEffect, useRef, type CSSProperties } from 'react'
import {
  ABILITY_KINDS,
  ABILITY_KIND_LABELS,
  DEVELOPER_DIRECTIONS,
  DEVELOPER_DIRECTION_LABELS,
  EXTENSION_TYPE_LABELS,
  githubStarLabel,
  INDUSTRIES,
  INDUSTRY_LABELS,
  type AbilityDefinition,
  type AbilityKindId,
  type DeveloperDirectionId,
  type IndustryId,
} from './catalog.ts'
import { AbilityDetail } from './AbilityDetail.tsx'
import {
  PROJECT_LOGO_CELL_SIZE,
  PROJECT_LOGO_COLUMNS,
  PROJECT_LOGO_INDEX,
  PROJECT_LOGO_ROWS,
  PROJECT_LOGO_SPRITE,
} from './project-logos.ts'
import styles from './creator-center.module.css'

export interface AbilityLibraryProps {
  readonly abilities: readonly AbilityDefinition[]
  readonly allAbilities: readonly AbilityDefinition[]
  readonly industry: IndustryId | 'all'
  readonly kind: AbilityKindId | 'all'
  readonly developerDirection: DeveloperDirectionId | 'all'
  readonly selectedId: string | null
  readonly creatorDisabled: boolean
  readonly onIndustryChange: (industry: IndustryId | 'all') => void
  readonly onKindChange: (kind: AbilityKindId | 'all') => void
  readonly onDeveloperDirectionChange: (direction: DeveloperDirectionId | 'all') => void
  readonly onSelect: (abilityId: string | null) => void
  readonly onClear: () => void
  readonly onCreate: (prompt: string) => void
  readonly onAskAdvisor: () => void
}

function projectMonogram(title: string): string {
  const projectName = title.split('/').at(-1)?.trim() ?? title.trim()
  const firstVisible = [...projectName][0] ?? [...title.trim()][0] ?? '·'
  return firstVisible.toLocaleUpperCase()
}

function repositoryOwner(repositoryUrl: string): string | undefined {
  return /^https:\/\/github\.com\/([^/]+)/i.exec(repositoryUrl)?.[1]?.toLowerCase()
}

function localProjectLogo(owner: string | undefined): CSSProperties | undefined {
  if (owner === undefined) return undefined
  const index = PROJECT_LOGO_INDEX[owner]
  if (index === undefined) return undefined
  const column = index % PROJECT_LOGO_COLUMNS
  const row = Math.floor(index / PROJECT_LOGO_COLUMNS)
  return {
    backgroundImage: `url("${PROJECT_LOGO_SPRITE}")`,
    backgroundPosition: `${-column * PROJECT_LOGO_CELL_SIZE}px ${-row * PROJECT_LOGO_CELL_SIZE}px`,
    backgroundSize: `${PROJECT_LOGO_COLUMNS * PROJECT_LOGO_CELL_SIZE}px ${PROJECT_LOGO_ROWS * PROJECT_LOGO_CELL_SIZE}px`,
  }
}

export function AbilityLibrary({
  abilities,
  allAbilities,
  industry,
  kind,
  developerDirection,
  selectedId,
  creatorDisabled,
  onIndustryChange,
  onKindChange,
  onDeveloperDirectionChange,
  onSelect,
  onClear,
  onCreate,
  onAskAdvisor,
}: AbilityLibraryProps) {
  const selected = allAbilities.find(item => item.id === selectedId)
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selected === undefined) return
    const frame = window.requestAnimationFrame(() => {
      const target = detailRef.current
      if (target !== null && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
      target?.querySelector<HTMLElement>('h3')?.focus()
    })
    return () => { window.cancelAnimationFrame(frame) }
  }, [selected])

  useEffect(() => {
    if (selected === undefined) return
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onSelect(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [onSelect, selected])

  return (
    <section
      className={`${styles.library} ${selected === undefined ? '' : styles.libraryDetailMode}`}
      aria-label="能力 Hub"
      data-layout={selected === undefined ? 'list' : 'detail'}
    >
      {selected !== undefined ? (
        <div ref={detailRef} className={styles.detailPage}>
          <AbilityDetail
            ability={selected}
            disabled={creatorDisabled}
            onBack={() => { onSelect(null) }}
            onCreate={onCreate}
            onAskAdvisor={onAskAdvisor}
          />
        </div>
      ) : (
        <>
          <header className={styles.libraryHeader}>
            <div>
              <h2>能力库</h2>
            </div>
          </header>
          <div className={styles.filterRows}>
            <div className={styles.filterRow} role="group" aria-label="行业分类">
              <div>
                {INDUSTRIES.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={industry === item.id}
                    onClick={() => { onIndustryChange(item.id) }}
                  >{item.label}</button>
                ))}
              </div>
            </div>
            {industry === 'programmer' ? (
              <div className={styles.filterRow} role="group" aria-label="开发方向">
                <div>
                  {DEVELOPER_DIRECTIONS.map(item => (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={developerDirection === item.id}
                      title={item.description}
                      onClick={() => { onDeveloperDirectionChange(item.id) }}
                    >{item.label}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.filterRow} role="group" aria-label="能力种类">
                <div>
                  {ABILITY_KINDS.map(item => (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={kind === item.id}
                      onClick={() => { onKindChange(item.id) }}
                    >{item.label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {abilities.length === 0 ? (
            <div className={styles.emptyState}>
              <span aria-hidden="true">⌁</span>
              <h3>没有找到完全匹配的能力</h3>
              <p>换个说法，或者先清除行业和筛选条件。</p>
              <div>
                <button type="button" className={styles.secondaryButton} onClick={onClear}>清除筛选</button>
                <button type="button" className={styles.textButton} onClick={onAskAdvisor}>让 AI 帮我定制</button>
              </div>
            </div>
          ) : (
            <div className={styles.abilityGrid} data-testid="ability-grid">
              {abilities.map(ability => {
            const cardIndustry = industry !== 'all' && ability.industryIds.includes(industry)
              ? industry
              : ability.industryIds[0]
            const primaryDirection = ability.developerDirectionIds[0]
            const isPiExtension = ability.ecosystem === 'pi'
            const logoOwner = repositoryOwner(ability.implementation.repositoryUrl)
            const logoStyle = localProjectLogo(logoOwner)
            const openAbility = (): void => {
              onSelect(selectedId === ability.id ? null : ability.id)
            }
            return (
              <article
                className={`${styles.abilityCard} ${selectedId === ability.id ? styles.abilityCardSelected : ''}`}
                data-testid="ability-card"
                key={ability.id}
                tabIndex={0}
                aria-label={`打开“${ability.title}”详情`}
                onClick={openAbility}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openAbility()
                  }
                }}
              >
              <div className={styles.cardTopline}>
                <div
                  className={styles.cardMarker}
                  aria-hidden="true"
                  data-project-logo-owner={logoOwner}
                  data-ecosystem={ability.ecosystem}
                  data-has-logo={logoStyle === undefined ? undefined : 'true'}
                  style={logoStyle}
                >
                  <span>{projectMonogram(ability.title)}</span>
                </div>
                <div className={styles.cardBadges}>
                  <span className={styles.cardStars} title={ability.popularity ?? 'GitHub Star 未同步'}>{githubStarLabel(ability.popularity)}</span>
                  <span>{EXTENSION_TYPE_LABELS[ability.implementation.extensionTypes[0]!]}</span>
                </div>
              </div>
              <h3>{ability.title}</h3>
              <p className={styles.cardOutcome}>{ability.outcome}</p>
              <p className={styles.cardSummary}>{ability.summary}</p>
              <div className={styles.cardSourceLine}>
                <span>{isPiExtension ? 'Pi 热门扩展' : (primaryDirection === undefined ? '通用能力' : DEVELOPER_DIRECTION_LABELS[primaryDirection])}</span>
                <span>{isPiExtension ? '高阶定制参考' : 'GitHub 项目'}</span>
              </div>
              <footer className={styles.cardFooter}>
                <div className={styles.cardTags}>
                  <span>{ABILITY_KIND_LABELS[ability.kindIds[0]!]}</span>
                  {cardIndustry !== undefined && industry === 'all' && <span>{INDUSTRY_LABELS[cardIndustry]}</span>}
                </div>
                <button
                  type="button"
                  aria-expanded={selectedId === ability.id}
                  aria-label={`查看“${ability.title}”方案`}
                  onClick={event => { event.stopPropagation(); openAbility() }}
                >查看方案 <span aria-hidden="true">→</span></button>
              </footer>
              </article>
              )})}
            </div>
          )}
        </>
      )}
    </section>
  )
}
