import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import type { SidebarPrimaryActionOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client';
import { type SessionListState } from './session-launcher.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        'sidebar.primary.action': {
            kind: 'list';
            scope: 'root';
            owner: SidebarPrimaryActionOwnerProps;
        };
    }
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
export type { SessionListState };
//# sourceMappingURL=index.d.ts.map