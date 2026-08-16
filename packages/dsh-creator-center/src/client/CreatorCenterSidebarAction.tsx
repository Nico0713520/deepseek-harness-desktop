import { useSyncExternalStore } from 'react'
import type { CreatorNavigationController } from './creator-navigation.ts'
import { ExtensionCenterIcon } from './SidebarEntryIcons.tsx'
import styles from './creator-center.module.css'

export interface CreatorCenterSidebarActionProps {
  readonly wide: boolean
  readonly expandSidebar: () => void
  readonly navigation: CreatorNavigationController
}

export function CreatorCenterSidebarAction({ wide, expandSidebar, navigation }: CreatorCenterSidebarActionProps) {
  const route = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot)
  const active = route === 'creator-center'

  return (
    <button
      type="button"
      className={`${styles.sidebarEntry} ${active ? styles.sidebarEntryActive : ''}`}
      aria-label="扩展中心"
      aria-current={active ? 'page' : undefined}
      data-creator-center-entry
      onClick={() => {
        if (!wide) expandSidebar()
        navigation.open()
      }}
    >
      <span className={styles.sidebarEntryIcon} aria-hidden="true"><ExtensionCenterIcon /></span>
      {wide && <span className={styles.sidebarEntryLabel}>扩展中心</span>}
    </button>
  )
}
