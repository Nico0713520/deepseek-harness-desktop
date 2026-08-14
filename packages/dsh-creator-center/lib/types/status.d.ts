import type { IncomingMessage, ServerResponse } from 'node:http';
export interface AdvisorStatusRoute {
    kind: 'exact';
    path: string;
    handler(req: IncomingMessage, res: ServerResponse): void;
}
export declare function makeAdvisorStatusRoute({ managed }: {
    managed: boolean;
}): AdvisorStatusRoute;
//# sourceMappingURL=status.d.ts.map