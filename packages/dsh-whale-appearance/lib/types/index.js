import { appearanceHomeDir } from "./persist.js";
import { appearancePackageRoot, makeAppearanceRoutes } from "./routes.js";
import { AppearanceState } from "./service.js";
export const name = 'whale-appearance';
export const inject = ['webServer'];
export function apply(ctx) {
    const state = new AppearanceState(appearanceHomeDir());
    const routes = makeAppearanceRoutes({ state, packageRoot: appearancePackageRoot(import.meta.url) });
    ctx.effect(() => {
        const disposers = routes.map(route => ctx.webServer.register(route));
        return () => { for (const dispose of disposers)
            dispose(); };
    }, 'whale-appearance: routes');
    ctx.on('session/event', (_session, event) => {
        if (event.type !== 'activity/status')
            return;
        const data = typeof event.data === 'object' && event.data !== null
            ? event.data
            : {};
        state.setActivity(data.phase);
    });
    ctx.on('session/disposed', () => { state.setActivity('idle'); });
}
