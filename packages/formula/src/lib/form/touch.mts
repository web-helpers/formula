import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores } from '../shared/types.mjs';

/**
 * Creates the handler for a group of elements for the touch event
 */
export function createTouchHandlers(name: string, elements: FormElement[], stores: FormulaStores): () => void {
  const elementHandlers = new Map<FormElement, () => void>();

  const destroy = () => {
    for (const [el, handler] of elementHandlers) {
      el.setAttribute('data-formula-touched', 'true');
      el.removeEventListener('focus', handler);
    }
    elementHandlers.clear();
  };

  stores.touched.set({ ...stores.touched.get(), [name]: false });

  const createElementHandler = (): (() => void) => {
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
