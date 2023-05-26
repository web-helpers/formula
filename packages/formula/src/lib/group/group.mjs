import { createGroupStores } from '../shared/stores.mjs';
import { createForm } from '../form/form.mjs';

/**
 * Optional settings for Beaker - by providing these options the state of the form can be set up as an initial state, along with custom validation and enrichment rules.
 * @typedef {object} BeakerOptions
 * @property {Record<string, Record<string, string>=} messages - Provide customised messages to the application, these messages replace the default browser messages for the provided error types and are useful for internationalisation or custom domain messages
 * @property {import('../form/errors.mjs').ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {import('../form/errors.mjs').ValidationRules=} validators - An object containing validation rules for the provided fields, each field validation returns a string if invalid, or `null` if the validation passes. Each validation key is also added to the `validity` field errors object.
 * @property {import('../form/enrichment.mjs').EnrichFields=} enrich - An object containing enrichers for the provided fields, each field enricher returns a value that is added to the `enriched` field.
 * @property {Record<string, any>=} defaultValues - Default values are used as initial values for the form fields if there is no value already set on the form
 */

/**
 * @typedef {object} Beaker
 * @property {function} group - Creates a group of forms
 * @property {function} update - Updates the options for the group
 * @property {function} destroy - Destroys the group
 * @property {Map} forms - A map of the forms in the group
 * @property {Map} stores - A map of the stores in the group
 * @property {function} init - Initialises the group with the provided data
 * @property {function} add - Adds a new row to the group
 * @property {function} set - Sets the row at the provided index
 * @property {function} delete - Removes the row at the provided index
 */

let groupCounter = 0;

/**
 * Creates a group, which is a collection of forms for row data
 * @param {BeakerOptions} options
 * @param {Map<string, import('../shared/stores.mjs').BeakerStores>} beakerStores
 * @returns {Beaker}
 */
export function createGroup(options, beakerStores) {
  const groupStores = createGroupStores(options);
  let groupName;
  let globalObserver;

  const { defaultValues = [], ...formulaOptions } = options || {};

  const formulaInstances = new Map();
  const formInstances = new Map();
  const subscriptions = new Set();

  function destroyGroup() {
    formInstances.forEach((instance) => instance.destroy());
    subscriptions.forEach((sub) => sub());
    formInstances.clear();
    formulaInstances.clear();
    subscriptions.clear();
  }

  function cleanupStores(rows) {
    for (const key of Object.keys(groupStores)) {
      if (['formValues', 'initialValues', 'submitValues'].includes(key)) return;
      const state = groupStores[key].get();
      groupStores[key].set(Array.isArray(state) ? state.slice(0, rows.length) : state);
    }
  }

  function setupSubscriptions(form, index) {
    let initial = true;
    const formStores = Object.entries(form.stores);
    for (const [key, store] of formStores) {
      const unsub = store.subscribe((value) => {
        if (initial && key === 'formValues') return;
        const state = groupStores[key].get();
        if (Array.isArray(state)) {
          state.splice(index, 1, value);
        }
        groupStores[key].set(state);
      });
      subscriptions.add(unsub);
    }
    initial = false;
  }

  function groupHasChanged(rows) {
    groupStores.formReady.set(false);
    const currentVals = groupStores.formValues.get();
    destroyGroup();
    cleanupStores(rows);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      row.setAttribute('data-beaker-index', `${i}`);
      const form = createForm(
        {
          ...formulaOptions,
          defaultValues: defaultValues?.[i] || {},
        },
        undefined,
        groupName,
        currentVals[i]
      );
      const instance = form.form(row);
      formulaInstances.set(row, form);
      formInstances.set(row, instance);
      setupSubscriptions(form, i);
    }
    groupStores.formReady.set(true);
  }

  function setupGroupContainer(node) {
    globalObserver = new MutationObserver(() => {
      const rows = node.querySelectorAll(':scope > *');
      groupHasChanged(Array.from(rows));
    });

    globalObserver.observe(node, { childList: true });
    const rows = node.querySelectorAll(':scope > *');
    groupHasChanged(Array.from(rows));
  }

  return {
    group: (node) => {
      if (node.id) {
        groupName = node.id;
        beakerStores.set(groupName, groupStores);
      } else {
        groupName = `beaker-group-${groupCounter++}`;
        node.id = groupName;
      }

      node.setAttribute('data-beaker-group', 'true');
      if (!node.hasAttribute('aria-role')) {
        node.setAttribute('aria-role', 'group');
      }
      setupGroupContainer(node);

      return {
        destroy: () => {
          if (groupName) {
            beakerStores.delete(groupName);
          }
          destroyGroup();
          globalObserver.disconnect();
        },
      };
    },
    update: (options) => {
      formulaInstances.forEach((_, form) => form.updateForm(options));
    },
    destroy: () => {
      if (groupName) {
        beakerStores.delete(groupName);
      }
      destroyGroup();
      globalObserver.disconnect();
    },
    forms: formulaInstances,
    stores: groupStores,
    init: (items) => groupStores.formValues.set(items),
    add: (item) => groupStores.formValues.set([...groupStores.formValues.get(), item]),
    set: (index, item) => {
      const newState = groupStores.formValues.get();
      newState.splice(index, 1, item);
      groupStores.formValues.set(newState);
    },
    /**
     *
     * @param {number} index
     * @returns
     */
    delete: (index) =>
      Object.keys(groupStores).forEach((key) => {
        const state = groupStores[key].get();
        if (Array.isArray(state)) {
          state.splice(index, 1);
        }
        groupStores[key].set(state);
      }),
    clear: () => groupStores.formValues.set([]),
    ...groupStores,
  };
}
