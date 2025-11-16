import type { Atom, MapStore } from 'nanostores';

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
  formValid: Atom<boolean>;
  formReady: Atom<boolean>;
}

/**
 * A set of stores used by Beaker to store the current state
 */
export interface BeakerStores {
  formValues: Atom<Record<string, unknown>[]>;
  submitValues: Atom<Record<string, unknown>[]>;
  initialValues: Atom<Record<string, unknown>[]>;
  touched: Atom<Record<string, boolean>[]>;
  dirty: Atom<Record<string, boolean>[]>;
  errors: Atom<Record<string, FieldValidity>[]>;
  formValidity: Atom<Record<string, string>[]>;
  enrichment: Atom<Record<string, Record<string, unknown>>[]>;
  formValid: Atom<boolean>;
  formReady: Atom<boolean>;
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
export type FormValidatorFn = (values: Record<string, unknown>) => string;

/**
 * Custom messages for validation errors
 */
export type ValidationMessages = Record<string, Record<string, string>>;
