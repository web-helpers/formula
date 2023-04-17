import { createGroupStores } from '../shared/stores';
import { createForm } from '../form/form';

let groupCounter = 0;

/**
 * Creates a group, which is a collection of forms for row data
 * @param {BeakerOptions} options
 * @param {Map<string, BeakerStores>} beakerStores
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
      groupStores[key].set(
        Array.isArray(state) ? state.slice(0, rows.length) : state
      );
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
    groupStores.isFormReady.set(false);
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
    groupStores.isFormReady.set(true);
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
    add: (item) =>
      groupStores.formValues.set([...groupStores.formValues.get(), item]),
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
