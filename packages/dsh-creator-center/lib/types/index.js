import { makeAdvisorStatusRoute } from "./status.js";
export const name = 'whale-creator-center';
export const inject = ['webServer'];
export function apply(ctx) {
    const host = ctx;
    const route = makeAdvisorStatusRoute({ managed: process.env.WHALE_ADVISOR_MANAGED === '1' });
    host.effect(() => host.webServer.register(route), 'whale-creator-center: advisor status');
}
