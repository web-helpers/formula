import { createFieldExtract } from './extract.mjs';
import { createEnrichField } from './enrichment.mjs';
import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores, FieldValidity, EnrichFields } from '../shared/types.mjs';

interface InitOptions {
  defaultValues?: Record<string, unknown>;
  enrich?: EnrichFields;
}

/**
 * Initialise the stores with data from the form
 */
function getInitialFormValues(
  node: HTMLElement,
  allGroups: [string, FormElement[]][],
  stores: FormulaStores,
  options?: InitOptions
): [Record<string, unknown>, Record<string, FieldValidity>, Record<string, Record<string, unknown>>] {
  const formValues: Record<string, unknown> = {};
  const validityValues: Record<string, FieldValidity> = {};
  const enrichmentValues: Record<string, Record<string, unknown>> = {};

  for (const [key, elements] of allGroups) {
    const extract = createFieldExtract(key, elements, stores, options);
    const { name, value, ...validity } = extract(elements[0], true, false);
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
  stores.formValid.set(Object.values(validityValues).every((v) => v.valid));
  stores.enrichment.set({ ...enrichmentValues });

  return [formValues, validityValues, enrichmentValues];
}

/**
 * Create the form reset method
 */
export function createReset(
  node: HTMLElement,
  allGroups: [string, FormElement[]][],
  stores: FormulaStores,
  options?: InitOptions
): () => void {
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
      const extract = createFieldExtract(key, elements, stores, options);
      extract(elements[0], false, true);
    }
  };
}
