import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const PETS = ['off', 'whale-maid', 'abstract-whale'];
const SCALES = [0.8, 1, 1.2];
const MAX_INSET = 10_000;
export function appearanceHomeDir() {
    return process.env.DSH_HOME ?? join(homedir(), '.dsh');
}
export function defaultSettings() {
    return {
        themeEnabled: false,
        pet: 'off',
        petScale: 1,
        petPosition: { right: 24, bottom: 24 },
    };
}
function inset(value, fallback) {
    if (typeof value !== 'number' || !Number.isFinite(value))
        return fallback;
    return Math.round(Math.min(MAX_INSET, Math.max(0, value)));
}
export function sanitizeSettings(value) {
    const base = defaultSettings();
    if (typeof value !== 'object' || value === null)
        return base;
    const raw = value;
    const position = typeof raw.petPosition === 'object' && raw.petPosition !== null
        ? raw.petPosition
        : base.petPosition;
    return {
        themeEnabled: typeof raw.themeEnabled === 'boolean' ? raw.themeEnabled : base.themeEnabled,
        pet: PETS.includes(raw.pet) ? raw.pet : base.pet,
        petScale: SCALES.includes(raw.petScale) ? raw.petScale : base.petScale,
        petPosition: {
            right: inset(position.right, base.petPosition.right),
            bottom: inset(position.bottom, base.petPosition.bottom),
        },
    };
}
export function loadSettings(dir = appearanceHomeDir()) {
    try {
        return sanitizeSettings(JSON.parse(readFileSync(join(dir, 'whale-appearance.json'), 'utf8')));
    }
    catch {
        return defaultSettings();
    }
}
export function saveSettings(settings, dir = appearanceHomeDir()) {
    mkdirSync(dir, { recursive: true });
    const target = join(dir, 'whale-appearance.json');
    const temporary = `${target}.tmp`;
    writeFileSync(temporary, JSON.stringify(sanitizeSettings(settings), null, 2), 'utf8');
    renameSync(temporary, target);
}
