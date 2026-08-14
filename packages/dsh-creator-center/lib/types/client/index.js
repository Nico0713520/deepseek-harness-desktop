import { CreatorCenter } from "./CreatorCenter.js";
import { SessionLauncher } from "./session-launcher.js";
export const inject = ['slots', 'connection', 'sessions', 'workspaces'];
export function apply(ctx) {
    const { api } = ctx.get('connection');
    const launcher = new SessionLauncher({
        sessions: ctx.sessions.list,
        startSession: () => { ctx.workspaces.startSession(); },
        selectPreset: async (sessionId, presetId) => {
            const response = await api.agentPresets.select({
                sessionId: sessionId,
                agentPreset: presetId,
            });
            if (!response.result.ok)
                throw new Error(response.result.error.message);
        },
    });
    ctx.effect(() => () => { launcher.dispose(); }, 'creator-center: session launcher');
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'creator-center',
        order: 19,
        label: () => '创造中心',
        inject: () => ({ launcher }),
    }, CreatorCenter));
}
