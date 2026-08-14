const EMPTY = {
    themeEnabled: false,
    pet: 'off',
    petScale: 1,
    petPosition: { right: 24, bottom: 24 },
    activity: 'idle',
};
export class AppearanceController {
    fetcher;
    snapshot = EMPTY;
    listeners = new Set();
    constructor(fetcher = globalThis.fetch.bind(globalThis)) {
        this.fetcher = fetcher;
    }
    getSnapshot = () => this.snapshot;
    subscribe = (listener) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    };
    publish(snapshot) {
        this.snapshot = snapshot;
        for (const listener of this.listeners)
            listener();
        return snapshot;
    }
    async refresh() {
        const response = await this.fetcher('/api/whale-appearance/state');
        if (!response.ok)
            throw new Error(`appearance state failed: ${response.status}`);
        return this.publish(await response.json());
    }
    async patch(patch) {
        const response = await this.fetcher('/api/whale-appearance/config', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(patch),
        });
        if (!response.ok)
            throw new Error(`appearance config failed: ${response.status}`);
        return this.publish(await response.json());
    }
}
