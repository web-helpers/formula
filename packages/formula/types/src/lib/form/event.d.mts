/**
 * Update the value and error stores, also update form validity
 * @param {FormulaField} details
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
 * @param {Map<string, HTMLInputElement[]>} hiddenFields
 * @param {(value: unknown | unknown[]) => Record<string, unknown>} enrich
 */
export function valueUpdate(details: FormulaField, stores: import('../shared/stores.mjs').FormulaStores, options: import('./form.mjs').FormulaOptions, hiddenFields: Map<string, HTMLInputElement[]>, enrich: (value: unknown | unknown[]) => Record<string, unknown>): void;
export function createHandler(name: any, eventName: any, element: any, groupElements: any, stores: any, options: any, hiddenGroups: any): () => any;
/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {HTMLFormElement} form
 */
export function createSubmitHandler(stores: import('../shared/stores.mjs').FormulaStores, form: HTMLFormElement): () => void;
export type FormulaError = {
    /**
     * - If the field is valid
     */
    valid: boolean;
    /**
     * - If the field is invalid
     */
    invalid: boolean;
    /**
     * The message returned from the HTML element
     */
    "message-": string;
    /**
     * - The errors from the {@link https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation|Contraint Validation API}
     */
    errors: Record<string, boolean>;
};
export type FormulaField = FormulaError;
