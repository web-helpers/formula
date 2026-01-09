import type { FormulaStores, BeakerStores, FormulaOptions, BeakerOptions } from './src/lib/shared/types.mjs';
import type { Formula } from './src/lib/form/form.mjs';
import type { Beaker } from './src/lib/group/group.mjs';
export { FormulaWebComponent } from './src/lib/webcomponent/index.mjs';
/**
 * A global map of stores for elements with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 */
export declare const formulaStores: Map<string, FormulaStores>;
/**
 * A global map of stores for beaker groups with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 */
export declare const beakerStores: Map<string, BeakerStores>;
/**
 * The `formula` function returns a form object that can be bound to any HTML
 * element that contains form inputs. Once bound you can get the current values
 */
export declare function formula(options?: FormulaOptions): Formula & FormulaStores;
/**
 * The beaker function returns an instance of a group of elements and their stores, it also provides methods
 * to set the group value store
 */
export declare function beaker(options?: BeakerOptions): Beaker & BeakerStores;
