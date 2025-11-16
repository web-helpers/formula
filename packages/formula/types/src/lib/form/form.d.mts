import { type FormElement } from '../shared/fields.mjs';
import type { FormulaStores, FormulaOptions } from '../shared/types.mjs';
export interface Formula {
    init: (node: HTMLElement) => FormulaForm;
    updateForm: (updatedOpts?: FormulaOptions) => void;
    destroyForm: () => void;
    resetForm: () => void;
    stores: FormulaStores;
}
export interface FormulaForm {
    root: HTMLElement;
    elements: Array<[string, FormElement[]]>;
    destroy: () => void;
}
export declare function createForm(options: FormulaOptions, globalStore: Map<string, FormulaStores> | undefined, groupName: string | undefined, initialData: Record<string, unknown>): Formula;
