import { VIBE_CODING_GROUPS } from './catalog.ts'
import styles from './creator-center.module.css'

export interface VibeCodingColumnProps {
  readonly onStart: (abilityId: string | undefined, starter: string) => void
}

export function VibeCodingColumn({ onStart }: VibeCodingColumnProps) {
  return (
    <section className={styles.vibePage}>
      <header className={styles.vibeHero}>
        <div>
          <span className={styles.vibeKicker}>VIBE CODING · 从想法出发</span>
          <h2>说出想法，让 DeepSeek 和你一起做出来</h2>
          <p>不用先决定技术栈。先说清楚谁要用、解决什么问题、完成后是什么样。</p>
        </div>
        <button type="button" className={styles.vibeButton} onClick={() => { onStart('mattpocock-skills', VIBE_CODING_GROUPS[0]!.starter) }}>
          描述我想做的东西 <span aria-hidden="true">↗</span>
        </button>
      </header>

      <ol className={styles.deliveryRail} aria-label="Vibe Coding 交付步骤">
        <li><b>01</b><span>先做可运行第一版</span></li>
        <li><b>02</b><span>用户确认</span></li>
        <li><b>03</b><span>继续完善</span></li>
      </ol>

      <header className={styles.collectionHeader}>
        <div><span className={styles.sectionKicker}>从常见任务开始</span><h3>六种最容易说清楚的起点</h3></div>
        <p>每次只推进一个能验证的阶段。</p>
      </header>

      <div className={styles.vibeGrid}>
        {VIBE_CODING_GROUPS.map((group, index) => (
          <article className={styles.vibeCard} data-testid="vibe-group" key={group.id}>
            <span className={styles.vibeIndex}>{String(index + 1).padStart(2, '0')}</span>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <dl>
              <div><dt>你可以这样说</dt><dd>{group.starter}</dd></div>
              <div><dt>第一步做到</dt><dd>{group.milestone}</dd></div>
            </dl>
            <details className={styles.vibeDetails}>
              <summary>会怎么推进</summary>
              <p><b>需要访问</b>{group.access}</p>
              <p><b>确认节点</b>{group.confirmation}</p>
              <p><b>怎么验收</b>{group.verify}</p>
            </details>
            <button type="button" onClick={() => { onStart(group.abilityId, group.starter) }}>
              从这个方向开始 <span aria-hidden="true">→</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
