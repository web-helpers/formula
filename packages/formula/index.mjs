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
 * Optional settings to configure Formula when it initialises
 * @typedef {Record<string, any>} FormulaOptions
 * @property {Record<string, Record<string, string>=} messages - Provide customised messages to the application, these messages replace the default browser messages for the provided error types and are useful for internationalisation or custom domain messages
 * @property {ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {EnrichFields=} enrich - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
 * @property {Record<string, any>=} defaultValues - Default values are used as initial values for the form fields if there is no value already set on the form
 * @property {() => void} preChanges -Method called as soon as a change has been detected, before any values are read or stores are updated
 * @property {(values: Record<string, any>) => void} postChanges - Method called after all updates to the stores have been made
 */

/**
 * The main Formula object, returned from the `formula` function
 * @typedef {Record<string, any>} Formula
 * @property {(node: HTMLElement) => { destroy: () => void }} form
 * @property {(updatedOpts?: FormulaOptions<T>) => void} updateForm
 * @property {() => void} destroyForm
 * @property {() => void} resetForm
 * @property {FormulaStores<T>} stores
 */
