import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { atom, map } from 'nanostores';
import { createHandler, createSubmitHandler } from './event';

describe('Formula Event Handlers', () => {
  const storeMock = {
    formValues: map({}),
    errors: map({}),
    formValid: atom(true),
  };

  afterEach(() => {
    storeMock.formValues.set({});
    storeMock.errors.set({});
    storeMock.formValid.set(true);
  });

  describe('Select Field', () => {
    let el;
    let opts;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('select');
      el.setAttribute('name', 'testing');

      const opt1 = document.createElement('option');
      opt1.value = 'A';
      opt1.innerText = 'A';
      const opt2 = document.createElement('option');
      opt2.value = 'B';
      opt2.innerText = 'B';

      opts = [opt1, opt2];

      el.appendChild(opt1);
      el.appendChild(opt2);

      document.body.appendChild(el);

      destroyHandler = createHandler('testing', 'change', el, [el], storeMock, {}, new Map());
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a select field', () => {
      expect(destroyHandler).toBeInstanceOf(Function);
    });

    it('should update the value when there is a change event', () => {
      opts[1].selected = true;
      el.dispatchEvent(new Event('change'));
      
      // Check immediately - the handler should update synchronously
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: 'B' });
    });

    it('should update the value when its a multiple change event', () => {
      el.setAttribute('multiple', 'multiple');
      opts[0].selected = true;
      opts[1].selected = true;
      el.dispatchEvent(new Event('change'));
      
      // Check immediately - the handler should update synchronously
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: ['A', 'B'] });
    });
  });

  describe('Checkbox', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.id = 'test1';
      el.type = 'checkbox';
      el.value = 'test1';
      el.checked = false;
      el.setAttribute('name', 'testing');
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a single checkbox', () => {
      destroyHandler = createHandler('testing', 'change', el, [el], storeMock, {}, new Map());

      el.click();
      el.dispatchEvent(new Event('change'));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: true });
    });

    it('should create a handler for a multiple checkbox', () => {
      const el2 = document.createElement('input');
      el2.id = 'test2';
      el2.type = 'checkbox';
      el2.value = 'test2';
      el2.checked = false;
      el2.setAttribute('name', 'testing');
      document.body.appendChild(el2);

      destroyHandler = createHandler('testing', 'change', el, [el, el2], storeMock, {}, new Map());

      el.click();
      el.dispatchEvent(new Event('change'));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: ['test1'] });
      
      document.body.removeChild(el2);
    });
  });

  describe('Radio Group', () => {
    let elements;
    let destroyHandlers;

    beforeEach(() => {
      const el1 = document.createElement('input');
      el1.type = 'radio';
      el1.value = 'A';
      el1.name = 'testing';
      el1.id = 'test1';

      const el2 = document.createElement('input');
      el2.type = 'radio';
      el2.value = 'B';
      el2.name = 'testing';
      el2.id = 'test2';

      elements = [el1, el2];

      const handler1 = createHandler('testing', 'change', el1, elements, storeMock, {}, new Map());
      const handler2 = createHandler('testing', 'change', el2, elements, storeMock, {}, new Map());
      destroyHandlers = [handler1, handler2];
      document.body.appendChild(el1);
      document.body.appendChild(el2);
    });

    afterEach(() => {
      elements.forEach((el) => document.body.removeChild(el));
      destroyHandlers.forEach((fn) => fn());
    });

    it('should set the value when selecting a radio', () => {
      elements[0].click();
      elements[0].dispatchEvent(new Event('change'));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: 'A' });
    });

    it('should set the value when changing a radio', () => {
      elements[0].click();
      elements[0].dispatchEvent(new Event('change'));
      elements[1].click();
      elements[1].dispatchEvent(new Event('change'));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: 'B' });
    });
  });

  describe('Text Fields', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.id = 'test1';
      el.type = 'text';
      el.setAttribute('name', 'testing');
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a single text boxes', () => {
      destroyHandler = createHandler('testing', 'keyup', el, [el], storeMock, {}, new Map());

      el.value = 'A';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'A' }));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: 'A' });
    });

    it('should create a handler for a multiple text boxes', () => {
      const el2 = document.createElement('input');
      el2.id = 'test2';
      el2.type = 'text';
      el2.setAttribute('name', 'testing');
      document.body.appendChild(el2);

      destroyHandler = createHandler('testing', 'keyup', el, [el, el2], storeMock, {}, new Map());
      const secondHandler = createHandler('testing', 'keyup', el2, [el, el2], storeMock, {}, new Map());

      el.value = 'A';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'A' }));
      el2.value = 'B';
      el2.dispatchEvent(new KeyboardEvent('keyup', { key: 'B' }));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: ['A', 'B'] });
      
      secondHandler();
      document.body.removeChild(el2);
    });
  });

  describe('Number Fields', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.id = 'test1';
      el.type = 'number';
      el.setAttribute('name', 'testing');
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
      destroyHandler();
    });

    it('should create a handler for a single number boxes', () => {
      destroyHandler = createHandler('testing', 'keyup', el, [el], storeMock, {}, new Map());

      el.value = '5';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: '5' }));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: 5 });
    });

    it('should create a handler for a multiple number boxes', () => {
      const el2 = document.createElement('input');
      el2.id = 'test2';
      el2.type = 'number';
      el2.setAttribute('name', 'testing');
      document.body.appendChild(el2);

      destroyHandler = createHandler('testing', 'keyup', el, [el, el2], storeMock, {}, new Map());
      const secondHandler = createHandler('testing', 'keyup', el2, [el, el2], storeMock, {}, new Map());

      el.value = '1';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: '1' }));
      el2.value = '2';
      el2.dispatchEvent(new KeyboardEvent('keyup', { key: '2' }));
      
      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ testing: [1, 2] });
      
      secondHandler();
      document.body.removeChild(el2);
    });
  });

  describe('Bug Fix: Enrichment Store Merging', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      storeMock.enrichment = map({});
      el = document.createElement('input');
      el.type = 'text';
      el.setAttribute('name', 'field1');
      document.body.appendChild(el);
    });

    afterEach(() => {
      if (el.parentNode) document.body.removeChild(el);
      if (destroyHandler) destroyHandler();
      delete storeMock.enrichment;
    });

    it('should merge enrichment values instead of overwriting', (done) => {
      const options = {
        enrich: {
          field1: {
            getLength: (value) => value.length,
          },
          field2: {
            getUpper: (value) => value.toUpperCase(),
          },
        },
      };

      // Simulate field2 already having enrichment
      storeMock.enrichment.set({
        field2: { getUpper: 'EXISTING' },
      });

      destroyHandler = createHandler('field1', 'keyup', el, [el], storeMock, options, new Map());

      el.value = 'test';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      const value = storeMock.enrichment.get();
      // Should have both field1 and field2 enrichments
      expect(value).toHaveProperty('field1');
      expect(value).toHaveProperty('field2');
      expect(value.field1).toStrictEqual({ getLength: 4 });
      expect(value.field2).toStrictEqual({ getUpper: 'EXISTING' });
    });
  });

  describe('Bug Fix: Hidden Fields State Mutation', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.type = 'text';
      el.setAttribute('name', 'visible');
      document.body.appendChild(el);
    });

    afterEach(() => {
      if (el.parentNode) document.body.removeChild(el);
      if (destroyHandler) destroyHandler();
    });

    it('should not mutate formValues state when updating hidden fields', () => {
      const hidden1 = document.createElement('input');
      hidden1.type = 'hidden';
      hidden1.setAttribute('name', 'hidden1');
      hidden1.value = 'hiddenValue';

      const hiddenFields = new Map();
      hiddenFields.set('hidden1', [hidden1]);

      document.body.appendChild(hidden1);

      // Set initial form values
      storeMock.formValues.set({ visible: 'initial', other: 'data' });
      const originalState = storeMock.formValues.get();

      destroyHandler = createHandler('visible', 'keyup', el, [el], storeMock, {}, hiddenFields);

      el.value = 'changed';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'c' }));

      const value = storeMock.formValues.get();
      // Should have all fields
      expect(value).toHaveProperty('visible', 'changed');
      expect(value).toHaveProperty('hidden1', 'hiddenValue');
      expect(value).toHaveProperty('other', 'data');
      
      // Original state should not have been mutated
      expect(originalState).not.toHaveProperty('hidden1');
      
      document.body.removeChild(hidden1);
    });
  });

  describe('Form Validation', () => {
    let el;
    let destroyHandler;
    const storeMockWithValidity = {
      formValues: map({}),
      errors: map({}),
      formValid: atom(true),
      formValidity: map({}),
    };

    beforeEach(() => {
      el = document.createElement('input');
      el.type = 'text';
      el.setAttribute('name', 'field1');
      document.body.appendChild(el);
    });

    afterEach(() => {
      if (el.parentNode) document.body.removeChild(el);
      if (destroyHandler) destroyHandler();
      storeMockWithValidity.formValues.set({});
      storeMockWithValidity.errors.set({});
      storeMockWithValidity.formValid.set(true);
      storeMockWithValidity.formValidity.set({});
    });

    it('should run form validators when field changes', () => {
      const options = {
        formValidators: {
          passwordMatch: (values) => {
            if (values.field1 !== 'match') {
              return 'Passwords must match';
            }
            return null;
          },
        },
      };

      destroyHandler = createHandler('field1', 'keyup', el, [el], storeMockWithValidity, options, new Map());

      el.value = 'nomatch';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'n' }));

      const validity = storeMockWithValidity.formValidity.get();
      expect(validity).toHaveProperty('passwordMatch', 'Passwords must match');
      expect(storeMockWithValidity.formValid.get()).toBe(false);
    });

    it('should clear form validity when all validators pass', () => {
      const options = {
        formValidators: {
          passwordMatch: (values) => {
            if (values.field1 !== 'match') {
              return 'Passwords must match';
            }
            return null;
          },
        },
      };

      destroyHandler = createHandler('field1', 'keyup', el, [el], storeMockWithValidity, options, new Map());

      el.value = 'match';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'm' }));

      const validity = storeMockWithValidity.formValidity.get();
      expect(validity).toStrictEqual({});
      expect(storeMockWithValidity.formValid.get()).toBe(true);
    });

    it('should handle multiple form validators', () => {
      const options = {
        formValidators: {
          validator1: (values) => (values.field1.length < 5 ? 'Too short' : null),
          validator2: (values) => (values.field1.includes('test') ? null : 'Must include test'),
        },
      };

      destroyHandler = createHandler('field1', 'keyup', el, [el], storeMockWithValidity, options, new Map());

      el.value = 'hi';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'i' }));

      const validity = storeMockWithValidity.formValidity.get();
      expect(validity).toHaveProperty('validator1', 'Too short');
      expect(validity).toHaveProperty('validator2', 'Must include test');
      expect(storeMockWithValidity.formValid.get()).toBe(false);
    });
  });

  describe('Hidden Fields', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.type = 'text';
      el.setAttribute('name', 'visible');
      document.body.appendChild(el);
    });

    afterEach(() => {
      if (el.parentNode) document.body.removeChild(el);
      if (destroyHandler) destroyHandler();
    });

    it('should include single hidden field value in formValues', () => {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.setAttribute('name', 'token');
      hidden.value = 'secret123';

      const hiddenFields = new Map();
      hiddenFields.set('token', [hidden]);

      document.body.appendChild(hidden);

      destroyHandler = createHandler('visible', 'keyup', el, [el], storeMock, {}, hiddenFields);

      el.value = 'test';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ visible: 'test', token: 'secret123' });

      document.body.removeChild(hidden);
    });

    it('should include multiple hidden fields as array in formValues', () => {
      const hidden1 = document.createElement('input');
      hidden1.type = 'hidden';
      hidden1.setAttribute('name', 'ids');
      hidden1.value = 'id1';

      const hidden2 = document.createElement('input');
      hidden2.type = 'hidden';
      hidden2.setAttribute('name', 'ids');
      hidden2.value = 'id2';

      const hiddenFields = new Map();
      hiddenFields.set('ids', [hidden1, hidden2]);

      document.body.appendChild(hidden1);
      document.body.appendChild(hidden2);

      destroyHandler = createHandler('visible', 'keyup', el, [el], storeMock, {}, hiddenFields);

      el.value = 'test';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      const value = storeMock.formValues.get();
      expect(value).toStrictEqual({ visible: 'test', ids: ['id1', 'id2'] });

      document.body.removeChild(hidden1);
      document.body.removeChild(hidden2);
    });
  });

  describe('Enrichment', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      storeMock.enrichment = map({});
      el = document.createElement('input');
      el.type = 'text';
      el.setAttribute('name', 'username');
      document.body.appendChild(el);
    });

    afterEach(() => {
      if (el.parentNode) document.body.removeChild(el);
      if (destroyHandler) destroyHandler();
      delete storeMock.enrichment;
    });

    it('should enrich field value when enrich function provided', () => {
      const options = {
        enrich: {
          username: {
            toLowerCase: (value) => value.toLowerCase(),
            getLength: (value) => value.length,
          },
        },
      };

      destroyHandler = createHandler('username', 'keyup', el, [el], storeMock, options, new Map());

      el.value = 'JohnDoe';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'e' }));

      const enriched = storeMock.enrichment.get();
      expect(enriched).toHaveProperty('username');
      expect(enriched.username).toStrictEqual({
        toLowerCase: 'johndoe',
        getLength: 7,
      });
    });

    it('should not add enrichment if no enrich function for field', () => {
      const options = {
        enrich: {
          otherField: {
            transform: (value) => value.toUpperCase(),
          },
        },
      };

      destroyHandler = createHandler('username', 'keyup', el, [el], storeMock, options, new Map());

      el.value = 'test';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      const enriched = storeMock.enrichment.get();
      expect(enriched).not.toHaveProperty('username');
    });
  });

  describe('Callbacks', () => {
    let el;
    let destroyHandler;

    beforeEach(() => {
      el = document.createElement('input');
      el.type = 'text';
      el.setAttribute('name', 'field1');
      document.body.appendChild(el);
    });

    afterEach(() => {
      if (el.parentNode) document.body.removeChild(el);
      if (destroyHandler) destroyHandler();
    });

    it('should call preChanges before updating value', () => {
      const preChanges = vi.fn();
      const options = { preChanges };

      destroyHandler = createHandler('field1', 'keyup', el, [el], storeMock, options, new Map());

      el.value = 'test';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      expect(preChanges).toHaveBeenCalledTimes(1);
      expect(preChanges).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'field1',
          value: 'test',
        })
      );
    });

    it('should call postChanges after updating value', () => {
      const postChanges = vi.fn();
      const options = { postChanges };

      destroyHandler = createHandler('field1', 'keyup', el, [el], storeMock, options, new Map());

      el.value = 'test';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      expect(postChanges).toHaveBeenCalledTimes(1);
      expect(postChanges).toHaveBeenCalledWith({ field1: 'test' });
    });

    it('should call both preChanges and postChanges in correct order', () => {
      const callOrder = [];
      const preChanges = vi.fn(() => callOrder.push('pre'));
      const postChanges = vi.fn(() => callOrder.push('post'));
      const options = { preChanges, postChanges };

      destroyHandler = createHandler('field1', 'keyup', el, [el], storeMock, options, new Map());

      el.value = 'test';
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));

      expect(callOrder).toStrictEqual(['pre', 'post']);
    });
  });

  describe('Submit Handler', () => {
    let form;
    let storeMockWithSubmit;

    beforeEach(() => {
      form = document.createElement('form');
      storeMockWithSubmit = {
        formValues: map({ field1: 'test' }),
        submitValues: map({}),
      };
      document.body.appendChild(form);
    });

    afterEach(() => {
      if (form.parentNode) document.body.removeChild(form);
    });

    it('should copy formValues to submitValues when called', () => {
      const handler = createSubmitHandler(storeMockWithSubmit, form);
      handler();

      const submitValues = storeMockWithSubmit.submitValues.get();
      expect(submitValues).toStrictEqual({ field1: 'test' });
    });

    it('should call reportValidity when noValidate is false', () => {
      form.noValidate = false;
      form.reportValidity = vi.fn();

      const handler = createSubmitHandler(storeMockWithSubmit, form);
      handler();

      expect(form.reportValidity).toHaveBeenCalledTimes(1);
    });

    it('should not call reportValidity when noValidate is true', () => {
      form.noValidate = true;
      form.reportValidity = vi.fn();

      const handler = createSubmitHandler(storeMockWithSubmit, form);
      handler();

      expect(form.reportValidity).not.toHaveBeenCalled();
    });
  });
});
