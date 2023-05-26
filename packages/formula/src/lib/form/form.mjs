import { getFormFields, getGroupFields } from "../shared/fields.mjs";
import { createHandler, createSubmitHandler } from "./event.mjs";
import { createReset } from "./init.mjs";
import { createTouchHandlers } from "./touch.mjs";
import { createDirtyHandler } from "./dirty.mjs";

import { createFormStores } from "../shared/stores.mjs";
import {
  setAriaButtons,
  setAriaContainer,
  setAriaRole,
  setAriaStates,
} from "./aria.mjs";

/**
 * Optional settings for Formula - by providing these options the state of the form can be set up as an initial state, along with custom validation and enrichment rules.
 * @typedef {object} FormulaOptions
 * @property {Record<string, Record<string, string>=} messages - Provide customised messages to the application, these messages replace the default browser messages for the provided error types and are useful for internationalisation or custom domain messages
 * @property {import('./errors.mjs').ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {import('./errors.mjs').ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {import('./enrichment.mjs').EnrichFields=} enrich - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
 * @property {Record<string, any>=} defaultValues - Default values are used as initial values for the form fields if there is no value already set on the form
 * @property {() => void=} preChanges -Method called as soon as a change has been detected, before any values are read or stores are updated
 * @property {(values: Record<string, any>) => void=} postChanges - Method called after all updates to the stores have been made
 */

/**
 * The Formula form object, this is returned from the `formula.init` method and is the DOM instance of the form
 * @typedef {object} Formula
 * @property {(node: HTMLElement) => { elements: HTMLElement[], destroy: () => void }} init
 * @property {(updatedOpts?: import('./src/lib/form/form.mjs').FormulaOptions) => void} updateForm
 * @property {() => void} destroyForm
 * @property {() => void} resetForm
 * @property {import('../shared/stores.mjs').FormulaStores} stores
 */

/**
 * @typedef {object} FormulaForm
 * @property {HTMLElement} node
 * @property {HTMLElement[]} elements
 * @property {() => void} destroy
 */

/**
 * Creates the form action
 * @param {FormulaOptions} options
 * @param {Map<string, import('../shared/stores.mjs').FormulaStores>} globalStore
 * @param {string} groupName
 * @param {Record<string, any>} initialData
 * @returns {Formula}
 */
export function createForm(options, globalStore, groupName, initialData) {
  const eventHandlers = new Map();
  const hiddenGroups = new Map();
  const touchHandlers = new Set();
  const dirtyHandlers = new Set();

  const stores = createFormStores(options, initialData);
  const isGroup = typeof groupName !== "undefined";
  const initialOptions = options;
  let submitHandler = undefined;
  let unsub = () => {};
  let innerReset = () => {};

  let groupedMap = [];

  function bindElements(node, innerOpt = {}) {
    if (!innerOpt?.preChanges) {
      innerOpt.preChanges = () => {
        node?.parentElement?.dispatchEvent(
          new CustomEvent("form:preChanges", { detail: undefined })
        );
      };
    }
    if (!innerOpt?.postChanges) {
      innerOpt.postChanges = (values) => {
        node?.parentElement?.dispatchEvent(
          new CustomEvent("form:postChanges", { detail: values })
        );
      };
    }

    const formElements = isGroup ? getGroupFields(node) : getFormFields(node);

    node.setAttribute(`data-formula-${isGroup ? "row" : "form"}`, "true");
    setAriaContainer(node, isGroup);
    setAriaButtons(node);

    groupedMap = [
      ...formElements.reduce((entryMap, e) => {
        const formulaName = e.dataset.formulaName;
        const name = formulaName || e.getAttribute("name");
        return entryMap.set(name, [...(entryMap.get(name) || []), e]);
      }, new Map()),
    ];

    innerReset = createReset(node, groupedMap, stores, innerOpt);

    groupedMap.forEach(([name, elements]) => {
      if (elements[0].type === "hidden") {
        hiddenGroups.set(name, elements);
        return;
      }

      touchHandlers.add(createTouchHandlers(name, elements, stores));
      dirtyHandlers.add(createDirtyHandler(name, elements, stores));

      elements.forEach((el) => {
        if (isGroup) {
          el.setAttribute("data-in-group", groupName);
        }
        setAriaRole(el, elements);
        setAriaStates(el);

        const customBindings = el.dataset.formulaBind;
        if (customBindings) {
          customBindings
            .split("|")
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
              "change",
              el,
              elements,
              stores,
              innerOpt,
              hiddenGroups
            )
          );
        } else {
          const changeEventTypes = [
            "radio",
            "checkbox",
            "file",
            "range",
            "color",
            "date",
            "time",
            "week",
            "number",
          ];

          if (changeEventTypes.includes(el.type)) {
            eventHandlers.set(
              el,
              createHandler(
                name,
                "change",
                el,
                elements,
                stores,
                innerOpt,
                hiddenGroups
              )
            );
          }

          if (el.type !== "hidden") {
            eventHandlers.set(
              el,
              createHandler(
                name,
                "keyup",
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
      node.addEventListener("submit", submitHandler);
    }
    stores.formReady.set(true);
  }

  let currentNode;

  function cleanupSubscriptions() {
    unsub && unsub();
    [...eventHandlers].forEach(([el, fn]) => {
      el.setCustomValidity("");
      fn();
    });
    [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
    [eventHandlers, touchHandlers, dirtyHandlers].forEach((h) => h.clear());
    if (submitHandler) currentNode.removeEventListener("submit", submitHandler);
  }

  return {
    init: (node) => {
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
    updateForm: (updatedOpts) => {
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
