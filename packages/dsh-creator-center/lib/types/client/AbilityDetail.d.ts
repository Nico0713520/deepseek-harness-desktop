import { type AbilityDefinition } from './catalog.ts';
export interface AbilityDetailProps {
    readonly ability: AbilityDefinition;
    readonly disabled: boolean;
    readonly onClose: () => void;
    readonly onCreate: (prompt: string) => void;
    readonly onAskAdvisor: () => void;
}
export declare function AbilityDetail({ ability, disabled, onClose, onCreate, onAskAdvisor }: AbilityDetailProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AbilityDetail.d.ts.map