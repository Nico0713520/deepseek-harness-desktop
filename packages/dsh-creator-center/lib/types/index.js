import { homedir } from 'node:os';
import { join } from 'node:path';
import { makeAdvisorStatusRoute } from "./status.js";
import { makeUserExtensionRoutes } from "./extensions.js";
export const name = 'whale-creator-center';
export const inject = ['webServer'];
export function apply(ctx) {
    const host = ctx;
    const route = makeAdvisorStatusRoute({ managed: process.env.WHALE_ADVISOR_MANAGED === '1' });
    const userExtensionRoutes = makeUserExtensionRoutes(process.env.DSH_HOME ?? join(homedir(), '.dsh'));
    host.effect(() => {
        const disposers = [host.webServer.register(route), ...userExtensionRoutes.map(item => host.webServer.register(item))];
        return () => { for (const dispose of disposers)
            dispose(); };
    }, 'whale-creator-center: advisor and user extension routes');
}
