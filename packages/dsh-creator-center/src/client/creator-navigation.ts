export type CreatorRoute = 'chat' | 'creator-center' | 'my-extensions'

type Listener = () => void

export class CreatorNavigationController {
  private route: CreatorRoute = 'chat'
  private readonly listeners = new Set<Listener>()

  getSnapshot = (): CreatorRoute => this.route

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  open(): void {
    this.setRoute('creator-center')
  }

  openMyExtensions(): void {
    this.setRoute('my-extensions')
  }

  close(): void {
    this.setRoute('chat')
  }

  dispose(): void {
    this.listeners.clear()
  }

  private setRoute(next: CreatorRoute): void {
    if (this.route === next) return
    this.route = next
    for (const listener of this.listeners) listener()
  }
}
