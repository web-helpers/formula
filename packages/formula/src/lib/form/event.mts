import { createFieldExtract } from './extract.mjs';
import { createEnrichField } from './enrichment.mjs';
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
 * Do validation on the form and set the form validity state
 */
function formValidation(formValidators: Record<string, FormValidatorFn>, stores: FormulaStores): void {
  const currentValues = stores.formValues.get();
  stores.formValidity.set({});
  const validators = Object.entries(formValidators);

  const invalidStates: Record<string, string> = {};
  for (const [name, validator] of validators) {
    const invalid = validator(currentValues);
    if (invalid !== null) {
      invalidStates[name] = invalid;
    }
  }

  if (Object.keys(invalidStates).length > 0) {
    stores.formValidity.set(invalidStates);
    stores.formValid.set(false);
  }
}

/**
 * Update the value and error stores, also update form validity
 */
export function valueUpdate(
  details: FieldExtractResult,
  stores: FormulaStores,
  options: EventOptions | undefined,
  hiddenFields: Map<string, FormElement[]>,
  enrich?: (value: unknown) => Record<string, unknown>
): void {
  const { name, value, ...validity } = details;

  stores.formValues.set({ ...stores.formValues.get(), [name]: value });
  
  if (hiddenFields.size) {
    const state = { ...stores.formValues.get() };
    hiddenFields.forEach((group, name) => {
      state[name] = group.length > 1 ? group.map((e) => e.value) : group[0].value;
    });
    stores.formValues.set(state);
  }

  stores.errors.set({ ...stores.errors.get(), [name]: validity });
  stores.formValid.set(Object.values(stores.errors.get()).every((v) => v.valid));
  
  if (options?.formValidators) {
    formValidation(options.formValidators, stores);
  }
  
  if (enrich) {
    stores.enrichment.set({ ...stores.enrichment.get(), [name]: enrich(value) });
  }
  
  if (typeof options?.postChanges === 'function') {
    options.postChanges(stores.formValues.get());
  }
}

/**
 * Creates an event handler for the passed element with its data handler
 */
function createHandlerForData(
  extractor: (el: FormElement) => FieldExtractResult,
  stores: FormulaStores,
  options: EventOptions | undefined,
  hiddenFields: Map<string, FormElement[]>,
  enrich?: (value: unknown) => Record<string, unknown>
): (event: Event) => void {
  return (event: Event) => {
    const el = (event?.currentTarget ?? event?.target) as FormElement;
    const extracted = extractor(el);
    if (typeof options?.preChanges === 'function') {
      options.preChanges(extracted);
    }
    valueUpdate(extracted, stores, options, hiddenFields, enrich);
  };
}

/**
 * Creates an event handler for the passed element with its data handler
 */
export function createHandler(
  name: string,
  eventName: string,
  element: FormElement,
  groupElements: FormElement[],
  stores: FormulaStores,
  options: EventOptions | undefined,
  hiddenGroups: Map<string, FormElement[]>
): () => void {
  const extract = createFieldExtract(name, groupElements, stores, options);
  let enrich: ((value: unknown) => Record<string, unknown>) | undefined;
  if (options?.enrich?.[name]) {
    enrich = createEnrichField(name, options);
  }
  const handler = createHandlerForData(extract, stores, options, hiddenGroups, enrich);
  element.addEventListener(eventName, handler);
  return () => element.removeEventListener(eventName, handler);
}

/**
 * Create a handler for a form element submission
 */
export function createSubmitHandler(stores: FormulaStores, form: HTMLFormElement): () => void {
  return () => {
    if (!form.noValidate) form.reportValidity();

    stores.formValues.subscribe((v) => stores.submitValues.set(v))();
  };
}
