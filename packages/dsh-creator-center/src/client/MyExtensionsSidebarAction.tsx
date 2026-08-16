import { useSyncExternalStore } from 'react'
import type { CreatorNavigationController } from './creator-navigation.ts'
import { MyExtensionsIcon } from './SidebarEntryIcons.tsx'
import styles from './creator-center.module.css'

export interface MyExtensionsSidebarActionProps {
  readonly wide: boolean
  readonly expandSidebar: () => void
  readonly navigation: CreatorNavigationController
}

export function MyExtensionsSidebarAction({ wide, expandSidebar, navigation }: MyExtensionsSidebarActionProps) {
  const route = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot)
  const active = route === 'my-extensions'

  return (
    <button
      type="button"
      className={`${styles.sidebarEntry} ${active ? styles.sidebarEntryActive : ''}`}
      aria-label="我的扩展"
      aria-current={active ? 'page' : undefined}
      data-my-extensions-entry
      onClick={() => {
        if (!wide) expandSidebar()
        navigation.openMyExtensions()
      }}
    >
      <span className={styles.sidebarEntryIcon} aria-hidden="true"><MyExtensionsIcon /></span>
      {wide && <span className={styles.sidebarEntryLabel}>我的扩展</span>}
    </button>
  )
}
