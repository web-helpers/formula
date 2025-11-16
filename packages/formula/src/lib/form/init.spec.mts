import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createReset } from './init.mjs';
import { createFormStores } from '../shared/stores.mjs';
import type { FormulaStores } from '../shared/types.mjs';
import type { FormElement } from '../shared/fields.mjs';

describe('Form Initialization and Reset', () => {
  let form: HTMLFormElement;
  let stores: FormulaStores;

  beforeEach(() => {
    form = document.createElement('form');
    document.body.appendChild(form);
    stores = createFormStores({});
  });

  afterEach(() => {
    if (form.parentNode) {
      document.body.removeChild(form);
    }
  });

  describe('createReset', () => {
    it('should create a reset function', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'firstName';
      input.value = 'John';
      form.appendChild(input);

      const allGroups: [string, FormElement[]][] = [['firstName', [input]]];
      const reset = createReset(form, allGroups, stores, {});

      expect(reset).toBeInstanceOf(Function);
    });

    it('should reset formValues to initial state', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'firstName';
      input.value = 'Initial';
      form.appendChild(input);

      const allGroups: [string, FormElement[]][] = [['firstName', [input]]];
      const options = {};
      const reset = createReset(form, allGroups, stores, options);

      // Change value
      stores.formValues.set({ firstName: 'Changed' });
      expect(stores.formValues.get().firstName).toBe('Changed');

      // Reset
      reset();
      expect(stores.formValues.get().firstName).toBe('Initial');
    });

    it('should reset errors to initial state', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'email';
      input.required = true;
      input.value = 'test@example.com';
      form.appendChild(input);

      const allGroups: [string, FormElement[]][] = [['email', [input]]];
      const reset = createReset(form, allGroups, stores, {});

      // Set error
      stores.errors.set({ email: { valid: false, invalid: true, message: 'Error', errors: {} } });
      expect(stores.errors.get().email.valid).toBe(false);

      // Reset
      reset();
      expect(stores.errors.get().email.valid).toBe(true);
    });

    it('should reset formValid state', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'field1';
      input.value = 'valid';
      form.appendChild(input);

      const allGroups: [string, FormElement[]][] = [['field1', [input]]];
      const reset = createReset(form, allGroups, stores, {});

      // Set invalid
      stores.formValid.set(false);
      expect(stores.formValid.get()).toBe(false);

      // Reset
      reset();
      expect(stores.formValid.get()).toBe(true);
    });

    it('should reset touched state to false for all fields', () => {
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = 'field1';
      input1.value = 'value1';
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'text';
      input2.name = 'field2';
      input2.value = 'value2';
      form.appendChild(input2);

      const allGroups: [string, FormElement[]][] = [
        ['field1', [input1]],
        ['field2', [input2]],
      ];
      const reset = createReset(form, allGroups, stores, {});

      // Set touched
      stores.touched.set({ field1: true, field2: true });
      expect(stores.touched.get().field1).toBe(true);
      expect(stores.touched.get().field2).toBe(true);

      // Reset
      reset();
      expect(stores.touched.get().field1).toBe(false);
      expect(stores.touched.get().field2).toBe(false);
    });

    it('should reset dirty state to false for all fields', () => {
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = 'field1';
      input1.value = 'value1';
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'text';
      input2.name = 'field2';
      input2.value = 'value2';
      form.appendChild(input2);

      const allGroups: [string, FormElement[]][] = [
        ['field1', [input1]],
        ['field2', [input2]],
      ];
      const reset = createReset(form, allGroups, stores, {});

      // Set dirty
      stores.dirty.set({ field1: true, field2: true });
      expect(stores.dirty.get().field1).toBe(true);
      expect(stores.dirty.get().field2).toBe(true);

      // Reset
      reset();
      expect(stores.dirty.get().field1).toBe(false);
      expect(stores.dirty.get().field2).toBe(false);
    });

    it('should reset enrichment values when enrich option provided', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      input.value = 'JohnDoe';
      form.appendChild(input);

      const allGroups: [string, FormElement[]][] = [['username', [input]]];
      const options = {
        enrich: {
          username: {
            toLowerCase: (value: unknown) => (value as string).toLowerCase(),
            length: (value: unknown) => (value as string).length,
          },
        },
      };
      const reset = createReset(form, allGroups, stores, options);

      // Initial enrichment should be set
      const initialEnrichment = stores.enrichment.get();
      expect(initialEnrichment.username.toLowerCase).toBe('johndoe');
      expect(initialEnrichment.username.length).toBe(7);

      // Change enrichment
      stores.enrichment.set({ username: { toLowerCase: 'changed', length: 7 } });

      // Reset
      reset();
      const resetEnrichment = stores.enrichment.get();
      expect(resetEnrichment.username.toLowerCase).toBe('johndoe');
      expect(resetEnrichment.username.length).toBe(7);
    });

    it('should not add enrichment when field has no enrich config', () => {
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = 'field1';
      input1.value = 'value1';
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'text';
      input2.name = 'field2';
      input2.value = 'value2';
      form.appendChild(input2);

      const allGroups: [string, FormElement[]][] = [
        ['field1', [input1]],
        ['field2', [input2]],
      ];
      const options = {
        enrich: {
          field1: {
            transform: (value: unknown) => (value as string).toUpperCase(),
          },
        },
      };
      const reset = createReset(form, allGroups, stores, options);

      const enrichment = stores.enrichment.get();
      expect(enrichment).toHaveProperty('field1');
      expect(enrichment).not.toHaveProperty('field2');
    });

    it('should update DOM elements on reset', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'field1';
      input.value = 'initial';
      form.appendChild(input);

      const allGroups: [string, FormElement[]][] = [['field1', [input]]];
      const reset = createReset(form, allGroups, stores, {});

      // Change DOM value
      input.value = 'changed';
      expect(input.value).toBe('changed');

      // Reset (should update DOM back to initial)
      reset();
      // The extract function is called which should reset the DOM
      expect(input.value).toBe('initial');
    });

    it('should handle multiple fields in reset', () => {
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = 'firstName';
      input1.value = 'John';
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'email';
      input2.name = 'email';
      input2.value = 'john@example.com';
      form.appendChild(input2);

      const allGroups: [string, FormElement[]][] = [
        ['firstName', [input1]],
        ['email', [input2]],
      ];
      const reset = createReset(form, allGroups, stores, {});

      // Change values
      stores.formValues.set({ firstName: 'Jane', email: 'jane@example.com' });

      // Reset
      reset();
      const values = stores.formValues.get();
      expect(values.firstName).toBe('John');
      expect(values.email).toBe('john@example.com');
    });

    it('should use default values from options', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'field1';
      input.value = '';
      form.appendChild(input);

      const allGroups: [string, FormElement[]][] = [['field1', [input]]];
      const options = {
        defaultValues: { field1: 'default' },
      };
      const reset = createReset(form, allGroups, stores, options);

      // Initial value should use default
      const initialValues = stores.initialValues.get();
      expect(initialValues.field1).toBe('default');

      // Reset should restore default
      stores.formValues.set({ field1: 'changed' });
      reset();
      expect(stores.formValues.get().field1).toBe('default');
    });

    it('should handle checkbox reset', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'agree';
      checkbox.checked = true;
      form.appendChild(checkbox);

      const allGroups: [string, FormElement[]][] = [['agree', [checkbox]]];
      const reset = createReset(form, allGroups, stores, {});

      // Uncheck
      checkbox.checked = false;
      stores.formValues.set({ agree: false });

      // Reset
      reset();
      expect(stores.formValues.get().agree).toBe(true);
    });

    it('should handle select element reset', () => {
      const select = document.createElement('select');
      select.name = 'country';

      const option1 = document.createElement('option');
      option1.value = 'us';
      option1.text = 'US';
      option1.selected = true;

      const option2 = document.createElement('option');
      option2.value = 'uk';
      option2.text = 'UK';

      select.appendChild(option1);
      select.appendChild(option2);
      form.appendChild(select);

      const allGroups: [string, FormElement[]][] = [['country', [select]]];
      const reset = createReset(form, allGroups, stores, {});

      // Change selection
      select.value = 'uk';
      stores.formValues.set({ country: 'uk' });

      // Reset
      reset();
      expect(stores.formValues.get().country).toBe('us');
    });

    it('should handle multiple checkboxes reset', () => {
      const checkbox1 = document.createElement('input');
      checkbox1.type = 'checkbox';
      checkbox1.name = 'interests';
      checkbox1.value = 'sports';
      checkbox1.checked = true;

      const checkbox2 = document.createElement('input');
      checkbox2.type = 'checkbox';
      checkbox2.name = 'interests';
      checkbox2.value = 'music';
      checkbox2.checked = false;

      form.appendChild(checkbox1);
      form.appendChild(checkbox2);

      const allGroups: [string, FormElement[]][] = [['interests', [checkbox1, checkbox2]]];
      const reset = createReset(form, allGroups, stores, {});

      // Change checkboxes
      checkbox1.checked = false;
      checkbox2.checked = true;
      stores.formValues.set({ interests: ['music'] });

      // Reset
      reset();
      const values = stores.formValues.get();
      expect(values.interests).toEqual(['sports']);
    });
  });
});
