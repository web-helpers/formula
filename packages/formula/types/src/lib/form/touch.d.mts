/**
 * Creates the handler for a group of elements for the touch event on the group name. Once an
 * element in the group has been touched, all element focus handlers will be removed.
 *
 * @private
 * @param {string} name - The name of the group to create the touch handlers for
 * @param {import('../shared/fields.mjs').FormEl[]} elements - The elements that belong to the named group
 * @param {import('../shared/stores.mjs').FormulaStores} stores - The stores for the form instance
 * @returns {() => void} Function that when called will remove all focus handlers from the elements, if not removed by user action
 */
export function createTouchHandlers(name: string, elements: import('../shared/fields.mjs').FormEl[], stores: import('../shared/stores.mjs').FormulaStores): () => void;
