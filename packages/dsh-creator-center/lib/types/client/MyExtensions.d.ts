import type { UserExtensionRecord } from '../extensions.ts';
type ExtensionFetcher = typeof fetch;
export declare function fetchUserExtensions(fetcher?: ExtensionFetcher): Promise<UserExtensionRecord[]>;
export interface MyExtensionsProps {
    readonly onClose: () => void;
    readonly fetcher?: ExtensionFetcher;
}
export declare function MyExtensions({ onClose, fetcher }: MyExtensionsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MyExtensions.d.ts.map