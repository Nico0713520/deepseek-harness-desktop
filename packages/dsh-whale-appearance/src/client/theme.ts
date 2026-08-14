import styles from './whale-theme.module.css'

const ROOT_SELECTOR = '[data-conversation-scroll]'

function layer(doc: Document, role: 'atmosphere' | 'left' | 'right' | 'veil'): HTMLElement {
  const element = doc.createElement('div')
  element.dataset.whaleCanvas = role
  element.className = `${styles.layer} ${styles[role]}`
  element.setAttribute('aria-hidden', 'true')
  return element
}

export function applyWhaleCanvas(doc: Document = document): () => void {
  let disposed = false
  let mountedRoot: HTMLElement | null = null

  const clear = (): void => {
    for (const element of doc.querySelectorAll<HTMLElement>('[data-whale-canvas]')) element.remove()
    if (mountedRoot !== null) delete mountedRoot.dataset.whaleCanvasRoot
    mountedRoot = null
  }

  const mount = (): void => {
    if (disposed) return
    const root = doc.querySelector<HTMLElement>(ROOT_SELECTOR)
    if (root === mountedRoot && root?.querySelectorAll('[data-whale-canvas]').length === 4) return
    clear()
    if (root === null) return
    root.dataset.whaleCanvasRoot = ''
    root.prepend(
      layer(doc, 'atmosphere'),
      layer(doc, 'left'),
      layer(doc, 'right'),
      layer(doc, 'veil'),
    )
    mountedRoot = root
  }

  mount()
  const observer = new MutationObserver(mount)
  if (doc.body !== null) observer.observe(doc.body, { childList: true, subtree: true })

  return () => {
    if (disposed) return
    disposed = true
    observer.disconnect()
    clear()
  }
}
