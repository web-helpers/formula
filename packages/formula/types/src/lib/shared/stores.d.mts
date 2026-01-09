import type { FormulaStores, BeakerStores, EnrichFields, FormValidatorFn } from './types.mjs';
interface FormulaOptions {
    defaultValues?: Record<string, unknown>;
    enrich?: EnrichFields;
    formValidators?: Record<string, FormValidatorFn>;
}
interface BeakerOptions extends Omit<FormulaOptions, 'defaultValues'> {
    defaultValues?: Record<string, unknown>[];
}
/**
 * Create the stores for the form instance
 */
export declare function createFormStores(options?: FormulaOptions, initialData?: Record<string, unknown>): FormulaStores;
/**
 * Create a group store which contains arrays of form store values
 */
export declare function createGroupStores(options?: BeakerOptions): BeakerStores;
export {};
