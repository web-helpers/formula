import { createForm } from './src/lib/form/form.mjs';
import { createGroup } from './src/lib/group/group.mjs';

export { FormulaWebComponent } from './src/lib/webcomponent/index.mjs';

/**
 * A global map of stores for elements with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type {Map<string, import('./src/lib/shared/stores.mjs').FormulaStores>}
 */
export const formulaStores = new Map();

/**
 * A global map of stores for beaker groups with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type {Map<string, import('./src/lib/shared/stores.mjs').BeakerStores>}
 */
export const beakerStores = new Map();

/**
 * The `formula` function returns a form object that can be bound to any HTML
 * element that contains form inputs.  Once bound you can get the current values
 *
 * @param {import('./src/lib/form/form.mjs').FormulaOptions=} options Optional options that the library supports, none of these options are
 * required to use Formula
 *
 * @returns { import('./src/lib/form/form.mjs').Formula } Formula object containing the current form, function to update or destroy
 * the form and all the stores available for the form
 */
export function formula(options) {
  return createForm(options, formulaStores);
}

/**
 * The beaker function returns an instance of a group of elements and their stores, it also provides methods
 * to set the group value store
 *
 * @param {import('./src/lib/group/group.mjs').BeakerOptions=} options
 *
 * @returns { import ('./src/lib/shared/stores.mjs').BeakerStores } Beaker object containing the form group and it's associated methods
 */
export function beaker(options) {
  return createGroup(options, beakerStores);
}
