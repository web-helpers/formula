/**
 * Creates the handler for a group of elements for the touch event on the group name. Once an
 * element in the group has been touched, all element focus handlers will be removed.
 *
 * @private
 * @param {string} name - The name of the group to create the touch handlers for
 * @param {FormEl[]} elements - The elements that belong to the named group
 * @param {FormulaStores} stores - The stores for the form instance
 * @returns {() => void} Function that when called will remove all focus handlers from the elements, if not removed by user action
 */
export function createTouchHandlers(name: string, elements: FormEl[], stores: FormulaStores): () => void;
//# sourceMappingURL=touch.d.mts.map