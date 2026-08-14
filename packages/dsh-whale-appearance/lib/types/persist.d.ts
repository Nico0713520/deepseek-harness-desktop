import type { WhaleAppearanceSettings } from './types.ts';
export declare function appearanceHomeDir(): string;
export declare function defaultSettings(): WhaleAppearanceSettings;
export declare function sanitizeSettings(value: unknown): WhaleAppearanceSettings;
export declare function loadSettings(dir?: string): WhaleAppearanceSettings;
export declare function saveSettings(settings: WhaleAppearanceSettings, dir?: string): void;
//# sourceMappingURL=persist.d.ts.map