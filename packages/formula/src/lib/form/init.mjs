import { createFieldExtract } from './extract.mjs';
import { createEnrichField } from './enrichment.mjs';

/**
 * Initialise the stores with data from the form, it will also use any default values provided
 * @param {HTMLElement} node
 * @param {[string, import('../shared/fields.mjs').FormEl[]][]} allGroups
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
 * @returns {[Record<string, unknown | unknown[]>, Record<string, FormulaError>, Record<string, Record<string, unknown>>]}
 */
function getInitialFormValues(node, allGroups, stores, options) {
  /**
   * @type {Record<string, unknown | unknown[]>}
   */
  const formValues = {};

  /**
   * @type {Record<string, FormulaError>}
   */
  const validityValues = {};

  /**
   * @type {Record<string, Record<string, unknown>>}
   */
  const enrichmentValues = {};
  for (const [key, elements] of allGroups) {
    const extract = createFieldExtract(key, elements, options, stores);
    const { name, value, ...validity } = extract(elements[0], true);
    formValues[name] = value;
    validityValues[name] = validity;
    if (options?.enrich?.[name]) {
      const enrich = createEnrichField(name, options);
      enrichmentValues[name] = enrich(value);
    }
  }
  stores.formValues.set({ ...formValues });
  stores.initialValues.set({ ...formValues });
  stores.errors.set({ ...validityValues });
  stores.formValid.set(Object.values({ ...validityValues }).every((v) => v.valid));
  stores.enrichment.set({ ...enrichmentValues });

  return [formValues, validityValues, enrichmentValues];
}

/**
 * Create the form reset method
 * @param {HTMLElement} node
 * @param {[string, import('../shared/fields.mjs').FormEl[]][]} allGroups
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
 */
export function createReset(node, allGroups, stores, options) {
  const [formValues, validityValues, enrichmentValues] = getInitialFormValues(node, allGroups, stores, options);
  /**
   * Resets the form to the initial values
   */
  return () => {
    stores.formValues.set(formValues);
    stores.errors.set(validityValues);
    stores.formValid.set(Object.values(validityValues).every((v) => v.valid));
    stores.enrichment.set(enrichmentValues);
    // Also override touched and dirty
    stores.touched.set(Object.keys(formValues).reduce((val, key) => ({ ...val, [key]: false }), {}));
    stores.dirty.set(Object.keys(formValues).reduce((val, key) => ({ ...val, [key]: false }), {}));

    // Update the elements
    for (const [key, elements] of allGroups) {
      const extract = createFieldExtract(key, elements, options, stores);
      extract(elements[0], false, true);
    }
  };
}
