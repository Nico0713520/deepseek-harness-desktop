import type { AppearanceSnapshot, PetActivity, WhaleAppearanceSettings } from './types.ts';
export declare function activityFromPhase(phase: unknown): PetActivity;
export declare class AppearanceState {
    private readonly persistDir;
    private settings;
    private activity;
    constructor(persistDir: string);
    snapshot(): AppearanceSnapshot;
    setActivity(phase: unknown): AppearanceSnapshot;
    update(patch: Partial<WhaleAppearanceSettings>): AppearanceSnapshot;
}
//# sourceMappingURL=service.d.ts.map