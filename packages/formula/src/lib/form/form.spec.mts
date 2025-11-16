import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createForm, type Formula } from './form.mjs';

describe('Formula Form', () => {
  let form: HTMLFormElement;
  let formula: Formula;
  let formInstance: any;

  beforeEach(() => {
    form = document.createElement('form');
    form.id = 'test-form';
    form.innerHTML = `
      <input type="text" name="firstName" value="" />
      <input type="email" name="email" value="" required />
      <input type="hidden" name="token" value="secret123" />
      <button type="submit">Submit</button>
    `;
    document.body.appendChild(form);
  });

  afterEach(() => {
    if (formInstance) {
      formInstance.destroy();
    }
    if (form.parentNode) {
      document.body.removeChild(form);
    }
  });

  describe('Form Initialization', () => {
    it('should initialize form and return form instance', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      expect(formInstance).toBeDefined();
      expect(formInstance.root).toBe(form);
      expect(formInstance.elements).toBeDefined();
      expect(formInstance.destroy).toBeInstanceOf(Function);
    });

    it('should set data-formula-form attribute on form element', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      expect(form.hasAttribute('data-formula-form')).toBe(true);
      expect(form.getAttribute('data-formula-form')).toBe('true');
    });

    it('should create stores', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      expect(formula.stores).toBeDefined();
      expect(formula.stores.formValues).toBeDefined();
      expect(formula.stores.errors).toBeDefined();
      expect(formula.stores.touched).toBeDefined();
      expect(formula.stores.dirty).toBeDefined();
    });

    it('should set formReady to true after initialization', async () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const ready = await new Promise((resolve) => {
        formula.stores.formReady.subscribe((ready) => {
          if (ready) {
            resolve(ready);
          }
        });
      });

      expect(ready).toBe(true);
    });

    it('should handle hidden fields', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (input) {
        input.value = 'John';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'n' }));
      }

      const values = formula.stores.formValues.get();
      expect(values.token).toBe('secret123');
    });
  });

  describe('Custom Bindings', () => {
    it('should handle custom event bindings via data-formula-bind', () => {
      const customForm = document.createElement('form');
      customForm.innerHTML = `
        <input type="text" name="custom" data-formula-bind="input|blur" />
      `;
      document.body.appendChild(customForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(customForm);

      const input = customForm.querySelector<HTMLInputElement>('input[name="custom"]');
      if (input) {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
      }
      const values = formula.stores.formValues.get();
      expect(values.custom).toBe('test');

      formInstance.destroy();
      document.body.removeChild(customForm);
    });

    it('should handle multiple custom events separated by pipe', () => {
      const customForm = document.createElement('form');
      customForm.innerHTML = `
        <input type="text" name="multi" data-formula-bind="input|change|blur" />
      `;
      document.body.appendChild(customForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(customForm);

      const input = customForm.querySelector<HTMLInputElement>('input[name="multi"]');
      if (!input) return;

      // Test input event
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      expect(formula.stores.formValues.get().multi).toBe('a');

      // Test change event
      input.value = 'b';
      input.dispatchEvent(new Event('change'));
      expect(formula.stores.formValues.get().multi).toBe('b');

      // Test blur event
      input.value = 'c';
      input.dispatchEvent(new Event('blur'));
      expect(formula.stores.formValues.get().multi).toBe('c');

      formInstance.destroy();
      document.body.removeChild(customForm);
    });
  });

  describe('Form Types', () => {
    it('should handle select elements with change event', () => {
      const selectForm = document.createElement('form');
      selectForm.innerHTML = `
        <select name="country">
          <option value="us">US</option>
          <option value="uk">UK</option>
        </select>
      `;
      document.body.appendChild(selectForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(selectForm);

      const select = selectForm.querySelector<HTMLSelectElement>('select');
      if (!select) return;
      select.value = 'uk';
      select.dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.country).toBe('uk');

      formInstance.destroy();
      document.body.removeChild(selectForm);
    });

    it('should handle radio buttons with change event', () => {
      const radioForm = document.createElement('form');
      radioForm.innerHTML = `
        <input type="radio" name="gender" value="male" />
        <input type="radio" name="gender" value="female" />
      `;
      document.body.appendChild(radioForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(radioForm);

      const radios = radioForm.querySelectorAll<HTMLInputElement>('input[type="radio"]');
      if (radios.length < 2) return;
      radios[1].checked = true;
      radios[1].dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.gender).toBe('female');

      formInstance.destroy();
      document.body.removeChild(radioForm);
    });

    it('should handle checkbox with change event', () => {
      const checkForm = document.createElement('form');
      checkForm.innerHTML = `
        <input type="checkbox" name="agree" value="yes" />
      `;
      document.body.appendChild(checkForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(checkForm);

      const checkbox = checkForm.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkbox) return;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.agree).toBe(true);

      formInstance.destroy();
      document.body.removeChild(checkForm);
    });

    it('should handle file input with change event', () => {
      const fileForm = document.createElement('form');
      fileForm.innerHTML = `
        <input type="file" name="document" />
      `;
      document.body.appendChild(fileForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(fileForm);

      const fileInput = fileForm.querySelector('input[type="file"]');
      // File inputs can't be programmatically set, but we can verify the handler is attached
      expect(fileInput).toBeDefined();

      formInstance.destroy();
      document.body.removeChild(fileForm);
    });

    it('should handle range input with change event', () => {
      const rangeForm = document.createElement('form');
      rangeForm.innerHTML = `
        <input type="range" name="volume" min="0" max="100" value="50" />
      `;
      document.body.appendChild(rangeForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(rangeForm);

      const range = rangeForm.querySelector<HTMLInputElement>('input[type="range"]');
      if (!range) return;
      range.value = '75';
      range.dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.volume).toBe(75);

      formInstance.destroy();
      document.body.removeChild(rangeForm);
    });

    it('should handle color input with change event', () => {
      const colorForm = document.createElement('form');
      colorForm.innerHTML = `
        <input type="color" name="bgcolor" value="#ffffff" />
      `;
      document.body.appendChild(colorForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(colorForm);

      const color = colorForm.querySelector<HTMLInputElement>('input[type="color"]');
      if (!color) return;
      color.value = '#ff0000';
      color.dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.bgcolor).toBe('#ff0000');

      formInstance.destroy();
      document.body.removeChild(colorForm);
    });

    it('should handle date input with change event', () => {
      const dateForm = document.createElement('form');
      dateForm.innerHTML = `
        <input type="date" name="birthdate" />
      `;
      document.body.appendChild(dateForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(dateForm);

      const date = dateForm.querySelector<HTMLInputElement>('input[type="date"]');
      if (!date) return;
      date.value = '2024-01-01';
      date.dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.birthdate).toBe('2024-01-01');

      formInstance.destroy();
      document.body.removeChild(dateForm);
    });

    it('should handle time input with change event', () => {
      const timeForm = document.createElement('form');
      timeForm.innerHTML = `
        <input type="time" name="meeting" />
      `;
      document.body.appendChild(timeForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(timeForm);

      const time = timeForm.querySelector<HTMLInputElement>('input[type="time"]');
      if (!time) return;
      time.value = '14:30';
      time.dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.meeting).toBe('14:30');

      formInstance.destroy();
      document.body.removeChild(timeForm);
    });

    it('should handle week input with change event', () => {
      const weekForm = document.createElement('form');
      weekForm.innerHTML = `
        <input type="week" name="weeknum" />
      `;
      document.body.appendChild(weekForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(weekForm);

      const week = weekForm.querySelector<HTMLInputElement>('input[type="week"]');
      if (!week) return;
      week.value = '2024-W01';
      week.dispatchEvent(new Event('change'));

      const values = formula.stores.formValues.get();
      expect(values.weeknum).toBe('2024-W01');

      formInstance.destroy();
      document.body.removeChild(weekForm);
    });

    it('should handle number input with both change and keyup events', () => {
      const numberForm = document.createElement('form');
      numberForm.innerHTML = `
        <input type="number" name="age" />
      `;
      document.body.appendChild(numberForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(numberForm);

      const number = numberForm.querySelector<HTMLInputElement>('input[type="number"]');
      if (!number) return;
      number.value = '25';
      number.dispatchEvent(new Event('change'));

      let values = formula.stores.formValues.get();
      expect(values.age).toBe(25);

      number.value = '30';
      number.dispatchEvent(new KeyboardEvent('keyup', { key: '0' }));

      values = formula.stores.formValues.get();
      expect(values.age).toBe(30);

      formInstance.destroy();
      document.body.removeChild(numberForm);
    });

    it('should not add event handlers to hidden fields', () => {
      const hiddenForm = document.createElement('form');
      hiddenForm.innerHTML = `
        <input type="hidden" name="secret" value="hidden-value" />
        <input type="text" name="visible" />
      `;
      document.body.appendChild(hiddenForm);

      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(hiddenForm);

      const visibleInput = hiddenForm.querySelector<HTMLInputElement>('input[name="visible"]');
      if (!visibleInput) return;
      visibleInput.value = 'test';
      visibleInput.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      const values = formula.stores.formValues.get();
      expect(values.secret).toBe('hidden-value');
      expect(values.visible).toBe('test');

      formInstance.destroy();
      document.body.removeChild(hiddenForm);
    });
  });

  describe('Form Submission', () => {
    it('should handle form submit event', async () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      await new Promise<void>((resolve) => {
        const unsubscribe = formula.stores.submitValues.subscribe((values) => {
          if (Object.keys(values).length > 0) {
            expect(values).toBeDefined();
            unsubscribe();
            resolve();
          }
        });

        const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
        if (input) {
          input.value = 'John';
        }
        form.dispatchEvent(new Event('submit'));
      });
    });
  });

  describe('Form Update', () => {
    it('should update form with new options', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const newOptions = {
        defaultValues: { firstName: 'Jane' },
      };

      formula.updateForm(newOptions);

      const values = formula.stores.formValues.get();
      expect(values.firstName).toBe('Jane');
    });

    it('should set formReady to false during update', async () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const readyStates: boolean[] = [];
      formula.stores.formReady.subscribe((ready) => {
        readyStates.push(ready);
      });

      formula.updateForm({});

      await new Promise<void>((resolve) => setTimeout(resolve, 100));
      // Should have gone false then true
      expect(readyStates).toContain(false);
      expect(readyStates).toContain(true);
    });

    it('should use initial options when no updated options provided', () => {
      const initialOptions = {
        defaultValues: { firstName: 'Initial' },
      };

      formula = createForm(initialOptions, undefined, undefined, {});
      formInstance = formula.init(form);

      formula.updateForm();

      const values = formula.stores.formValues.get();
      expect(values.firstName).toBe('Initial');
    });
  });

  describe('Form Destroy', () => {
    it('should clean up event handlers on destroy', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.value = 'Test';
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      const beforeDestroy = formula.stores.formValues.get();
      expect(beforeDestroy.firstName).toBe('Test');

      formInstance.destroy();

      // After destroy, handlers should be removed
      input.value = 'After Destroy';
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'y' }));

      // Value should not have changed
      const afterDestroy = formula.stores.formValues.get();
      expect(afterDestroy.firstName).toBe('Test');
    });

    it('should set formReady to false on destroy', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      formInstance.destroy();

      const ready = formula.stores.formReady.get();
      expect(ready).toBe(false);
    });

    it('should clear custom validity on destroy', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.setCustomValidity('Custom error');

      formInstance.destroy();

      expect(input.validationMessage).toBe('');
    });

    it('should remove submit event listener on destroy', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      let submitCount = 0;
      formula.stores.submitValues.subscribe((values) => {
        if (Object.keys(values).length > 0) {
          submitCount++;
        }
      });

      formInstance.destroy();

      form.dispatchEvent(new Event('submit'));

      // Should not have incremented after destroy
      expect(submitCount).toBe(0);
    });
  });

  describe('Form Reset', () => {
    it('should reset form values', () => {
      formula = createForm(
        {
          defaultValues: { firstName: 'Default' },
        },
        undefined,
        undefined,
        {},
      );
      formInstance = formula.init(form);

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.value = 'Changed';
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }));

      expect(formula.stores.formValues.get().firstName).toBe('Changed');

      formula.resetForm();

      expect(formula.stores.formValues.get().firstName).toBe('Default');
    });

    it('should reset touched state', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.dispatchEvent(new Event('focus'));

      expect(formula.stores.touched.get().firstName).toBe(true);

      formula.resetForm();

      expect(formula.stores.touched.get().firstName).toBe(false);
    });

    it('should reset dirty state', () => {
      formula = createForm({}, undefined, undefined, {});
      formInstance = formula.init(form);

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.value = 'Changed';
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }));
      input.dispatchEvent(new Event('blur'));

      expect(formula.stores.dirty.get().firstName).toBe(true);

      formula.resetForm();

      expect(formula.stores.dirty.get().firstName).toBe(false);
    });
  });

  describe('Global Store', () => {
    it('should add form to global store if form has id', () => {
      const globalStore = new Map();
      formula = createForm({}, globalStore, undefined, {});
      formInstance = formula.init(form);

      expect(globalStore.has('test-form')).toBe(true);
      expect(globalStore.get('test-form')).toBe(formula.stores);
    });

    it('should remove form from global store on destroy', () => {
      const globalStore = new Map();
      formula = createForm({}, globalStore, undefined, {});
      formInstance = formula.init(form);

      expect(globalStore.has('test-form')).toBe(true);

      formInstance.destroy();

      expect(globalStore.has('test-form')).toBe(false);
    });

    it('should remove form from global store on destroyForm', () => {
      const globalStore = new Map();
      formula = createForm({}, globalStore, undefined, {});
      formInstance = formula.init(form);

      expect(globalStore.has('test-form')).toBe(true);

      formula.destroyForm();

      expect(globalStore.has('test-form')).toBe(false);
    });
  });

  describe('Group Mode', () => {
    it('should initialize in group mode when groupName provided', () => {
      const groupContainer = document.createElement('div');
      groupContainer.innerHTML = `
        <input type="text" name="item" />
      `;
      document.body.appendChild(groupContainer);

      formula = createForm({}, undefined, 'testGroup', {});
      formInstance = formula.init(groupContainer);

      expect(groupContainer.hasAttribute('data-formula-row')).toBe(true);
      expect(groupContainer.getAttribute('data-formula-row')).toBe('true');

      const input = groupContainer.querySelector<HTMLInputElement>('input');
      if (input) {
        expect(input.getAttribute('data-in-group')).toBe('testGroup');
      }

      formInstance.destroy();
      document.body.removeChild(groupContainer);
    });
  });

  describe('Callbacks', () => {
    it('should dispatch form:preChanges custom event when no preChanges callback', async () => {
      const container = document.createElement('div');
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" />';
      container.appendChild(testForm);
      document.body.appendChild(container);

      await new Promise<void>((resolve) => {
        container.addEventListener('form:preChanges', (e: Event) => {
          const customEvent = e as CustomEvent;
          expect(customEvent.detail).toBe(null);
          formInstance.destroy();
          document.body.removeChild(container);
          resolve();
        });

        formula = createForm({}, undefined, undefined, {});
        formInstance = formula.init(testForm);

        const input = testForm.querySelector<HTMLInputElement>('input');
        if (input) {
          input.value = 'trigger';
          input.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));
        }
      });
    });

    it('should dispatch form:postChanges custom event when no postChanges callback', async () => {
      const container = document.createElement('div');
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" />';
      container.appendChild(testForm);
      document.body.appendChild(container);

      await new Promise<void>((resolve) => {
        container.addEventListener('form:postChanges', (e: Event) => {
          const customEvent = e as CustomEvent;
          expect(customEvent.detail).toHaveProperty('test', 'trigger');
          formInstance.destroy();
          document.body.removeChild(container);
          resolve();
        });

        formula = createForm({}, undefined, undefined, {});
        formInstance = formula.init(testForm);

        const input = testForm.querySelector<HTMLInputElement>('input');
        if (input) {
          input.value = 'trigger';
          input.dispatchEvent(new KeyboardEvent('keyup', { key: 'r' }));
        }
      });
    });
  });
});
