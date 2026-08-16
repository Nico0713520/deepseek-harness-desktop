export type DeveloperDirectionId = 'development-process' | 'frontend' | 'backend' | 'crawler' | 'agent-workflow' | 'data-ai' | 'operations';
export interface DeveloperDirection {
    readonly id: DeveloperDirectionId | 'all';
    readonly label: string;
    readonly description: string;
}
export declare const DEVELOPER_DIRECTIONS: readonly DeveloperDirection[];
export declare const DEVELOPER_DIRECTION_LABELS: Readonly<Record<DeveloperDirectionId, string>>;
/**
 * A project may serve more than one development direction.
 * Keep this map explicit so the Hub's taxonomy is reviewable and editable
 * without changing the underlying third-party catalog entries.
 */
export declare const DEVELOPER_DIRECTIONS_BY_ABILITY_ID: Readonly<Record<string, readonly DeveloperDirectionId[]>>;
//# sourceMappingURL=developer-directions.d.ts.map