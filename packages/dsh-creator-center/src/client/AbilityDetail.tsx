import {
  EXTENSION_TYPE_LABELS,
  type AbilityDefinition,
} from './catalog.ts'
import { buildCreationPrompt } from './prompt.ts'
import styles from './creator-center.module.css'

export interface AbilityDetailProps {
  readonly ability: AbilityDefinition
  readonly disabled: boolean
  readonly onBack: () => void
  readonly onCreate: (prompt: string) => void
  readonly onAskAdvisor: () => void
}

export function AbilityDetail({ ability, disabled, onBack, onCreate, onAskAdvisor }: AbilityDetailProps) {
  const prompt = buildCreationPrompt({ goal: ability.implementation.goal, template: ability })
  const isPiExtension = ability.ecosystem === 'pi'

  return (
    <section className={styles.abilityDetail} role="region" aria-label={`${ability.title}详情`}>
      <button type="button" className={styles.backButton} aria-label="返回能力库" onClick={onBack}>← 返回能力库</button>
      <header className={styles.detailHeader}>
        <div>
          <h3 tabIndex={-1}>{ability.title}</h3>
          <p>{ability.summary}</p>
        </div>
      </header>

      <div className={styles.detailMeta} aria-label="来源与兼容信息">
        <span>{isPiExtension ? 'Pi 热门扩展' : 'GitHub 项目'}</span>
        {isPiExtension && <span>面向高阶开发者</span>}
      </div>

      {ability.compatibility === 'manual-adapter' && (
        <p className={styles.compatibilityNotice}>
          {isPiExtension
            ? '这些是 Pi 生态中使用量靠前的热门扩展，供高阶开发者选择和借鉴。它们不能直接安装到 DeepSeek Harness，但可以用 Harness 自己的 Skill、MCP、Preset 或插件机制，定制适合自己的等价扩展。'
            : '这是其他 Agent 生态的参考项目，不能直接安装到 DeepSeek Harness。下面的添加方法会教你用 Harness 自己的 Skill、MCP、Preset 或插件机制实现等价能力。'}
        </p>
      )}

      <div className={styles.detailIntro}>
        <span>项目简介</span>
        <p>{ability.outcome} {ability.summary}</p>
      </div>

      <div className={styles.repositoryCard}>
        <div>
          <span className={styles.repositoryLabel}>GitHub 开源项目</span>
          <a
            className={styles.repositoryUrl}
            href={ability.implementation.repositoryUrl}
            target="_blank"
            rel="noreferrer"
          >
            {ability.implementation.repositoryUrl}
          </a>
        </div>
        <a
          className={styles.repositoryButton}
          href={ability.implementation.repositoryUrl}
          target="_blank"
          rel="noreferrer"
        >
          打开仓库 ↗
        </a>
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
          <label className={styles.promptLabel}>
            安全创建说明
            <textarea readOnly value={prompt} rows={8} />
          </label>
        </div>
      </details>
    </section>
  )
}
