import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores } from '../shared/types.mjs';

/**
 * Check if two arrays have the same elements, regardless of the order
 */
const matchingArrays = (array1: unknown[], array2: unknown[]): boolean =>
  array1.length === array2.length && array1.every((e) => array2.includes(e));

/**
 * Creates a handler to set the dirty state for a group of elements
 */
export function createDirtyHandler(
  name: string,
  elements: FormElement[],
  stores: FormulaStores
): () => void {
  const elementHandlers = new Map<FormElement, () => void>();
  const initialValues = new Map<string, unknown>();
  let subscriptionUnsub: (() => void) | undefined;

  const setDirtyAndStopListening = () => {
    for (const [el, handler] of elementHandlers) {
      el.setAttribute('data-formula-dirty', 'true');
      el.removeEventListener('blur', handler);
    }
    elementHandlers.clear();
    if (subscriptionUnsub) {
      subscriptionUnsub();
      subscriptionUnsub = undefined;
    }
  };

  // Set initial dirty state and initial value
  stores.dirty.set({ ...stores.dirty.get(), [name]: false });
  // Capture initial value once and unsubscribe immediately
  const unsubInitial = stores.formValues.subscribe((v) => initialValues.set(name, v[name]));
  unsubInitial();
  subscriptionUnsub = undefined; // No ongoing subscription needed for initial values

  function createElementHandler(groupName: string): () => void {
    return () => {
      const startValue = initialValues.get(groupName);
      const currentValues = stores.formValues.get();

      const isDirty = Array.isArray(currentValues[groupName])
        ? !matchingArrays(currentValues[groupName] as unknown[], startValue as unknown[])
        : currentValues[groupName] !== startValue;

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
