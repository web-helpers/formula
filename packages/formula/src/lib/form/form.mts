import { getFormFields, getGroupFields, type FormElement } from '../shared/fields.mjs';
import { createHandler, createSubmitHandler } from './event.mjs';
import { createReset } from './init.mjs';
import { createTouchHandlers } from './touch.mjs';
import { createDirtyHandler } from './dirty.mjs';

import { createFormStores } from '../shared/stores.mjs';
import { setAriaButtons, setAriaContainer, setAriaRole, setAriaStates } from './aria.mjs';

import type { FormulaStores, FormulaOptions } from '../shared/types.mjs';

export interface Formula {
  init: (node: HTMLElement) => FormulaForm;
  updateForm: (updatedOpts?: FormulaOptions) => void;
  destroyForm: () => void;
  resetForm: () => void;
  stores: FormulaStores;
}

export interface FormulaForm {
  root: HTMLElement;
  elements: Array<[string, FormElement[]]>;
  destroy: () => void;
}

export function createForm(
  options: FormulaOptions,
  globalStore: Map<string, FormulaStores> | undefined,
  groupName: string | undefined,
  initialData: Record<string, unknown>,
): Formula {
  // WeakMap allows garbage collection of handlers when elements are removed from DOM
  const eventHandlers = new WeakMap<FormElement, Array<() => void>>();
  const trackedElements = new Set<FormElement>(); // Track elements for cleanup iteration
  const hiddenGroups = new Map<string, FormElement[]>();
  const touchHandlers = new Set<() => void>();
  const dirtyHandlers = new Set<() => void>();

  const stores = createFormStores(options, initialData);
  const isGroup = typeof groupName !== 'undefined';
  const initialOptions = options;
  let submitHandler: ((e: Event) => void) | undefined = undefined;
  let unsub = () => { };
  let innerReset = () => { };

  let groupedMap: Array<[string, FormElement[]]> = [];

  function bindElements(node: HTMLElement, innerOpt: FormulaOptions = {}) {
    if (!innerOpt?.preChanges) {
      innerOpt.preChanges = () => {
        node?.parentElement?.dispatchEvent(new CustomEvent('form:preChanges', { detail: undefined }));
      };
    }
    if (!innerOpt?.postChanges) {
      innerOpt.postChanges = (values: Record<string, unknown>) => {
        node?.parentElement?.dispatchEvent(new CustomEvent('form:postChanges', { detail: values }));
      };
    }

    const formElements = isGroup ? getGroupFields(node) : getFormFields(node);

    node.setAttribute(`data-formula-${isGroup ? 'row' : 'form'}`, 'true');
    setAriaContainer(node, isGroup);
    setAriaButtons(node);

    groupedMap = [
      ...formElements.reduce((entryMap, e) => {
        const formulaName = e.dataset.formulaName;
        const name = formulaName || e.getAttribute('name') || '';
        return entryMap.set(name, [...(entryMap.get(name) || []), e]);
      }, new Map<string, FormElement[]>()),
    ];

    innerReset = createReset(node, groupedMap, stores, innerOpt);

    groupedMap.forEach(([name, elements]) => {
      const firstEl = elements[0];
      if (firstEl instanceof HTMLInputElement && firstEl.type === 'hidden') {
        hiddenGroups.set(name, elements);
        return;
      }

      touchHandlers.add(createTouchHandlers(name, elements, stores));
      dirtyHandlers.add(createDirtyHandler(name, elements, stores));

      elements.forEach((el) => {
        if (isGroup && groupName) {
          el.setAttribute('data-in-group', groupName);
        }
        setAriaRole(el, elements);
        setAriaStates(el);

        const customBindings = el.dataset.formulaBind;
        if (customBindings) {
          const cleanups: Array<() => void> = [];
          customBindings.split('|').forEach((event) => {
            cleanups.push(createHandler(name, event, el, elements, stores, innerOpt, hiddenGroups));
          });
          eventHandlers.set(el, cleanups);
          trackedElements.add(el);
        } else if (el instanceof HTMLSelectElement) {
          eventHandlers.set(el, [createHandler(name, 'change', el, elements, stores, innerOpt, hiddenGroups)]);
          trackedElements.add(el);
        } else {
          const changeEventTypes = ['radio', 'checkbox', 'file', 'range', 'color', 'date', 'time', 'week', 'number'];
          const cleanups: Array<() => void> = [];

          if (changeEventTypes.includes((el as HTMLInputElement).type)) {
            cleanups.push(createHandler(name, 'change', el, elements, stores, innerOpt, hiddenGroups));
          }

          if ((el as HTMLInputElement).type !== 'hidden') {
            cleanups.push(createHandler(name, 'keyup', el, elements, stores, innerOpt, hiddenGroups));
          }

          if (cleanups.length > 0) {
            eventHandlers.set(el, cleanups);
            trackedElements.add(el);
          }
        }
      });
    });

    if (node.id && globalStore) globalStore.set(node.id, stores);

    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(stores, node);
      node.addEventListener('submit', submitHandler);
    }
    stores.formReady.set(true);
  }

  let currentNode: HTMLElement;

  function cleanupSubscriptions() {
    unsub && unsub();
    trackedElements.forEach((el) => {
      const fns = eventHandlers.get(el);
      if (fns) {
        el.setCustomValidity?.('');
        fns.forEach((fn) => fn());
        eventHandlers.delete(el);
      }
    });
    trackedElements.clear();
    [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
    [touchHandlers, dirtyHandlers].forEach((h) => h.clear());
    if (submitHandler && currentNode instanceof HTMLFormElement) {
      currentNode.removeEventListener('submit', submitHandler);
    }
  }

  return {
    init: (node: HTMLElement): FormulaForm => {
      currentNode = node;
      bindElements(node, options);
      return {
        root: node,
        elements: groupedMap,
        destroy: () => {
          stores.formReady.set(false);
          cleanupSubscriptions();
          currentNode.id && globalStore && globalStore.delete(currentNode.id);
        },
      };
    },
    updateForm: (updatedOpts?: FormulaOptions) => {
      stores.formReady.set(false);
      cleanupSubscriptions();
      bindElements(currentNode, updatedOpts || initialOptions);
    },
    destroyForm: () => {
      stores.formReady.set(false);
      cleanupSubscriptions();
      currentNode.id && globalStore && globalStore.delete(currentNode.id);
    },
    resetForm: () => {
      innerReset();
      [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
      groupedMap.forEach(([name, elements]) => {
        touchHandlers.add(createTouchHandlers(name, elements, stores));
        dirtyHandlers.add(createDirtyHandler(name, elements, stores));
      });
    },
    stores,
    ...stores,
  };
}
