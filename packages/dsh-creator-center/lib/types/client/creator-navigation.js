export class CreatorNavigationController {
    route = 'chat';
    listeners = new Set();
    getSnapshot = () => this.route;
    subscribe = (listener) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    };
    open() {
        this.setRoute('creator-center');
    }
    close() {
        this.setRoute('chat');
    }
    dispose() {
        this.listeners.clear();
    }
    setRoute(next) {
        if (this.route === next)
            return;
        this.route = next;
        for (const listener of this.listeners)
            listener();
    }
}
