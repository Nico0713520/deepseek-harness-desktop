import { isManagedAdvisorHost } from "./advisor-status.js";
import { CreatorCenterSidebarAction } from "./CreatorCenterSidebarAction.js";
import { CreatorCenterSurface } from "./CreatorCenterSurface.js";
import { MyExtensionsSidebarAction } from "./MyExtensionsSidebarAction.js";
import { CreatorNavigationController } from "./creator-navigation.js";
import { SessionLauncher } from "./session-launcher.js";
const ADVISOR_PRESET_ID = 'whale-extension-advisor';
const ADVISOR_MARKER = '<!-- whale-extension-advisor -->';
function agentPresetSeat(ctx) {
    const slots = ctx.slots;
    const entry = slots.entriesOfSlot('conversation.hero.agentPreset')[0];
    const inject = entry?.inject;
    const face = inject?.();
    return typeof face?.select === 'function' ? face : undefined;
}
export const inject = ['slots', 'connection', 'sessions', 'workspaces', 'layout'];
export function apply(ctx) {
    const { api } = ctx.get('connection');
    const launcher = new SessionLauncher({
        sessions: ctx.sessions.list,
        startSession: () => { ctx.workspaces.startSession(); },
        isPresetAvailable: async (presetId) => {
            const response = await api.agentPresets.list({});
            if (!response.result.ok)
                return false;
            return response.result.value.presets.some((preset) => (preset.id === presetId && preset.broken === undefined));
        },
        selectPreset: async (sessionId, presetId) => {
            const seat = agentPresetSeat(ctx);
            if (seat === undefined)
                throw new Error('官方 Agent 预设选择器暂时不可用');
            if (presetId === ADVISOR_PRESET_ID) {
                if (!await isManagedAdvisorHost()) {
                    throw new Error('内置 AI 扩展顾问不可用，请改用官方创造模式');
                }
                const response = await api.agentPresets.read({ agentPreset: presetId });
                if (!response.result.ok || !response.result.value.content.includes(ADVISOR_MARKER)) {
                    throw new Error('内置 AI 扩展顾问不可用，请改用官方创造模式');
                }
            }
            await seat.select(presetId);
            const seatState = seat.hooks.agentPresetSeat.getSnapshot();
            if (seatState.error !== null)
                throw new Error(seatState.error);
            const sessions = ctx.sessions.list.getSnapshot();
            const current = sessions.current === undefined ? undefined : sessions.byId[sessions.current];
            if (current?.id !== sessionId || current.agentPreset !== presetId || seatState.current !== presetId) {
                throw new Error('预设未能应用到新的空白会话');
            }
        },
    });
    const navigation = new CreatorNavigationController();
    ctx.effect(() => () => { launcher.dispose(); }, 'creator-center: session launcher');
    ctx.effect(() => {
        let lastCurrent = ctx.sessions.list.getSnapshot().current;
        const unsubscribeSessions = ctx.sessions.list.subscribe(() => {
            const current = ctx.sessions.list.getSnapshot().current;
            if (navigation.getSnapshot() === 'creator-center' && current !== lastCurrent)
                navigation.close();
            lastCurrent = current;
        });
        const unsubscribeNavigation = navigation.subscribe(() => {
            if (navigation.getSnapshot() === 'creator-center')
                ctx.layout.closeDetails();
        });
        return () => {
            unsubscribeSessions();
            unsubscribeNavigation();
            navigation.dispose();
        };
    }, 'creator-center: navigation');
    ctx.slots.inject('sidebar.primary.action', () => ctx.slots.register({
        name: 'sidebar.primary.action',
        id: 'creator-center',
        order: 10,
        inject: () => ({ navigation }),
    }, CreatorCenterSidebarAction));
    ctx.slots.inject('sidebar.primary.action', () => ctx.slots.register({
        name: 'sidebar.primary.action',
        id: 'my-extensions',
        order: 20,
        inject: () => ({ navigation }),
    }, MyExtensionsSidebarAction));
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'creator-center',
        order: 60,
        inject: () => ({ navigation, launcher }),
    }, CreatorCenterSurface));
}
