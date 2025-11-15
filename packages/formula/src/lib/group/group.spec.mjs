import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createGroup } from './group.mjs';

describe('Formula Group (Beaker)', () => {
  let container;
  let beakerStores;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-group';
    document.body.appendChild(container);
    beakerStores = new Map();
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  describe('Basic Functionality', () => {
    it('should create a group', () => {
      const group = createGroup({}, beakerStores);
      expect(group).toHaveProperty('group');
      expect(group).toHaveProperty('stores');
      expect(group).toHaveProperty('init');
      expect(group).toHaveProperty('add');
      expect(group).toHaveProperty('set');
      expect(group).toHaveProperty('delete');
    });

    it('should initialize with default values', () => {
      const group = createGroup({
        defaultValues: [
          { name: 'John' },
          { name: 'Jane' },
        ],
      }, beakerStores);

      const values = group.formValues.get();
      expect(values).toHaveLength(2);
      expect(values[0]).toStrictEqual({ name: 'John' });
      expect(values[1]).toStrictEqual({ name: 'Jane' });
    });
  });

  describe('Bug Fix: State Mutation in setupSubscriptions', () => {
    it('should not mutate state array directly in subscriptions', () => {
      const group = createGroup({
        defaultValues: [{ name: 'Test1' }, { name: 'Test2' }],
      }, beakerStores);

      const row1 = document.createElement('div');
      const input1 = document.createElement('input');
      input1.setAttribute('name', 'name');
      input1.value = 'Test1';
      row1.appendChild(input1);

      const row2 = document.createElement('div');
      const input2 = document.createElement('input');
      input2.setAttribute('name', 'name');
      input2.value = 'Test2';
      row2.appendChild(input2);

      container.appendChild(row1);
      container.appendChild(row2);

      const instance = group.group(container);

      // Get initial state
      const initialState = group.formValues.get();
      const initialLength = initialState.length;

      // Store reference to check mutation
      const stateRef = initialState;

      // Trigger a change that would update subscriptions
      group.formValues.set([...initialState, { name: 'Test3' }]);

      // Original reference should not be mutated
      expect(stateRef.length).toBe(initialLength);

      instance.destroy();
    });
  });

  describe('Bug Fix: State Mutation in set method', () => {
    it('should create new array when setting value at index', () => {
      const group = createGroup({}, beakerStores);
      group.init([{ name: 'Original1' }, { name: 'Original2' }]);

      const originalState = group.formValues.get();
      const originalRef = originalState;

      // Set new value at index 1
      group.set(1, { name: 'Modified2' });

      const newState = group.formValues.get();

      // Should be different array reference
      expect(newState).not.toBe(originalRef);

      // Original should not be modified
      expect(originalRef[1]).toStrictEqual({ name: 'Original2' });

      // New state should have the change
      expect(newState[1]).toStrictEqual({ name: 'Modified2' });
      expect(newState[0]).toStrictEqual({ name: 'Original1' });
    });
  });

  describe('Bug Fix: State Mutation in delete method', () => {
    it('should create new array when deleting by index', () => {
      const group = createGroup({}, beakerStores);
      group.init([{ name: 'Item1' }, { name: 'Item2' }, { name: 'Item3' }]);

      const originalState = group.formValues.get();
      const originalRef = originalState;
      const originalLength = originalState.length;

      // Delete item at index 1
      group.delete(1);

      const newState = group.formValues.get();

      // Original reference should not be mutated
      expect(originalRef.length).toBe(originalLength);
      expect(originalRef[1]).toStrictEqual({ name: 'Item2' });

      // New state should have item removed
      expect(newState.length).toBe(2);
      expect(newState[0]).toStrictEqual({ name: 'Item1' });
      expect(newState[1]).toStrictEqual({ name: 'Item3' });
    });

    it('should update all array stores when deleting', () => {
      const group = createGroup({}, beakerStores);
      group.init([{ name: 'Item1' }, { name: 'Item2' }]);

      // Set some touched states
      group.touched.set([{ name: true }, { name: true }]);
      group.dirty.set([{ name: false }, { name: true }]);

      group.delete(0);

      // All stores should be updated
      expect(group.formValues.get()).toHaveLength(1);
      expect(group.touched.get()).toHaveLength(1);
      expect(group.dirty.get()).toHaveLength(1);
    });
  });

  describe('Bug Fix: cleanupStores early return', () => {
    it('should cleanup all stores not just formValues', () => {
      const group = createGroup({
        defaultValues: [
          { name: 'Test1' },
          { name: 'Test2' },
          { name: 'Test3' },
        ],
      }, beakerStores);

      const row1 = document.createElement('div');
      const input1 = document.createElement('input');
      input1.setAttribute('name', 'name');
      row1.appendChild(input1);

      container.appendChild(row1);

      const instance = group.group(container);

      // Initially should have 3 items in all stores
      expect(group.formValues.get()).toHaveLength(3);

      // Manually set other stores to have 3 items
      group.touched.set([{ name: false }, { name: false }, { name: false }]);
      group.dirty.set([{ name: false }, { name: false }, { name: false }]);
      group.errors.set([{}, {}, {}]);

      // Remove 2 rows, leaving only 1
      container.removeChild(row1);

      // Wait for MutationObserver
      return new Promise((resolve) => {
        setTimeout(() => {
          // All stores should be cleaned up to match row count
          // The cleanup should continue past formValues
          const touched = group.touched.get();
          const dirty = group.dirty.get();
          const errors = group.errors.get();

          // With the fix, these should be cleaned up
          expect(touched.length).toBeLessThanOrEqual(1);
          expect(dirty.length).toBeLessThanOrEqual(1);
          expect(errors.length).toBeLessThanOrEqual(1);

          instance.destroy();
          resolve();
        }, 100);
      });
    });
  });

  describe('Bug Fix: Race condition in subscription setup', () => {
    it('should handle initial flag per subscription not globally', () => {
      const group = createGroup({
        defaultValues: [{ name: 'Test' }],
      }, beakerStores);

      const row = document.createElement('div');
      const input = document.createElement('input');
      input.setAttribute('name', 'name');
      input.value = 'Test';
      row.appendChild(input);

      container.appendChild(row);

      const subscriptionCalls = [];

      // Mock the stores to track subscription calls
      const originalFormValues = group.formValues;
      const originalTouched = group.touched;

      let formValuesCallCount = 0;
      let touchedCallCount = 0;

      group.formValues = {
        ...originalFormValues,
        subscribe: (fn) => {
          formValuesCallCount++;
          return originalFormValues.subscribe(fn);
        },
      };

      group.touched = {
        ...originalTouched,
        subscribe: (fn) => {
          touchedCallCount++;
          return originalTouched.subscribe(fn);
        },
      };

      const instance = group.group(container);

      // Each store should get its own subscription
      // The initial flag should not affect other stores
      expect(formValuesCallCount).toBeGreaterThan(0);
      expect(touchedCallCount).toBeGreaterThan(0);

      instance.destroy();
    });
  });

  describe('Bug Fix: Incorrect method call form.init()', () => {
    it('should call form.init() not form.form()', () => {
      const group = createGroup({
        defaultValues: [{ name: 'Test' }],
      }, beakerStores);

      const row = document.createElement('div');
      const input = document.createElement('input');
      input.setAttribute('name', 'name');
      input.value = 'Test';
      row.appendChild(input);

      container.appendChild(row);

      // This should not throw an error
      expect(() => {
        const instance = group.group(container);
        instance.destroy();
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should handle add operation correctly', () => {
      const group = createGroup({}, beakerStores);
      group.init([{ name: 'Item1' }]);

      group.add({ name: 'Item2' });

      const values = group.formValues.get();
      expect(values).toHaveLength(2);
      expect(values[0]).toStrictEqual({ name: 'Item1' });
      expect(values[1]).toStrictEqual({ name: 'Item2' });
    });

    it('should handle clear operation', () => {
      const group = createGroup({}, beakerStores);
      group.init([{ name: 'Item1' }, { name: 'Item2' }]);

      group.clear();

      expect(group.formValues.get()).toStrictEqual([]);
    });

    it('should register in global beakerStores map', () => {
      const group = createGroup({}, beakerStores);
      
      const row = document.createElement('div');
      container.appendChild(row);
      
      const instance = group.group(container);

      expect(beakerStores.has('test-group')).toBe(true);
      expect(beakerStores.get('test-group')).toBe(group.stores);

      instance.destroy();
    });
  });
});
