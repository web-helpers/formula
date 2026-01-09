import type { WritableAtom, MapStore } from 'nanostores';
/**
 * A set of stores used by Formula to store the current state
 */
export interface FormulaStores {
    formValues: MapStore<Record<string, unknown>>;
    submitValues: MapStore<Record<string, unknown>>;
    initialValues: MapStore<Record<string, unknown>>;
    touched: MapStore<Record<string, boolean>>;
    dirty: MapStore<Record<string, boolean>>;
    errors: MapStore<Record<string, FieldValidity>>;
    formValidity: MapStore<Record<string, string>>;
    enrichment: MapStore<Record<string, Record<string, unknown>>>;
    formValid: WritableAtom<boolean>;
    formReady: WritableAtom<boolean>;
}
/**
 * A set of stores used by Beaker to store the current state
 */
export interface BeakerStores {
    formValues: WritableAtom<Record<string, unknown>[]>;
    submitValues: WritableAtom<Record<string, unknown>[]>;
    initialValues: WritableAtom<Record<string, unknown>[]>;
    touched: WritableAtom<Record<string, boolean>[]>;
    dirty: WritableAtom<Record<string, boolean>[]>;
    errors: WritableAtom<Record<string, FieldValidity>[]>;
    formValidity: WritableAtom<Record<string, string>[]>;
    enrichment: WritableAtom<Record<string, Record<string, unknown>>[]>;
    formValid: WritableAtom<boolean>;
    formReady: WritableAtom<boolean>;
    [key: string]: WritableAtom<unknown>;
}
/**
 * Validity information for a field
 */
export interface FieldValidity {
    valid: boolean;
    invalid: boolean;
    message: string;
    errors: Record<string, string>;
}
/**
 * Validation function that returns error message or null
 */
export type ValidatorFn = (value: unknown, values: Record<string, unknown>) => string | null;
/**
 * Validation rules for fields
 */
export type ValidationRules = Record<string, Record<string, ValidatorFn>>;
/**
 * Enrichment function that transforms a value
 */
export type EnricherFn = (value: unknown) => unknown;
/**
 * Enrichment configuration for fields
 */
export type EnrichFields = Record<string, Record<string, EnricherFn>>;
/**
 * Form validator function
 */
export type FormValidatorFn = (values: Record<string, unknown>) => string | null;
/**
 * Custom messages for validation errors
 */
export type ValidationMessages = Record<string, Record<string, string>>;
/**
 * Optional settings for Formula - providing these options sets up the form's initial state,
 * along with custom validation and enrichment rules
 */
export interface FormulaOptions {
    messages?: ValidationMessages;
    validators?: ValidationRules;
    enrich?: EnrichFields;
    defaultValues?: Record<string, unknown>;
    preChanges?: () => void;
    postChanges?: (values: Record<string, unknown>) => void;
}
/**
 * Optional settings for Beaker - providing these options sets up the group's initial state,
 * along with custom validation and enrichment rules
 */
export interface BeakerOptions {
    messages?: ValidationMessages;
    validators?: ValidationRules;
    enrich?: EnrichFields;
    defaultValues?: Array<Record<string, unknown>>;
}
/**
 * Form element types that can be used in forms
 */
export type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
