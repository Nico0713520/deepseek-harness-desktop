import { CreatorCenter } from "./CreatorCenter.js";
import { SessionLauncher } from "./session-launcher.js";
function agentPresetSeat(ctx) {
    const slots = ctx.slots;
    const entry = slots.entriesOfSlot('conversation.hero.agentPreset')[0];
    const inject = entry?.inject;
    const face = inject?.();
    return typeof face?.select === 'function' ? face : undefined;
}
export const inject = ['slots', 'sessions', 'workspaces'];
export function apply(ctx) {
    const launcher = new SessionLauncher({
        sessions: ctx.sessions.list,
        startSession: () => { ctx.workspaces.startSession(); },
        selectPreset: async (_sessionId, presetId) => {
            const seat = agentPresetSeat(ctx);
            if (seat === undefined)
                throw new Error('官方 Agent 预设选择器暂时不可用');
            await seat.select(presetId);
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
