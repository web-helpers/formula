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
export function formula(options?: FormulaOptions | undefined): Formula;
/**
 * The beaker function returns an instance of a group of elements and their stores, it also provides methods
 * to set the group value store
 *
 * @param {BeakerOptions} options
 *
 * @returns { Beaker } Beaker object containing the form group and it's associated methods
 */
export function beaker(options: BeakerOptions): Beaker;
/**
 * >} ValidationFn
 */
export type formulaStores = (value: unknown | unknown[]) => string | null;
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
export const formulaStores: Map<string, FormulaStores>;
/**
 * A global map of stores for beaker groups with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type Map<string, BeakerStores>
 */
export const beakerStores: Map<string, BeakerStores>;
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
    validators?: ValidationRules | undefined;
    /**
     * - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
     */
    enrich?: EnrichFields | undefined;
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
 * A single validation rule with the name of the rule and validation function
 */
export type ValidationRule = Record<string, ValidationFn>;
/**
 * Custom validation rules for Formula
 */
export type ValidationRules = Record<string, ValidationRule>;
/**
 * Enrich function is used with field data to generate an enrichment
 */
export type EnrichFn = (value: unknown | unknown[]) => unknown;
/**
 * A single validation rule with the name of the rule and validation function
 */
export type EnrichValue = Record<string, EnrichFn>;
/**
 * Custom validation rules for Formula
 */
export type EnrichFields = Record<string, EnrichValue>;
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
    stores: FormulaStores<T>;
};
