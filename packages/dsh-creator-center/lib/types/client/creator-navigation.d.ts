export type CreatorRoute = 'chat' | 'creator-center';
type Listener = () => void;
export declare class CreatorNavigationController {
    private route;
    private readonly listeners;
    getSnapshot: () => CreatorRoute;
    subscribe: (listener: Listener) => (() => void);
    open(): void;
    close(): void;
    dispose(): void;
    private setRoute;
}
export {};
//# sourceMappingURL=creator-navigation.d.ts.map