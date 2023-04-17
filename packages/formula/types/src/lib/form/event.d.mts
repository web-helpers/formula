/**
 * Update the value and error stores, also update form validity
 * @param {FormulaField} details
 * @param {FormulaStores} stores
 * @param {FormulaOptions} options
 * @param {Map<string, HTMLInputElement[]>} hiddenFields
 * @param {(value: unknown | unknown[]) => Record<string, unknown>} enrich
 */
export function valueUpdate(details: FormulaField, stores: FormulaStores, options: FormulaOptions, hiddenFields: Map<string, HTMLInputElement[]>, enrich: (value: unknown | unknown[]) => Record<string, unknown>): void;
export function createHandler(name: any, eventName: any, element: any, groupElements: any, stores: any, options: any, hiddenGroups: any): () => any;
/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param {FormulaStores<T>} stores
 * @param {HTMLFormElement} form
 */
export function createSubmitHandler(stores: FormulaStores<T>, form: HTMLFormElement): () => void;
