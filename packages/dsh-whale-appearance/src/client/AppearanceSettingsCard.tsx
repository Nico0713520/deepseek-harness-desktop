import { useState, useSyncExternalStore } from 'react'
import type { PetKind, PetScale, WhaleAppearanceSettings } from '../types.ts'
import type { AppearanceController } from './appearance-controller.ts'
import styles from './settings-card.module.css'

export interface AppearanceSettingsCardProps {
  controller: AppearanceController
}

const PETS: Array<{ id: PetKind; label: string }> = [
  { id: 'off', label: '关闭' },
  { id: 'whale-maid', label: '鲸鱼女仆' },
  { id: 'abstract-whale', label: '抽象鲸鱼' },
]
const SCALES: PetScale[] = [0.8, 1, 1.2]

export function AppearanceSettingsCard({ controller }: AppearanceSettingsCardProps) {
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (patch: Partial<WhaleAppearanceSettings>): void => {
    setBusy(true)
    setError(null)
    void controller.patch(patch).catch(() => {
      setError('保存失败，已保留当前外观。')
    }).finally(() => { setBusy(false) })
  }

  return (
    <li className={styles.card} data-whale-settings-card>
      <header className={styles.header}>
        <span className={styles.icon} aria-hidden="true">🐋</span>
        <span>
          <strong className={styles.title}>主题与桌宠</strong>
          <span className={styles.description}>只装饰聊天画布，官方侧栏和输入框保持不变。</span>
        </span>
      </header>

      <section className={styles.section}>
        <div>
          <strong>鲸鱼主题</strong>
          <p>{snapshot.themeEnabled ? '鲸鱼画布' : '官方外观'}</p>
        </div>
        <button
          type="button"
          className={`${styles.switch} ${snapshot.themeEnabled ? styles.switchOn : ''}`}
          aria-label={snapshot.themeEnabled ? '恢复官方外观' : '使用鲸鱼画布'}
          aria-pressed={snapshot.themeEnabled}
          disabled={busy}
          onClick={() => { update({ themeEnabled: !snapshot.themeEnabled }) }}
        >
          <span />
        </button>
      </section>

      <section className={styles.block}>
        <strong>桌宠</strong>
        <div className={styles.segmented}>
          {PETS.map(pet => (
            <button
              type="button"
              key={pet.id}
              aria-pressed={snapshot.pet === pet.id}
              className={snapshot.pet === pet.id ? styles.selected : ''}
              disabled={busy}
              onClick={() => { update({ pet: pet.id }) }}
            >{pet.label}</button>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <strong>桌宠大小</strong>
        <div className={styles.segmented}>
          {SCALES.map(scale => (
            <button
              type="button"
              key={scale}
              aria-pressed={snapshot.petScale === scale}
              className={snapshot.petScale === scale ? styles.selected : ''}
              disabled={busy}
              onClick={() => { update({ petScale: scale }) }}
            >{Math.round(scale * 100)}%</button>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <button type="button" disabled={busy} onClick={() => { update({ petPosition: { right: 24, bottom: 24 } }) }}>
          重置桌宠位置
        </button>
        <button
          type="button"
          className={styles.restore}
          disabled={busy}
          onClick={() => { update({ themeEnabled: false, pet: 'off', petScale: 1, petPosition: { right: 24, bottom: 24 } }) }}
        >恢复官方外观</button>
      </footer>
      {error !== null && <p className={styles.error} role="alert">{error}</p>}
    </li>
  )
}
