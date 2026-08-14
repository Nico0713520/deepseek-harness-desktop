export type BrowseMode = 'use' | 'type';
export type UseCategory = 'daily' | 'research' | 'github' | 'automation' | 'personalization';
export type ExtensionType = 'agent-preset' | 'skill' | 'workflow' | 'plugin' | 'ui-extension';
export interface CatalogFilter<T extends string> {
    readonly id: T | 'all';
    readonly label: string;
    readonly description?: string;
}
export interface CreatorTemplate {
    readonly id: string;
    readonly title: string;
    readonly benefit: string;
    readonly useCategory: UseCategory;
    readonly extensionTypes: readonly ExtensionType[];
    readonly difficulty: '入门' | '进阶' | '高级';
    readonly duration: string;
    readonly suitableFor: string;
    readonly result: string;
    readonly changes: string;
    readonly risk: string;
    readonly checks: readonly string[];
    readonly goal: string;
}
export declare const USE_CATEGORIES: readonly CatalogFilter<UseCategory>[];
export declare const EXTENSION_TYPES: readonly CatalogFilter<ExtensionType>[];
export declare const EXTENSION_TYPE_LABELS: Readonly<Record<ExtensionType, string>>;
export declare const CREATOR_TEMPLATES: readonly CreatorTemplate[];
export declare function templatesFor(mode: BrowseMode, filter: string): readonly CreatorTemplate[];
//# sourceMappingURL=catalog.d.ts.map