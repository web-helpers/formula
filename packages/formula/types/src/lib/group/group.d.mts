import type { BeakerStores, BeakerOptions, FormulaOptions } from '../shared/types.mjs';
import type { Formula } from '../form/form.mjs';
export interface Beaker {
    group: (node: HTMLElement) => {
        destroy: () => void;
    };
    update: (options: FormulaOptions) => void;
    destroy: () => void;
    forms: Map<HTMLElement, Formula>;
    stores: BeakerStores;
    init: (items: Array<Record<string, unknown>>) => void;
    add: (item: Record<string, unknown>) => void;
    set: (index: number, item: Record<string, unknown>) => void;
    delete: (index: number) => void;
    clear: () => void;
}
export declare function createGroup(options: BeakerOptions, beakerStores: Map<string, BeakerStores>): Beaker;
