/**
 * Create the form reset method
 * @param {HTMLElement} node
 * @param {[string, import('../shared/fields.mjs').FormEl[]][]} allGroups
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 * @param {import('./form.mjs').FormulaOptions} options
 */
export function createReset(
  node: HTMLElement,
  allGroups: [string, import('../shared/fields.mjs').FormEl[]][],
  stores: import('../shared/stores.mjs').FormulaStores,
  options: import('./form.mjs').FormulaOptions
): () => void;
