import { type AbilityDefinition, type AbilityKindId, type DeveloperDirectionId, type IndustryId } from './catalog.ts';
export interface AbilityLibraryProps {
    readonly abilities: readonly AbilityDefinition[];
    readonly allAbilities: readonly AbilityDefinition[];
    readonly industry: IndustryId | 'all';
    readonly kind: AbilityKindId | 'all';
    readonly developerDirection: DeveloperDirectionId | 'all';
    readonly selectedId: string | null;
    readonly creatorDisabled: boolean;
    readonly onIndustryChange: (industry: IndustryId | 'all') => void;
    readonly onKindChange: (kind: AbilityKindId | 'all') => void;
    readonly onDeveloperDirectionChange: (direction: DeveloperDirectionId | 'all') => void;
    readonly onSelect: (abilityId: string | null) => void;
    readonly onClear: () => void;
    readonly onCreate: (prompt: string) => void;
    readonly onAskAdvisor: () => void;
}
export declare function AbilityLibrary({ abilities, allAbilities, industry, kind, developerDirection, selectedId, creatorDisabled, onIndustryChange, onKindChange, onDeveloperDirectionChange, onSelect, onClear, onCreate, onAskAdvisor, }: AbilityLibraryProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AbilityLibrary.d.ts.map