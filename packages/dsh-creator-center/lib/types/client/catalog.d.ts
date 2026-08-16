import { DEVELOPER_DIRECTIONS, DEVELOPER_DIRECTION_LABELS, DEVELOPER_DIRECTIONS_BY_ABILITY_ID, type DeveloperDirectionId } from './developer-directions.ts';
export { DEVELOPER_DIRECTIONS, DEVELOPER_DIRECTION_LABELS, DEVELOPER_DIRECTIONS_BY_ABILITY_ID, };
export type { DeveloperDirectionId } from './developer-directions.ts';
export type IndustryId = 'programmer' | 'financial-services' | 'healthcare' | 'life-sciences' | 'retail' | 'government' | 'education';
export type AbilityKindId = 'coding' | 'content-creation' | 'research' | 'agents' | 'data-analysis';
export type CollectionId = 'vibe-coding';
export type ExtensionType = 'agent-preset' | 'skill' | 'workflow' | 'plugin' | 'ui-extension';
export type EcosystemId = 'deepseek-harness' | 'pi' | 'vendor' | 'community';
export type TrustTier = 'dsh-official' | 'vendor-official' | 'maintainer' | 'community-reviewed' | 'experimental';
export type CompatibilityPath = 'native' | 'mcp' | 'skill-copy' | 'creator-recipe' | 'manual-adapter' | 'project-tool';
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
    readonly developerDirectionIds: readonly DeveloperDirectionId[];
    readonly collectionIds: readonly CollectionId[];
    readonly aliases: readonly string[];
    readonly examples: readonly string[];
    readonly userProvides: string;
    readonly userReceives: string;
    readonly suitableFor: string;
    readonly readsOrChanges: string;
    readonly rollback: string;
    readonly estimatedTime: string;
    readonly ecosystem?: EcosystemId;
    readonly trust?: TrustTier;
    readonly compatibility?: CompatibilityPath;
    readonly popularity?: string;
    readonly iconUrl?: string;
    readonly implementation: {
        readonly extensionTypes: readonly ExtensionType[];
        readonly goal: string;
        readonly addMethod: string;
        readonly checks: readonly string[];
        readonly source: string;
        readonly license: string;
        readonly repositoryUrl: string;
    };
}
export interface AbilityFilters {
    readonly industry: IndustryId | 'all';
    readonly kind: AbilityKindId | 'all';
    readonly developerDirection: DeveloperDirectionId | 'all';
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
export declare const TRUST_TIER_LABELS: Readonly<Record<TrustTier, string>>;
export declare const COMPATIBILITY_LABELS: Readonly<Record<CompatibilityPath, string>>;
export declare const ECOSYSTEM_LABELS: Readonly<Record<EcosystemId, string>>;
export declare function githubStarLabel(popularity?: string): string;
export declare const ABILITIES: readonly AbilityDefinition[];
export declare const FEATURED_SCENES: readonly [{
    readonly id: "workflow";
    readonly title: "建立开发工作流";
    readonly description: "规划、实现、调试、验证";
    readonly abilityIds: readonly ["obra-superpowers", "mattpocock-skills", "lenml-ponytail"];
}, {
    readonly id: "research";
    readonly title: "扩展资料检索";
    readonly description: "搜索、抓取、近期趋势";
    readonly abilityIds: readonly ["panniantong-agent-reach", "firecrawl-mcp-server", "mvanhorn-last30days-skill"];
}, {
    readonly id: "browser";
    readonly title: "做浏览器自动化";
    readonly description: "测试网页、采集公开资料";
    readonly abilityIds: readonly ["microsoft-playwright"];
}];
export declare const VIBE_CODING_GROUPS: readonly VibeCodingGroup[];
export declare function abilitiesFor(filters: AbilityFilters): readonly AbilityDefinition[];
export declare function collectionAbilities(collectionId: CollectionId): readonly AbilityDefinition[];
export declare function recommendAbilities(problem: string): readonly AbilityDefinition[];
export declare const EXTENSION_TYPE_LABELS: Readonly<Record<ExtensionType, string>>;
//# sourceMappingURL=catalog.d.ts.map