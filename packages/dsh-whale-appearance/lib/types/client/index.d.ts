import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        'web-ui.plugin.item': {
            kind: 'list';
            scope: 'root';
            owner: Record<string, never>;
        };
        'shell.overlay': {
            kind: 'list';
            scope: 'root';
            owner: Record<string, never>;
        };
    }
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map