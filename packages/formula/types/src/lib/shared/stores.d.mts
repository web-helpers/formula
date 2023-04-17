/**
 * Create the stores for the the form instance, these can be set using the `defaultValue` property
 * of FormulaOptions
 * @param {import('../form/form.mjs').FormulaOptions=} options
 * @param {Record<string, any>=} initialData
 *
 * @returns {FormulaStores} An object containing the stores for the form instance
 */
export function createFormStores(options?: import('../form/form.mjs').FormulaOptions | undefined, initialData?: Record<string, any> | undefined): FormulaStores;
/**
 * Create a group store which contains arrays of form store values
 * @param {import('../group/group.mjs').BeakerOptions=} options
 * @returns {BeakerStores}
 */
export function createGroupStores(options?: import('../group/group.mjs').BeakerOptions | undefined): BeakerStores;
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
/**
 * A set of stores used by Formula to store the current state
 */
export type BeakerStores = {
    formValues: import('nanostores').Atom;
    submitValues: import('nanostores').Atom;
    initialValues: import('nanostores').Atom;
    touched: import('nanostores').Atom;
    dirty: import('nanostores').Atom;
    validity: import('nanostores').Atom;
    formValidity: import('nanostores').Atom;
    enrichment: import('nanostores').Atom;
    isFormValid: import('nanostores').Atom;
    isFormReady: import('nanostores').Atom;
};
