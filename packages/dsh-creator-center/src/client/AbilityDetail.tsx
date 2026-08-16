import {
  EXTENSION_TYPE_LABELS,
  type AbilityDefinition,
} from './catalog.ts'
import { buildCreationPrompt } from './prompt.ts'
import styles from './creator-center.module.css'

export interface AbilityDetailProps {
  readonly ability: AbilityDefinition
  readonly disabled: boolean
  readonly onClose: () => void
  readonly onCreate: (prompt: string) => void
  readonly onAskAdvisor: () => void
}

export function AbilityDetail({ ability, disabled, onClose, onCreate, onAskAdvisor }: AbilityDetailProps) {
  const prompt = buildCreationPrompt({ goal: ability.implementation.goal, template: ability })

  return (
    <section className={styles.abilityDetail} role="region" aria-label={`${ability.title}方案`}>
      <header className={styles.detailHeader}>
        <div>
          <span className={styles.sectionKicker}>能力方案</span>
          <h3>{ability.title}</h3>
          <p>{ability.summary}</p>
        </div>
        <button type="button" className={styles.iconButton} aria-label={`关闭“${ability.title}”方案`} onClick={onClose}>×</button>
      </header>

      <div className={styles.reviewGrid}>
        <div><span>它会帮你完成什么</span><p>{ability.outcome}</p></div>
        <div><span>你需要准备什么</span><p>{ability.userProvides}</p></div>
        <div><span>最后会得到什么</span><p>{ability.userReceives}</p></div>
        <div><span>它会读取或修改什么</span><p>{ability.readsOrChanges}</p></div>
        <div><span>不想用了怎么关闭</span><p>{ability.rollback}</p></div>
        <div><span>预计需要多久</span><p>{ability.estimatedTime}</p></div>
      </div>

      <div className={styles.detailActions}>
        <button type="button" className={styles.secondaryButton} onClick={onAskAdvisor}>先问 AI 是否适合我</button>
        <button type="button" className={styles.primaryButton} disabled={disabled} onClick={() => { onCreate(prompt) }}>
          让 DeepSeek 帮我创建
        </button>
      </div>

      <details className={styles.advanced}>
        <summary>高级信息</summary>
        <div className={styles.advancedBody}>
          <div className={styles.implementationLine}>
            <strong>实现方式</strong>
            <span>{ability.implementation.extensionTypes.map(type => EXTENSION_TYPE_LABELS[type]).join(' · ')}</span>
          </div>
          <div className={styles.implementationLine}>
            <strong>完成检查</strong>
            <ul>{ability.implementation.checks.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className={styles.sourceLine}>来源：{ability.implementation.source} · 许可证：{ability.implementation.license}</div>
          {ability.implementation.repositoryUrl !== undefined && (
            <a
              className={styles.repositoryLink}
              href={ability.implementation.repositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看 GitHub 仓库 ↗
            </a>
          )}
          <label className={styles.promptLabel}>
            安全创建说明
            <textarea readOnly value={prompt} rows={8} />
          </label>
        </div>
      </details>
    </section>
  )
}
