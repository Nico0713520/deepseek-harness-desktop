import type { IncomingMessage, ServerResponse } from 'node:http';
export declare const USER_EXTENSION_OWNER = "whale-extension-center";
export declare const USER_EXTENSION_REGISTRY = "whale-user-extensions.json";
export interface UserExtensionWebRoute {
    readonly kind: 'exact' | 'prefix';
    readonly path: string;
    readonly handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
}
export type UserExtensionKind = 'skill' | 'plugin';
export interface UserExtensionRecord {
    readonly id: string;
    readonly title: string;
    readonly kind: UserExtensionKind;
    readonly category: string;
    readonly summary: string;
    readonly repositoryUrl: string;
    readonly localPath: string;
    readonly managedBy: typeof USER_EXTENSION_OWNER;
    readonly installedAt: string;
    readonly enabled: boolean;
    readonly localTestOnly?: boolean;
}
export declare function userExtensionRegistryPath(dshHome: string): string;
export declare function loadUserExtensions(dshHome: string): UserExtensionRecord[];
export declare function saveUserExtensions(dshHome: string, records: readonly UserExtensionRecord[]): void;
export declare function makeUserExtensionRoutes(dshHome: string): UserExtensionWebRoute[];
//# sourceMappingURL=extensions.d.ts.map