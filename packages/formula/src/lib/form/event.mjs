import { createFieldExtract } from './extract';
import { createEnrichField } from './enrichment';

/**
 * Do validation on the form and set the form validity state and set the form to invalid if there
 * are any form validations
 * @param {Record<string, ValidationFn>} formValidators
 * @param {FormulaStores} stores
 */
function formValidation(formValidators, stores) {
  const currentValues = stores.formValues.get();
  stores.formValidity.set({});
  const validators = Object.entries(formValidators);

  const invalidStates = {};
  for (const [name, validator] of validators) {
    const invalid = validator(currentValues);
    if (invalid !== null) {
      invalidStates[name] = invalid;
    }
  }

  if (Object.keys(invalidStates).length > 0) {
    stores.formValidity.set(invalidStates);
    stores.isFormValid.set(false);
  }
}

/**
 * Update the value and error stores, also update form validity
 * @param {FormulaField} details
 * @param {FormulaStores} stores
 * @param {FormulaOptions} options
 * @param {Map<string, HTMLInputElement[]>} hiddenFields
 * @param {(value: unknown | unknown[]) => Record<string, unknown>} enrich
 */
export function valueUpdate(details, stores, options, hiddenFields, enrich) {
  const { name, value, ...validity } = details;

  stores.formValues.set({ ...stores.formValues.get(), [name]: value });
  if (hiddenFields.size) {
    const state = stores.formValues.get();

    hiddenFields.forEach(
      (group, name) =>
        (state[name] =
          group.length > 1 ? group.map((e) => e.value) : group[0].value)
    );
    stores.formValues.set(state);
  }

  stores.validity.set({ ...stores.validity.get(), [name]: validity });
  stores.isFormValid.set(
    Object.values(stores.validity.get()).every((v) => v.valid)
  );
  if (options?.formValidators) {
    formValidation(options.formValidators, stores);
  }
  if (enrich) {
    stores.enrichment.set({ [name]: enrich(value) });
  }
  if (typeof options?.postChanges === 'function') {
    options.postChanges(stores.formValues.get());
  }
}

/**
 * Creates an event handler for the passed element with it's data handler
 * @param {(el) => FormulaField} extractor
 * @param {FormulaStores<any>} stores
 * @param {FormulaOptions} options
 * @param {Map<string, HTMLInputElement[]>} hiddenFields
 * @param { (value: unknown | unknown[]) => Record<string, unknown>} enrich
 */
function createHandlerForData(
  extractor,
  stores,
  options,
  hiddenFields,
  enrich
) {
  return (event) => {
    if (typeof options?.preChanges === 'function') options.preChanges();
    setTimeout(() => {
      const el = event.currentTarget || event.target;
      valueUpdate(extractor(el), stores, options, hiddenFields, enrich);
    }, 0);
  };
}

export function createHandler(
  name,
  eventName,
  element,
  groupElements,
  stores,
  options,
  hiddenGroups
) {
  const extract = createFieldExtract(name, groupElements, options, stores);
  let enrich;
  if (options?.enrich?.[name]) enrich = createEnrichField(name, options);
  const handler = createHandlerForData(
    extract,
    stores,
    options,
    hiddenGroups,
    enrich
  );
  element.addEventListener(eventName, handler);
  return () => element.removeEventListener(eventName, handler);
}

/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param {FormulaStores<T>} stores
 * @param {HTMLFormElement} form
 */
export function createSubmitHandler(stores, form) {
  return () => {
    if (!form.noValidate) form.reportValidity();
    stores.formValues.subscribe((v) => stores.submitValues.set(v))();
  };
}
