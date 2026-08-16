import {
  ABILITY_KINDS,
  ABILITY_KIND_LABELS,
  INDUSTRIES,
  INDUSTRY_LABELS,
  type AbilityDefinition,
  type AbilityKindId,
  type IndustryId,
} from './catalog.ts'
import { AbilityDetail } from './AbilityDetail.tsx'
import styles from './creator-center.module.css'

export interface AbilityLibraryProps {
  readonly abilities: readonly AbilityDefinition[]
  readonly industry: IndustryId | 'all'
  readonly kind: AbilityKindId | 'all'
  readonly selectedId: string | null
  readonly creatorDisabled: boolean
  readonly onIndustryChange: (industry: IndustryId | 'all') => void
  readonly onKindChange: (kind: AbilityKindId | 'all') => void
  readonly onSelect: (abilityId: string | null) => void
  readonly onClear: () => void
  readonly onCreate: (prompt: string) => void
  readonly onAskAdvisor: () => void
}

export function AbilityLibrary({
  abilities,
  industry,
  kind,
  selectedId,
  creatorDisabled,
  onIndustryChange,
  onKindChange,
  onSelect,
  onClear,
  onCreate,
  onAskAdvisor,
}: AbilityLibraryProps) {
  const selected = abilities.find(item => item.id === selectedId)

  return (
    <section className={styles.library} aria-labelledby="creator-library-title">
      <header className={styles.libraryHeader}>
        <div>
          <span className={styles.sectionKicker}>按你的工作来找</span>
          <h2 id="creator-library-title">能力库</h2>
        </div>
        <span className={styles.resultCount}>找到 {abilities.length} 个能力</span>
      </header>

      <div className={styles.filterRows}>
        <div className={styles.filterRow} role="group" aria-label="行业分类">
          <span className={styles.filterLabel}>行业</span>
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
        <div className={styles.filterRow} role="group" aria-label="能力种类">
          <span className={styles.filterLabel}>种类</span>
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
      </div>

      {abilities.length === 0 ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">⌁</span>
          <h3>没有找到完全匹配的能力</h3>
          <p>换个说法，或者先清除行业和种类条件。</p>
          <div>
            <button type="button" className={styles.secondaryButton} onClick={onClear}>清除筛选</button>
            <button type="button" className={styles.textButton} onClick={onAskAdvisor}>让 AI 帮我定制</button>
          </div>
        </div>
      ) : (
        <div className={styles.abilityGrid}>
          {abilities.map(ability => {
            const cardIndustry = industry !== 'all' && ability.industryIds.includes(industry)
              ? industry
              : ability.industryIds[0]
            return (
              <article
              className={`${styles.abilityCard} ${selectedId === ability.id ? styles.abilityCardSelected : ''}`}
              data-testid="ability-card"
              key={ability.id}
            >
              <div className={styles.cardMarker} aria-hidden="true">{ability.title.slice(0, 1)}</div>
              <h3>{ability.title}</h3>
              <p className={styles.cardOutcome}>{ability.outcome}</p>
              <dl className={styles.cardFacts}>
                <div><dt>你提供</dt><dd>{ability.userProvides}</dd></div>
                <div><dt>你得到</dt><dd>{ability.userReceives}</dd></div>
              </dl>
              <footer className={styles.cardFooter}>
                <div className={styles.cardTags}>
                  <span>{cardIndustry === undefined ? '通用' : INDUSTRY_LABELS[cardIndustry]}</span>
                  <span>{ABILITY_KIND_LABELS[ability.kindIds[0]!]}</span>
                </div>
                <button
                  type="button"
                  aria-expanded={selectedId === ability.id}
                  aria-label={`查看“${ability.title}”方案`}
                  onClick={() => { onSelect(selectedId === ability.id ? null : ability.id) }}
                >查看方案 <span aria-hidden="true">→</span></button>
              </footer>
              </article>
            )
          })}
        </div>
      )}

      {selected !== undefined && (
        <AbilityDetail
          ability={selected}
          disabled={creatorDisabled}
          onClose={() => { onSelect(null) }}
          onCreate={onCreate}
          onAskAdvisor={onAskAdvisor}
        />
      )}
    </section>
  )
}
