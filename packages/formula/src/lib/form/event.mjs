import { createFieldExtract } from './extract.mjs';
import { createEnrichField } from './enrichment.mjs';

/**
 * @typedef { object } FormulaError
 * @property { boolean } valid - If the field is valid
 * @property { boolean } invalid - If the field is invalid
 * @property { string } message- The message returned from the HTML element
 * @property { Record<string, boolean> } errors - The errors from the {@link https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation|Contraint Validation API}
 */

/**
 * @typedef { FormulaError } FormulaField
 * @property { string } name - The name of the field being handled
 * @property { unknown | unknown[] } value - The value of the field being handled
 */

/**
 * Do validation on the form and set the form validity state and set the form to invalid if there
 * are any form validations
 * @param {Record<string, import('./errors.mjs').ValidationFn>} formValidators
 * @param {import('../shared/stores.mjs').FormulaStores} stores
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
    stores.formValid.set(false);
  }
}

/**
 * Update the value and error stores, also update form validity
 * @param {FormulaField} details
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
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
  stores.formValid.set(
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
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
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
      const el = event?.currentTarget ?? event?.target;
      const extracted = extractor(el);
      valueUpdate(extracted, stores, options, hiddenFields, enrich);
  };
}

/**
 * Creates an event handler for the passed element with it's data handler and returns a function
 * to remove it
 * @param {string} name 
 * @param {string} eventName 
 * @param {import('../shared/fields.mjs').FormEl} element 
 * @param {import('../shared/fields.mjs').FormEl[]} groupElements 
 * @param {import('../shared/stores.mjs').FormulaStores} stores 
 * @param {import('./form.mjs').FormulaOptions} options 
 * @param {HTMLInputElement[]} hiddenGroups 
 * @returns {() => void)} Function to remove the event listener
 */
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
  element.addEventListener(eventName, (event) => {
    if (typeof options?.preChanges === 'function') options.preChanges();
    handler(event);
  });
  return () => element.removeEventListener(eventName, handler);
}

/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {HTMLFormElement} form
 */
export function createSubmitHandler(stores, form) {
  return () => {
    if (!form.noValidate) form.reportValidity();

    stores.formValues.subscribe(
      /**
       * @param {any} v
       */
      (v) => stores.submitValues.set(v)
    )();
  };
}
