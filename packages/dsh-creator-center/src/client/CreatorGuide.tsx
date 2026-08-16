import styles from './creator-center.module.css'

export interface CreatorGuideProps {
  readonly view: 'guide' | 'principles'
  readonly onDiscover: () => void
  readonly onAskAdvisor: () => void
}

export function CreatorGuide({ view, onDiscover, onAskAdvisor }: CreatorGuideProps) {
  if (view === 'principles') {
    return (
      <section className={styles.guidePage}>
        <header className={styles.guideHero}>
          <span className={styles.sectionKicker}>想看懂原理时再来这里</span>
          <h2>DeepSeek Harness 的扩展不只有插件</h2>
          <p>先看你想得到什么，再决定实现方式。大多数个人需求不需要修改官方代码。</p>
        </header>
        <div className={styles.principleGrid}>
          <article><span>01</span><h3>可重复的方法</h3><p>把稳定做法写成说明，让 DeepSeek 每次按同一标准完成。</p><small>对应：Skill</small></article>
          <article><span>02</span><h3>专门负责一类事</h3><p>把角色、可用工具和方法组合成一个专用助手。</p><small>对应：Agent 预设</small></article>
          <article><span>03</span><h3>按固定步骤自动跑</h3><p>适合定时检查、批量处理和有条件分支的重复流程。</p><small>对应：工作流</small></article>
          <article><span>04</span><h3>接入新的工具或界面</h3><p>只有需要新服务、底层能力或 UI 时，才考虑写插件。</p><small>对应：插件 / 界面扩展</small></article>
        </div>
        <div className={styles.guideActions}>
          <button type="button" className={styles.primaryButton} onClick={onDiscover}>回到能力库</button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.guidePage}>
      <header className={styles.guideHero}>
        <span className={styles.sectionKicker}>不要求懂代码</span>
        <h2>第一次创建能力，只要记住三步</h2>
        <p>你只负责讲清楚需求和确认方案，DeepSeek 负责检查环境、列计划和验证结果。</p>
      </header>
      <ol className={styles.guideSteps}>
        <li><b>1</b><div><h3>说清楚问题</h3><p>描述“现在怎么做、哪里麻烦、希望最后得到什么”，不用先猜该装什么。</p></div></li>
        <li><b>2</b><div><h3>先看它准备怎么改</h3><p>确认会读取什么、修改什么、需要什么权限，以及不想用时怎么撤销。</p></div></li>
        <li><b>3</b><div><h3>用真实例子验收</h3><p>先跑通一个真实任务，再决定是否长期启用；失败时保留原版本。</p></div></li>
      </ol>
      <aside className={styles.helpCard}>
        <div><span>还是不知道怎么描述？</span><strong>让 AI 一次只问一个关键问题</strong><p>最多问三个问题，再给你一个主方案和两个以内的备选。</p></div>
        <button type="button" className={styles.primaryButton} onClick={onAskAdvisor}>让 AI 帮我定制</button>
      </aside>
      <footer className={styles.guideLinks}>
        <span>继续学习</span>
        <a href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noreferrer">官方 Harness GitHub ↗</a>
        <a href="https://github.com/zhu1090093659/dsh-web-ui" target="_blank" rel="noreferrer">社区 UI 示例 ↗</a>
      </footer>
    </section>
  )
}
