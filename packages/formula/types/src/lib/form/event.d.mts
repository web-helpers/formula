import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores, FieldValidity, FormValidatorFn, EnrichFields } from '../shared/types.mjs';
interface EventOptions {
  formValidators?: Record<string, FormValidatorFn>;
  enrich?: EnrichFields;
  preChanges?: (extracted: FieldExtractResult) => void;
  postChanges?: (values: Record<string, unknown>) => void;
}
interface FieldExtractResult extends FieldValidity {
  name: string;
  value: unknown;
}
/**
 * Update the value and error stores, also update form validity
 */
export declare function valueUpdate(
  details: FieldExtractResult,
  stores: FormulaStores,
  options: EventOptions | undefined,
  hiddenFields: Map<string, FormElement[]>,
  enrich?: (value: unknown) => Record<string, unknown>,
): void;
/**
 * Creates an event handler for the passed element with its data handler
 */
export declare function createHandler(
  name: string,
  eventName: string,
  element: FormElement,
  groupElements: FormElement[],
  stores: FormulaStores,
  options: EventOptions | undefined,
  hiddenGroups: Map<string, FormElement[]>,
): () => void;
/**
 * Create a handler for a form element submission
 */
export declare function createSubmitHandler(stores: FormulaStores, form: HTMLFormElement): () => void;
export {};
