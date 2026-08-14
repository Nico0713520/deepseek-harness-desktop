import { AppearanceSettingsCard } from "./AppearanceSettingsCard.js";
import { AppearanceController } from "./appearance-controller.js";
import { applyWhaleCanvas } from "./theme.js";
import { WhalePet } from "./WhalePet.js";
export const inject = ['slots'];
export function apply(ctx) {
    const controller = new AppearanceController();
    let disposeTheme;
    const syncTheme = () => {
        const enabled = controller.getSnapshot().themeEnabled;
        if (enabled && disposeTheme === undefined)
            disposeTheme = applyWhaleCanvas(document);
        if (!enabled && disposeTheme !== undefined) {
            disposeTheme();
            disposeTheme = undefined;
        }
    };
    const unsubscribe = controller.subscribe(syncTheme);
    ctx.effect(() => {
        const refresh = () => { void controller.refresh().catch(() => { }); };
        let timer;
        const stop = () => {
            if (timer !== undefined)
                window.clearInterval(timer);
            timer = undefined;
        };
        const start = () => {
            if (document.visibilityState !== 'visible' || timer !== undefined)
                return;
            refresh();
            timer = window.setInterval(refresh, 1_000);
        };
        const visibility = () => {
            if (document.visibilityState === 'visible')
                start();
            else
                stop();
        };
        document.addEventListener('visibilitychange', visibility);
        start();
        return () => {
            stop();
            document.removeEventListener('visibilitychange', visibility);
            unsubscribe();
            disposeTheme?.();
            disposeTheme = undefined;
        };
    }, 'whale-appearance: sync');
    ctx.slots.inject('web-ui.plugin.item', () => ctx.slots.register({
        name: 'web-ui.plugin.item',
        id: 'whale-appearance-settings',
        order: 105,
        inject: () => ({ controller }),
    }, AppearanceSettingsCard));
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'whale-pet',
        order: 80,
        inject: () => ({ controller }),
    }, WhalePet));
}
