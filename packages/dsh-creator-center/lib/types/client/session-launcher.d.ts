export interface LaunchSessionSummary {
    readonly id: string;
    readonly blank: boolean;
    readonly agentPreset?: string;
}
export interface SessionListState {
    readonly current: string | undefined;
    readonly byId: Readonly<Record<string, LaunchSessionSummary>>;
}
export interface SessionStore {
    getSnapshot(): SessionListState;
    subscribe(listener: () => void): () => void;
}
export interface SessionLaunchPort {
    readonly sessions: SessionStore;
    startSession(): void;
    isPresetAvailable(presetId: string): Promise<boolean>;
    selectPreset(sessionId: string, presetId: string): Promise<void>;
}
export interface LaunchSnapshot {
    readonly busy: boolean;
    readonly error: string | null;
    readonly launchedPreset: string | null;
}
type Listener = () => void;
export declare class SessionLauncher {
    private readonly port;
    private snapshot;
    private readonly listeners;
    private readonly unsubscribeSessions;
    private pending;
    private applying;
    private disposed;
    constructor(port: SessionLaunchPort);
    getSnapshot: () => LaunchSnapshot;
    subscribe: (listener: Listener) => (() => void);
    launch(presetId: string): void;
    clearError(): void;
    isPresetAvailable(presetId: string): Promise<boolean>;
    dispose(): void;
    private publish;
    private reconcile;
}
export {};
//# sourceMappingURL=session-launcher.d.ts.map