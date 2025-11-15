/**
 * Creates a handler to set the dirty state for a group of elements. Once an
 * element in the group has been changed, all blur event listeners will be removed.
 *
 * @private
 *
 * @param {string} name - The name of the group to create the blur handlers for.
 * @param {import('../shared/fields.mjs').FormEl} elements - The elements that belong to the named group.
 * @param {import("../shared/stores.mjs").FormulaStores} stores - The stores for the form instance.
 *
 * @returns {() => void} - Function that when called will remove all blur event listeners from the elements, if not removed by user action.
 */
export function createDirtyHandler(name: string, elements: import('../shared/fields.mjs').FormEl, stores: import("../shared/stores.mjs").FormulaStores): () => void;
