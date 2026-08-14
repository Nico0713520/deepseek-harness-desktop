import { loadSettings, sanitizeSettings, saveSettings } from "./persist.js";
export function activityFromPhase(phase) {
    switch (phase) {
        case 'idle': return 'idle';
        case 'thinking': return 'thinking';
        case 'tool': return 'tool';
        case 'waiting': return 'waiting';
        case 'done': return 'completed';
        default: return 'failed';
    }
}
export class AppearanceState {
    persistDir;
    settings;
    activity = 'idle';
    constructor(persistDir) {
        this.persistDir = persistDir;
        this.settings = loadSettings(persistDir);
    }
    snapshot() {
        return { ...this.settings, petPosition: { ...this.settings.petPosition }, activity: this.activity };
    }
    setActivity(phase) {
        this.activity = activityFromPhase(phase);
        return this.snapshot();
    }
    update(patch) {
        this.settings = sanitizeSettings({
            ...this.settings,
            ...patch,
            petPosition: patch.petPosition === undefined
                ? this.settings.petPosition
                : { ...this.settings.petPosition, ...patch.petPosition },
        });
        saveSettings(this.settings, this.persistDir);
        return this.snapshot();
    }
}
