export type PetKind = 'off' | 'whale-maid' | 'abstract-whale';
export type PetScale = 0.8 | 1 | 1.2;
export type PetActivity = 'idle' | 'thinking' | 'tool' | 'waiting' | 'completed' | 'failed';
export interface WhaleAppearanceSettings {
    themeEnabled: boolean;
    pet: PetKind;
    petScale: PetScale;
    petPosition: {
        right: number;
        bottom: number;
    };
}
export interface AppearanceSnapshot extends WhaleAppearanceSettings {
    activity: PetActivity;
}
//# sourceMappingURL=types.d.ts.map