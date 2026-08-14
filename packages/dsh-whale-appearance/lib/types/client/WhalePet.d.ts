import type { PetActivity } from '../types.ts';
import type { AppearanceController } from './appearance-controller.ts';
export interface WhalePetProps {
    controller: AppearanceController;
}
export declare function activityClass(activity: PetActivity): PetActivity;
export declare function WhalePet({ controller }: WhalePetProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WhalePet.d.ts.map