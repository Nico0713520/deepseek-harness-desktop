export type CreatorRoute = 'chat' | 'creator-center' | 'my-extensions';
type Listener = () => void;
export declare class CreatorNavigationController {
    private route;
    private readonly listeners;
    getSnapshot: () => CreatorRoute;
    subscribe: (listener: Listener) => (() => void);
    open(): void;
    openMyExtensions(): void;
    close(): void;
    dispose(): void;
    private setRoute;
}
export {};
//# sourceMappingURL=creator-navigation.d.ts.map