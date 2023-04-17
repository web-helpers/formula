import { createForm } from './src/lib/form/form.mjs';
import { createGroup } from './src/lib/group/group.mjs';

/**
 * Optional settings for Formula - by providing these options the state of the form can be set up as an initial state, along with custom validation and enrichment rules.
 * @typedef {object} FormulaOptions
 * @property {Record<string, Record<string, string>=} messages - Provide customised messages to the application, these messages replace the default browser messages for the provided error types and are useful for internationalisation or custom domain messages
 * @property {ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {EnrichFields=} enrich - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
 * @property {Record<string, any>=} defaultValues - Default values are used as initial values for the form fields if there is no value already set on the form
 * @property {() => void=} preChanges -Method called as soon as a change has been detected, before any values are read or stores are updated
 * @property {(values: Record<string, any>) => void=} postChanges - Method called after all updates to the stores have been made
 */

/**
 * A validation function, it should return null if there is no error, or a string if there is an error
 * @typedef {(value: unknown | unknown[]) => string | null>} ValidationFn
 */

/**
 * A single validation rule with the name of the rule and validation function
 * @typedef {Record<string, ValidationFn>} ValidationRule
 */

/**
 * Custom validation rules for Formula
 * @typedef {Record<string, ValidationRule>} ValidationRules
 */

/**
 * Enrich function is used with field data to generate an enrichment
 * @typedef {(value: unknown | unknown[]) => unknown} EnrichFn
 */

/**
 * A single validation rule with the name of the rule and validation function
 * @typedef {Record<string, EnrichFn>} EnrichValue
 */

/**
 * Custom validation rules for Formula
 * @typedef {Record<string, EnrichValue>} EnrichFields
 */

/**
 * The Formula form object, this is returned from the `formula.init` method and is the DOM instance of the form
 * @typedef {object} Formula
 * @property {(node: HTMLElement) => { elements: HTMLElement[], destroy: () => void }} init 
 * @property {(updatedOpts?: FormulaOptions<T>) => void} updateForm
 * @property {() => void} destroyForm
 * @property {() => void} resetForm
 * @property {FormulaStores<T>} stores
 */

/**
 * A global map of stores for elements with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type Map<string, FormulaStores>
 */
export const formulaStores = new Map();

/**
 * A global map of stores for beaker groups with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type Map<string, BeakerStores>
 */
export const beakerStores = new Map();

/**
 * The `formula` function returns a form object that can be bound to any HTML
 * element that contains form inputs.  Once bound you can get the current values
 *
 * @param {FormulaOptions=} options Optional options that the library supports, none of these options are
 * required to use Formula
 *
 * @returns { Formula } Formula object containing the current form, function to update or destroy
 * the form and all the stores available for the form
 */
export function formula(options) {
  return createForm(options, formulaStores);
}

/**
 * The beaker function returns an instance of a group of elements and their stores, it also provides methods
 * to set the group value store
 *
 * @param {BeakerOptions} options
 *
 * @returns { Beaker } Beaker object containing the form group and it's associated methods
 */
export function beaker(options) {
  return createGroup(options, beakerStores);
}
