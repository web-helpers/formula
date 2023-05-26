/**
 * Create a data handler for any type of input field
 * @param {string} name
 * @param {import('../shared/fields.mjs').FormEl[]} elementGroup
 * @param {import('./form.mjs').FormulaOptions} options
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 */
export function createFieldExtract(
  name: string,
  elementGroup: import('../shared/fields.mjs').FormEl[],
  options: import('./form.mjs').FormulaOptions,
  stores: import('../shared/stores.mjs').FormulaStores
): (element?: any, isInit?: any, isReset?: any) => any;
