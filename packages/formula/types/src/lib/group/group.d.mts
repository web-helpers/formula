/**
 * Creates a group, which is a collection of forms for row data
 * @param {BeakerOptions} options
 * @param {Map<string, import('../shared/stores.mjs').BeakerStores>} beakerStores
 * @returns {Beaker}
 */
export function createGroup(
  options: BeakerOptions,
  beakerStores: Map<string, import("../shared/stores.mjs").BeakerStores>
): Beaker;
/**
 * Optional settings for Beaker - by providing these options the state of the form can be set up as an initial state, along with custom validation and enrichment rules.
 */
export type BeakerOptions = {
  /**
   * - Provide customised messages to the application, these messages replace the default browser messages for the provided error types and are useful for internationalisation or custom domain messages
   */
  messages?: Record<string, Record<string, string>> | undefined;
  /**
   * - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
   */
  validators?: import("../form/errors.mjs").ValidationRules | undefined;
  /**
   * - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
   */
  enrich?: import("../form/enrichment.mjs").EnrichFields | undefined;
  /**
   * - Default values are used as initial values for the form fields if there is no value already set on the form
   */
  defaultValues?: Record<string, any> | undefined;
};
export type Beaker = {
  /**
   * - Creates a group of forms
   */
  group: Function;
  /**
   * - Updates the options for the group
   */
  update: Function;
  /**
   * - Destroys the group
   */
  destroy: Function;
  /**
   * - A map of the forms in the group
   */
  forms: Map<any, any>;
  /**
   * - A map of the stores in the group
   */
  stores: Map<any, any>;
  /**
   * - Initialises the group with the provided data
   */
  init: Function;
  /**
   * - Adds a new row to the group
   */
  add: Function;
  /**
   * - Sets the row at the provided index
   */
  set: Function;
  /**
   * - Removes the row at the provided index
   */
  delete: Function;
};
