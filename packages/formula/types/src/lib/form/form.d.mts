/**
 * Optional settings for Formula - by providing these options the state of the form can be set up as an initial state, along with custom validation and enrichment rules.
 * @typedef {object} FormulaOptions
 * @property {Record<string, Record<string, string>=} messages - Provide customised messages to the application, these messages replace the default browser messages for the provided error types and are useful for internationalisation or custom domain messages
 * @property {import('./errors.mjs').ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {import('./errors.mjs').ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {import('./enrichment.mjs').EnrichFields=} enrich - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
 * @property {Record<string, any>=} defaultValues - Default values are used as initial values for the form fields if there is no value already set on the form
 * @property {() => void=} preChanges -Method called as soon as a change has been detected, before any values are read or stores are updated
 * @property {(values: Record<string, any>) => void=} postChanges - Method called after all updates to the stores have been made
 */
/**
 * The Formula form object, this is returned from the `formula.init` method and is the DOM instance of the form
 * @typedef {object} Formula
 * @property {(node: HTMLElement) => { elements: HTMLElement[], destroy: () => void }} init
 * @property {(updatedOpts?: import('./src/lib/form/form.mjs').FormulaOptions) => void} updateForm
 * @property {() => void} destroyForm
 * @property {() => void} resetForm
 * @property {import('../shared/stores.mjs').FormulaStores} stores
 */
/**
 * @typedef {object} FormulaForm
 * @property {HTMLElement} node
 * @property {HTMLElement[]} elements
 * @property {() => void} destroy
 */
/**
 * Creates the form action
 * @param {FormulaOptions} options
 * @param {Map<string, import('../shared/stores.mjs').FormulaStores>} globalStore
 * @param {string} groupName
 * @param {Record<string, any>} initialData
 * @returns {Formula}
 */
export function createForm(
  options: FormulaOptions,
  globalStore: Map<string, import("../shared/stores.mjs").FormulaStores>,
  groupName: string,
  initialData: Record<string, any>
): Formula;
/**
 * Optional settings for Formula - by providing these options the state of the form can be set up as an initial state, along with custom validation and enrichment rules.
 */
export type FormulaOptions = {
  /**
   * - Provide customised messages to the application, these messages replace the default browser messages for the provided error types and are useful for internationalisation or custom domain messages
   */
  messages?: Record<string, Record<string, string>> | undefined;
  /**
   * - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
   */
  validators?: import("./errors.mjs").ValidationRules | undefined;
  /**
   * - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
   */
  enrich?: import("./enrichment.mjs").EnrichFields | undefined;
  /**
   * - Default values are used as initial values for the form fields if there is no value already set on the form
   */
  defaultValues?: Record<string, any> | undefined;
  /**
   * -Method called as soon as a change has been detected, before any values are read or stores are updated
   */
  preChanges?: (() => void) | undefined;
  /**
   * - Method called after all updates to the stores have been made
   */
  postChanges?: ((values: Record<string, any>) => void) | undefined;
};
/**
 * The Formula form object, this is returned from the `formula.init` method and is the DOM instance of the form
 */
export type Formula = {
  init: (node: HTMLElement) => {
    elements: HTMLElement[];
    destroy: () => void;
  };
  updateForm: (updatedOpts?: any) => void;
  destroyForm: () => void;
  resetForm: () => void;
  stores: import("../shared/stores.mjs").FormulaStores;
};
export type FormulaForm = {
  node: HTMLElement;
  elements: HTMLElement[];
  destroy: () => void;
};
