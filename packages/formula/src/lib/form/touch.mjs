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
export function createTouchHandlers(name, elements, stores) {
  const elementHandlers = new Map();

  const destroy = () => {
    for (const [el, handler] of elementHandlers) {
      el.setAttribute('data-formula-touched', 'true');
      el.removeEventListener('focus', handler);
    }
    elementHandlers.clear();
  };

  stores.touched.set({ ...stores.touched.get(), [name]: false });

  const createElementHandler = () => {
    return () => {
      stores.touched.set({ ...stores.touched.get(), [name]: true });
      destroy();
    };
  };

  for (const el of elements) {
    const handler = createElementHandler();
    el.addEventListener('focus', handler);
    elementHandlers.set(el, handler);
  }

  return destroy;
}
