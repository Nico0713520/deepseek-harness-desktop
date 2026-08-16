import { type AbilityDefinition, type AbilityKindId, type IndustryId } from './catalog.ts';
export interface AbilityLibraryProps {
    readonly abilities: readonly AbilityDefinition[];
    readonly industry: IndustryId | 'all';
    readonly kind: AbilityKindId | 'all';
    readonly selectedId: string | null;
    readonly recommendationLabel: string | null;
    readonly creatorDisabled: boolean;
    readonly onIndustryChange: (industry: IndustryId | 'all') => void;
    readonly onKindChange: (kind: AbilityKindId | 'all') => void;
    readonly onSelect: (abilityId: string | null) => void;
    readonly onClear: () => void;
    readonly onCreate: (prompt: string) => void;
    readonly onAskAdvisor: () => void;
}
export declare function AbilityLibrary({ abilities, industry, kind, selectedId, recommendationLabel, creatorDisabled, onIndustryChange, onKindChange, onSelect, onClear, onCreate, onAskAdvisor, }: AbilityLibraryProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AbilityLibrary.d.ts.map