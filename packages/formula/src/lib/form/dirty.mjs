/**
 * Check if two arrays have the same elements, regardless of the order.
 * @param {unknown[]} array1
 * @param {unknown[]} array2
 */
const matchingArrays = (array1, array2) => array1.length === array2.length && array1.every((e) => array2.includes(e));

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
export function createDirtyHandler(name, elements, stores) {
  const elementHandlers = new Map();
  const initialValues = new Map();

  const setDirtyAndStopListening = () => {
    for (const [el, handler] of elementHandlers) {
      el.setAttribute('data-formula-dirty', 'true');
      el.removeEventListener('blur', handler);
    }
    elementHandlers.clear();
  };

  // Set initial dirty state and initial value
  stores.dirty.set({ ...stores.dirty.get(), [name]: false });
  stores.formValues.subscribe((v) => initialValues.set(name, v[name]))();

  function createElementHandler(groupName) {
    return () => {
      const startValue = initialValues.get(groupName);
      const currentValues = stores.formValues.get();

      const isDirty = Array.isArray(currentValues[groupName]) ? !matchingArrays(currentValues[groupName], startValue) : currentValues[groupName] !== startValue;

      if (isDirty) {
        stores.dirty.set({ ...stores.dirty.get(), [groupName]: true });
        setDirtyAndStopListening();
      }
    };
  }

  for (const el of elements) {
    const handler = createElementHandler(name);
    el.addEventListener('blur', handler);
    elementHandlers.set(el, handler);
  }

  return setDirtyAndStopListening;
}
