import { getFormFields, getGroupFields } from '../shared/fields';
import { createHandler, createSubmitHandler } from './event';
import { createReset } from './init';
import { createTouchHandlers } from './touch';
import { createDirtyHandler } from './dirty';

import { createFormStores } from '../shared/stores';
import {
  setAriaButtons,
  setAriaContainer,
  setAriaRole,
  setAriaStates,
} from './aria';

/**
 * Creates the form action
 * @param {FormulaOptions} options
 * @param {Map<string, FormulaStores>} globalStore
 * @param {string} groupName
 * @param {Record<string, any>} initialData
 * @returns {import('../../../index.mjs').Formula}
 */
export function createForm(options, globalStore, groupName, initialData) {
  const eventHandlers = new Map();
  const hiddenGroups = new Map();
  const touchHandlers = new Set();
  const dirtyHandlers = new Set();

  const stores = createFormStores(options, initialData);
  const isGroup = typeof groupName !== 'undefined';
  const initialOptions = options;
  let submitHandler = undefined;
  let unsub = () => {};
  let innerReset = () => {};

  let groupedMap = [];

  function bindElements(node, innerOpt) {
    const formElements = isGroup ? getGroupFields(node) : getFormFields(node);

    node.setAttribute(`data-formula-${isGroup ? 'row' : 'form'}`, 'true');
    setAriaContainer(node, isGroup);
    setAriaButtons(node);

    groupedMap = [
      ...formElements.reduce((entryMap, e) => {
        const formulaName = e.dataset.formulaName;
        const name = formulaName || e.getAttribute('name');
        return entryMap.set(name, [...(entryMap.get(name) || []), e]);
      }, new Map()),
    ];

    innerReset = createReset(node, groupedMap, stores, innerOpt);

    groupedMap.forEach(([name, elements]) => {
      if (elements[0].type === 'hidden') {
        hiddenGroups.set(name, elements);
        return;
      }

      touchHandlers.add(createTouchHandlers(name, elements, stores));
      dirtyHandlers.add(createDirtyHandler(name, elements, stores));

      elements.forEach((el) => {
        if (isGroup) {
          el.setAttribute('data-in-group', groupName);
        }
        setAriaRole(el, elements);
        setAriaStates(el);

        const customBindings = el.dataset.formulaBind;
        if (customBindings) {
          customBindings
            .split('|')
            .forEach((event) =>
              eventHandlers.set(
                el,
                createHandler(
                  name,
                  event,
                  el,
                  elements,
                  stores,
                  innerOpt,
                  hiddenGroups
                )
              )
            );
        } else if (el instanceof HTMLSelectElement) {
          eventHandlers.set(
            el,
            createHandler(
              name,
              'change',
              el,
              elements,
              stores,
              innerOpt,
              hiddenGroups
            )
          );
        } else {
          const changeEventTypes = [
            'radio',
            'checkbox',
            'file',
            'range',
            'color',
            'date',
            'time',
            'week',
            'number',
          ];

          if (changeEventTypes.includes(el.type)) {
            eventHandlers.set(
              el,
              createHandler(
                name,
                'change',
                el,
                elements,
                stores,
                innerOpt,
                hiddenGroups
              )
            );
          }

          if (el.type !== 'hidden') {
            eventHandlers.set(
              el,
              createHandler(
                name,
                'keyup',
                el,
                elements,
                stores,
                innerOpt,
                hiddenGroups
              )
            );
          }
        }
      });
    });

    if (node.id && globalStore) globalStore.set(node.id, stores);

    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(stores, node);
      node.addEventListener('submit', submitHandler);
    }
    stores.isFormReady.set(true);
  }

  let currentNode;

  function cleanupSubscriptions() {
    unsub && unsub();
    [...eventHandlers].forEach(([el, fn]) => {
      el.setCustomValidity('');
      fn();
    });
    [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
    [eventHandlers, touchHandlers, dirtyHandlers].forEach((h) => h.clear());
    if (submitHandler) currentNode.removeEventListener('submit', submitHandler);
  }

  return {
    init: (node) => {
      currentNode = node;
      bindElements(node, options);
      return {
        elements: groupedMap,
        destroy: () => {
          cleanupSubscriptions();
          currentNode.id && globalStore && globalStore.delete(currentNode.id);
        },
      };
    },
    updateForm: (updatedOpts) => {
      stores.isFormReady.set(false);
      cleanupSubscriptions();
      bindElements(currentNode, updatedOpts || initialOptions);
    },
    destroyForm: () => {
      stores.isFormReady.set(false);
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
