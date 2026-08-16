export type IndustryId = 'programmer' | 'financial-services' | 'healthcare' | 'life-sciences' | 'retail' | 'government' | 'education';
export type AbilityKindId = 'coding' | 'content-creation' | 'research' | 'agents' | 'data-analysis';
export type CollectionId = 'vibe-coding';
export type ExtensionType = 'agent-preset' | 'skill' | 'workflow' | 'plugin' | 'ui-extension';
export interface TaxonomyItem<T extends string> {
    readonly id: T | 'all';
    readonly label: string;
    readonly description?: string;
}
export interface AbilityDefinition {
    readonly id: string;
    readonly title: string;
    readonly outcome: string;
    readonly summary: string;
    readonly industryIds: readonly IndustryId[];
    readonly kindIds: readonly AbilityKindId[];
    readonly collectionIds: readonly CollectionId[];
    readonly aliases: readonly string[];
    readonly examples: readonly string[];
    readonly userProvides: string;
    readonly userReceives: string;
    readonly suitableFor: string;
    readonly readsOrChanges: string;
    readonly rollback: string;
    readonly estimatedTime: string;
    readonly implementation: {
        readonly extensionTypes: readonly ExtensionType[];
        readonly goal: string;
        readonly checks: readonly string[];
        readonly source: string;
        readonly license: string;
        readonly repositoryUrl?: string;
    };
}
export interface AbilityFilters {
    readonly industry: IndustryId | 'all';
    readonly kind: AbilityKindId | 'all';
    readonly query: string;
}
export interface VibeCodingGroup {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly starter: string;
    readonly access: string;
    readonly milestone: string;
    readonly confirmation: string;
    readonly verify: string;
    readonly abilityId?: string;
}
export declare const INDUSTRIES: readonly TaxonomyItem<IndustryId>[];
export declare const ABILITY_KINDS: readonly TaxonomyItem<AbilityKindId>[];
export declare const INDUSTRY_LABELS: Readonly<Record<IndustryId, string>>;
export declare const ABILITY_KIND_LABELS: Readonly<Record<AbilityKindId, string>>;
export declare const ABILITIES: readonly AbilityDefinition[];
export declare const FEATURED_SCENES: readonly [{
    readonly id: "work";
    readonly title: "把重复工作交给 DeepSeek";
    readonly description: "总结、分类、按流程检查";
    readonly abilityIds: readonly ["weekly-report", "company-sop", "scheduled-check"];
}, {
    readonly id: "research";
    readonly title: "把资料变成可靠结论";
    readonly description: "检索、对比、数据分析";
    readonly abilityIds: readonly ["web-research", "file-data-analysis"];
}, {
    readonly id: "build";
    readonly title: "把想法做成可运行版本";
    readonly description: "搭工具、查代码、改界面";
    readonly abilityIds: readonly ["project-scaffold", "github-review", "custom-ui-theme"];
}];
export declare const VIBE_CODING_GROUPS: readonly VibeCodingGroup[];
export declare function abilitiesFor(filters: AbilityFilters): readonly AbilityDefinition[];
export declare function collectionAbilities(collectionId: CollectionId): readonly AbilityDefinition[];
export declare function recommendAbilities(problem: string): readonly AbilityDefinition[];
export declare const EXTENSION_TYPE_LABELS: Readonly<Record<ExtensionType, string>>;
//# sourceMappingURL=catalog.d.ts.map