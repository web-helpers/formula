import type { FormulaStores } from '../shared/types.mjs';
/**
 * Return a map of store keys to event names (camelCase to kebab-case with form: prefix)
 */
export declare function eventsWithFormKeys(stores: FormulaStores): Map<string, string>;
