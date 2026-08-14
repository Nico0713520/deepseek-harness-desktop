import type { AppearanceSnapshot, WhaleAppearanceSettings } from '../types.ts';
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type Listener = () => void;
export declare class AppearanceController {
    private readonly fetcher;
    private snapshot;
    private readonly listeners;
    constructor(fetcher?: FetchLike);
    getSnapshot: () => AppearanceSnapshot;
    subscribe: (listener: Listener) => (() => void);
    private publish;
    refresh(): Promise<AppearanceSnapshot>;
    patch(patch: Partial<WhaleAppearanceSettings>): Promise<AppearanceSnapshot>;
}
export {};
//# sourceMappingURL=appearance-controller.d.ts.map