import { useRef, useState, useSyncExternalStore } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { PetActivity } from '../types.ts'
import type { AppearanceController } from './appearance-controller.ts'
import styles from './pet.module.css'

export interface WhalePetProps {
  controller: AppearanceController
}

const ASSETS = {
  'whale-maid': {
    src: '/whale-appearance/assets/whale-maid.jpg',
    alt: '鲸鱼女仆桌宠',
  },
  'abstract-whale': {
    src: '/whale-appearance/assets/abstract-whale.jpg',
    alt: '抽象鲸鱼桌宠',
  },
} as const

export function activityClass(activity: PetActivity): PetActivity {
  return activity
}

function clamp(value: number, max: number): number {
  return Math.round(Math.max(0, Math.min(max, value)))
}

export function WhalePet({ controller }: WhalePetProps) {
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const [drag, setDrag] = useState<{ right: number; bottom: number } | null>(null)
  const start = useRef<{ x: number; y: number; right: number; bottom: number } | null>(null)
  if (snapshot.pet === 'off') return null

  const asset = ASSETS[snapshot.pet]
  const position = drag ?? snapshot.petPosition
  const size = Math.round(168 * snapshot.petScale)

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current = {
      x: event.clientX,
      y: event.clientY,
      right: position.right,
      bottom: position.bottom,
    }
  }
  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const origin = start.current
    if (origin === null) return
    setDrag({
      right: clamp(origin.right - (event.clientX - origin.x), Math.max(0, window.innerWidth - size)),
      bottom: clamp(origin.bottom - (event.clientY - origin.y), Math.max(0, window.innerHeight - size)),
    })
  }
  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (start.current === null) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    const finalPosition = drag ?? position
    start.current = null
    setDrag(null)
    void controller.patch({ petPosition: finalPosition }).catch(() => {})
  }

  return (
    <div className={styles.overlay} aria-live="off">
      <div
        className={`${styles.pet} ${styles[activityClass(snapshot.activity)]}`}
        data-whale-pet={snapshot.pet}
        style={{ right: position.right, bottom: position.bottom, width: size, height: size }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
      >
        <img src={asset.src} alt={asset.alt} draggable={false} />
      </div>
    </div>
  )
}
