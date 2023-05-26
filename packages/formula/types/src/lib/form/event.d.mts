/**
 * Update the value and error stores, also update form validity
 * @param {FormulaField} details
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
 * @param {Map<string, HTMLInputElement[]>} hiddenFields
 * @param {(value: unknown | unknown[]) => Record<string, unknown>} enrich
 */
export function valueUpdate(
  details: FormulaField,
  stores: import('../shared/stores.mjs').FormulaStores,
  options: import('./form.mjs').FormulaOptions,
  hiddenFields: Map<string, HTMLInputElement[]>,
  enrich: (value: unknown | unknown[]) => Record<string, unknown>
): void;
/**
 * Creates an event handler for the passed element with it's data handler and returns a function
 * to remove it
 * @param {string} name
 * @param {string} eventName
 * @param {import('../shared/fields.mjs').FormEl} element
 * @param {import('../shared/fields.mjs').FormEl[]} groupElements
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
 * @param {HTMLInputElement[]} hiddenGroups
 * @returns {() => void)} Function to remove the event listener
 */
export function createHandler(
  name: string,
  eventName: string,
  element: import('../shared/fields.mjs').FormEl,
  groupElements: import('../shared/fields.mjs').FormEl[],
  stores: import('../shared/stores.mjs').FormulaStores,
  options: import('./form.mjs').FormulaOptions,
  hiddenGroups: HTMLInputElement[]
): () => void;
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
  'message-': string;
  /**
   * - The errors from the {@link https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation|Contraint Validation API}
   */
  errors: Record<string, boolean>;
};
export type FormulaField = FormulaError;
