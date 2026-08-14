import type { WebRoute } from '@deepseek-ai/dsh-host-webserver';
import type { AppearanceState } from './service.ts';
export declare function appearancePackageRoot(importMetaUrl: string): string;
export declare function makeAppearanceRoutes(deps: {
    state: Pick<AppearanceState, 'snapshot' | 'update'>;
    packageRoot: string;
}): WebRoute[];
//# sourceMappingURL=routes.d.ts.map