import { useEffect, useState, useSyncExternalStore } from 'react'
import type { CreatorLauncher } from './CreatorCenter.tsx'
import { CreatorCenter } from './CreatorCenter.tsx'
import { MyExtensions } from './MyExtensions.tsx'
import type { CreatorNavigationController } from './creator-navigation.ts'
import styles from './creator-center.module.css'

export interface CreatorCenterSurfaceProps {
  readonly navigation: CreatorNavigationController
  readonly launcher: CreatorLauncher
}

function useShellLeft(): number {
  const [left, setLeft] = useState(280)

  useEffect(() => {
    const update = (): void => {
      const frame = document.querySelector<HTMLElement>('[data-sidebar-collapsed]')
      const sidebar = frame?.firstElementChild as HTMLElement | null
      const frameRect = frame?.getBoundingClientRect()
      const sidebarRect = sidebar?.getBoundingClientRect()
      if (frameRect === undefined || sidebarRect === undefined) {
        setLeft(280)
        return
      }
      setLeft(Math.max(0, Math.round(sidebarRect.right - frameRect.left)))
    }

    update()
    const frame = document.querySelector<HTMLElement>('[data-sidebar-collapsed]')
    const observer = frame !== null && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(update)
      : undefined
    if (frame !== null) observer?.observe(frame)
    window.addEventListener('resize', update)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return left
}

export function CreatorCenterSurface({ navigation, launcher }: CreatorCenterSurfaceProps) {
  const route = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot)
  const left = useShellLeft()
  if (route !== 'creator-center' && route !== 'my-extensions') return null

  return (
    <div
      className={styles.surface}
      style={{ left }}
      data-creator-center-surface
      data-testid="creator-center-surface"
    >
      {route === 'creator-center' ? (
        <CreatorCenter launcher={launcher} onClose={() => { navigation.close() }} />
      ) : (
        <MyExtensions onClose={() => { navigation.close() }} />
      )}
    </div>
  )
}
