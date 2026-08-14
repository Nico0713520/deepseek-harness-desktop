type StatusFetcher = (input: string, init?: {
    cache?: RequestCache;
}) => Promise<{
    ok: boolean;
    json(): Promise<unknown>;
}>;
export declare function isManagedAdvisorHost(fetcher?: StatusFetcher): Promise<boolean>;
export {};
//# sourceMappingURL=advisor-status.d.ts.map