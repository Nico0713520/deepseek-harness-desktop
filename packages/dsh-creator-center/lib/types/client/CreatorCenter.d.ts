import type { LaunchSnapshot } from './session-launcher.ts';
export interface CreatorLauncher {
    getSnapshot(): LaunchSnapshot;
    subscribe(listener: () => void): () => void;
    launch(presetId: string): void;
    clearError(): void;
    isPresetAvailable(presetId: string): Promise<boolean>;
}
export interface ClipboardPort {
    writeText(text: string): Promise<void>;
}
export interface CreatorCenterProps {
    readonly launcher: CreatorLauncher;
    readonly onClose?: () => void;
    readonly clipboard?: ClipboardPort;
}
export declare function CreatorCenter({ launcher, onClose, clipboard }: CreatorCenterProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CreatorCenter.d.ts.map