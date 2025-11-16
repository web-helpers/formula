import { createGroupStores } from '../shared/stores.mjs';
import { createForm } from '../form/form.mjs';

import type { BeakerStores, BeakerOptions, FormulaOptions } from '../shared/types.mjs';
import type { Formula } from '../form/form.mjs';

export interface Beaker {
  group: (node: HTMLElement) => { destroy: () => void };
  update: (options: FormulaOptions) => void;
  destroy: () => void;
  forms: Map<HTMLElement, Formula>;
  stores: BeakerStores;
  init: (items: Array<Record<string, unknown>>) => void;
  add: (item: Record<string, unknown>) => void;
  set: (index: number, item: Record<string, unknown>) => void;
  delete: (index: number) => void;
  clear: () => void;
}

let groupCounter = 0;

export function createGroup(options: BeakerOptions, beakerStores: Map<string, BeakerStores>): Beaker {
  const groupStores = createGroupStores(options);
  let groupName: string;
  let globalObserver: MutationObserver;

  const { defaultValues = [], ...formulaOptions } = options || {};

  const formulaInstances = new Map<HTMLElement, Formula>();
  const formInstances = new Map<HTMLElement, { root: HTMLElement; elements: Array<[string, HTMLElement[]]>; destroy: () => void }>();
  const subscriptions = new Set<() => void>();

  function destroyGroup() {
    formInstances.forEach((instance) => instance.destroy());
    subscriptions.forEach((sub) => sub());
    formInstances.clear();
    formulaInstances.clear();
    subscriptions.clear();
  }

  function cleanupStores(rows: Element[]) {
    for (const key of Object.keys(groupStores)) {
      if (['formValues', 'initialValues', 'submitValues'].includes(key)) continue;
      const state = (groupStores as Record<string, { get: () => unknown; set: (value: unknown) => void }>)[key].get();
      (groupStores as Record<string, { get: () => unknown; set: (value: unknown) => void }>)[key].set(Array.isArray(state) ? state.slice(0, rows.length) : state);
    }
  }

  function setupSubscriptions(form: Formula, index: number) {
    const formStores = Object.entries(form.stores) as Array<[string, { subscribe: (fn: (value: unknown) => void) => () => void }]>;
    for (const [key, store] of formStores) {
      let initial = true;
      const unsub = store.subscribe((value) => {
        if (initial && key === 'formValues') {
          initial = false;
          return;
        }
        initial = false;
        const state = (groupStores as Record<string, { get: () => unknown; set: (value: unknown) => void }>)[key].get();
        if (Array.isArray(state)) {
          const newState = [...state];
          newState.splice(index, 1, value);
          (groupStores as Record<string, { get: () => unknown; set: (value: unknown) => void }>)[key].set(newState);
        } else {
          (groupStores as Record<string, { get: () => unknown; set: (value: unknown) => void }>)[key].set(state);
        }
      });
      subscriptions.add(unsub);
    }
  }

  function groupHasChanged(rows: Element[]) {
    groupStores.formReady.set(false);
    const currentVals = groupStores.formValues.get();
    destroyGroup();
    cleanupStores(rows);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as HTMLElement;
      row.setAttribute('data-beaker-index', `${i}`);
      const form = createForm(
        {
          ...formulaOptions,
          defaultValues: defaultValues?.[i] || {},
        },
        undefined,
        groupName,
        currentVals[i] || {},
      );
      const instance = form.init(row);
      formulaInstances.set(row, form);
      formInstances.set(row, instance);
      setupSubscriptions(form, i);
    }
    groupStores.formReady.set(true);
  }

  function setupGroupContainer(node: HTMLElement) {
    globalObserver = new MutationObserver(() => {
      const rows = node.querySelectorAll(':scope > *');
      groupHasChanged(Array.from(rows));
    });

    globalObserver.observe(node, { childList: true });
    const rows = node.querySelectorAll(':scope > *');
    groupHasChanged(Array.from(rows));
  }

  return {
    group: (node: HTMLElement) => {
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
    update: (options: FormulaOptions) => {
      formulaInstances.forEach((form) => form.updateForm(options));
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
    init: (items: Array<Record<string, unknown>>) => groupStores.formValues.set(items),
    add: (item: Record<string, unknown>) => groupStores.formValues.set([...groupStores.formValues.get(), item]),
    set: (index: number, item: Record<string, unknown>) => {
      const newState = [...groupStores.formValues.get()];
      newState.splice(index, 1, item);
      groupStores.formValues.set(newState);
    },
    delete: (index: number) =>
      Object.keys(groupStores).forEach((key) => {
        const state = (groupStores as Record<string, { get: () => unknown; set: (value: unknown) => void }>)[key].get();
        if (Array.isArray(state)) {
          const newState = [...state];
          newState.splice(index, 1);
          (groupStores as Record<string, { get: () => unknown; set: (value: unknown) => void }>)[key].set(newState);
        }
      }),
    clear: () => groupStores.formValues.set([]),
    ...groupStores,
  };
}
