import { homedir } from 'node:os';
import { join } from 'node:path';
import { makeUserExtensionRoutes } from "./extensions.js";
export const name = 'whale-creator-center';
export const inject = ['webServer'];
export function apply(ctx) {
    const host = ctx;
    const userExtensionRoutes = makeUserExtensionRoutes(process.env.DSH_HOME ?? join(homedir(), '.dsh'));
    host.effect(() => {
        const disposers = userExtensionRoutes.map(item => host.webServer.register(item));
        return () => { for (const dispose of disposers)
            dispose(); };
    }, 'whale-creator-center: user extension routes');
}
