function messageOf(error) {
    return error instanceof Error ? error.message : String(error);
}
const IDLE = {
    busy: false,
    error: null,
    launchedPreset: null,
};
export class SessionLauncher {
    port;
    snapshot = IDLE;
    listeners = new Set();
    unsubscribeSessions;
    pending;
    applying = false;
    disposed = false;
    constructor(port) {
        this.port = port;
        this.unsubscribeSessions = port.sessions.subscribe(() => { void this.reconcile(); });
    }
    getSnapshot = () => this.snapshot;
    subscribe = (listener) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    };
    launch(presetId) {
        if (this.disposed || this.snapshot.busy)
            return;
        this.pending = presetId;
        this.publish({ busy: true, error: null, launchedPreset: null });
        try {
            this.port.startSession();
            void this.reconcile();
        }
        catch (error) {
            this.pending = undefined;
            this.publish({ busy: false, error: messageOf(error), launchedPreset: null });
        }
    }
    clearError() {
        if (this.snapshot.error === null)
            return;
        this.publish({ ...this.snapshot, error: null });
    }
    async isPresetAvailable(presetId) {
        return this.port.isPresetAvailable(presetId);
    }
    dispose() {
        if (this.disposed)
            return;
        this.disposed = true;
        this.pending = undefined;
        this.listeners.clear();
        this.unsubscribeSessions();
    }
    publish(next) {
        if (this.disposed)
            return;
        this.snapshot = next;
        for (const listener of this.listeners)
            listener();
    }
    async reconcile() {
        const preset = this.pending;
        if (this.disposed || preset === undefined || this.applying)
            return;
        const state = this.port.sessions.getSnapshot();
        const session = state.current === undefined ? undefined : state.byId[state.current];
        if (session === undefined || !session.blank)
            return;
        if (session.agentPreset === preset) {
            this.pending = undefined;
            this.publish({ busy: false, error: null, launchedPreset: preset });
            return;
        }
        this.applying = true;
        try {
            await this.port.selectPreset(session.id, preset);
            if (this.disposed)
                return;
            this.pending = undefined;
            this.publish({ busy: false, error: null, launchedPreset: preset });
        }
        catch (error) {
            if (this.disposed)
                return;
            this.pending = undefined;
            this.publish({ busy: false, error: messageOf(error), launchedPreset: null });
        }
        finally {
            this.applying = false;
        }
    }
}
