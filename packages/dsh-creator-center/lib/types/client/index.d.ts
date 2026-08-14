import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type SessionListState } from './session-launcher.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        'settings.section': {
            kind: 'list';
            scope: 'root';
            owner: Record<string, never>;
        };
    }
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
export type { SessionListState };
//# sourceMappingURL=index.d.ts.map