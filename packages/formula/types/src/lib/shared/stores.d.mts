/**
 * Create the stores for the the form instance, these can be set using the `defaultValue` property
 * of FormulaOptions
 * @param {FormulaOptions} options
 * @param {any} initialData
 *
 * @returns {FormulaStores} An object containing the stores for the form instance
 */
export function createFormStores(options: FormulaOptions, initialData: any): FormulaStores;
/**
 * Create a group store which contains arrays of form store values
 * @param {BeakerOptions} options
 * @returns {BeakerStores<T>}
 */
export function createGroupStores(options: BeakerOptions): BeakerStores<T>;
/**
 * A set of stores used by Formula to store the current state
 */
export type FormulaStores = {
    formValues: import('nanostores').MapStore;
    submitValues: import('nanostores').MapStore;
    initialValues: import('nanostores').MapStore;
    touched: import('nanostores').MapStore;
    dirty: import('nanostores').MapStore;
    validity: import('nanostores').MapStore;
    formValidity: import('nanostores').MapStore;
    enrichment: import('nanostores').MapStore;
    isFormValid: import('nanostores').Atom;
    isFormReady: import('nanostores').Atom;
};
