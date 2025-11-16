import { map } from 'nanostores';
import { createDirtyHandler } from './dirty.mjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { FormElement } from '../shared/fields.mjs';

describe('Formula Dirty Check', () => {
  const storeMock = {
    dirty: map({}),
    formValues: map({}),
  };

  let element: FormElement;
  let elements: FormElement[] = [];
  let destroyHandler: () => void;

  beforeEach(() => {
    element = document.createElement('input');
    element.type = 'text';
    element.setAttribute('name', 'testing');
    elements = [element];

    document.body.appendChild(element);
    destroyHandler = createDirtyHandler('testing', elements, storeMock as any);
  });

  afterEach(() => {
    document.body.removeChild(element);
    destroyHandler();
  });

  it('should create the handler function', () => {
    expect(destroyHandler).toBeInstanceOf(Function);
  });

  it('should set the default value to false', () => {
    storeMock.dirty.subscribe((v) => {
      expect(v).toStrictEqual({ testing: false });
    })();
  });

  it('should not update if there is no change in value', () => {
    element.focus();
    element.blur();
    storeMock.dirty.subscribe((v) => {
      expect(v).toStrictEqual({ testing: false });
    })();
  });

  it('should update when value changes from initial', () => {
    //  Set initial value in store first
    storeMock.formValues.set({ testing: '' });

    // Create handler after initial value is set
    const testElement = document.createElement('input');
    testElement.type = 'text';
    testElement.setAttribute('name', 'testField');
    testElement.value = '';
    document.body.appendChild(testElement);

    const testHandler = createDirtyHandler('testField', [testElement], storeMock as any);

    // Simulate user interaction
    testElement.focus();
    testElement.value = 'changed';

    // Update store to reflect the change (as would happen via event handler)
    storeMock.formValues.set({ testing: '', testField: 'changed' });

    testElement.blur();

    storeMock.dirty.subscribe((v) => {
      expect((v as Record<string, boolean>).testField).toBe(true);
    })();

    testHandler();
    document.body.removeChild(testElement);
  });

  describe('Memory Leak Prevention', () => {
    it('should properly clean up subscription when destroy is called', () => {
      const subscribeSpy = vi.spyOn(storeMock.formValues, 'subscribe');
      const testElement = document.createElement('input');
      testElement.type = 'text';
      testElement.setAttribute('name', 'testField');
      document.body.appendChild(testElement);

      const handler = createDirtyHandler('testField', [testElement], storeMock as any);

      // Subscribe should have been called once
      expect(subscribeSpy).toHaveBeenCalledTimes(1);

      // Get the unsubscribe function
      const unsubCall = subscribeSpy.mock.results[0].value;
      expect(unsubCall).toBeInstanceOf(Function);

      // Clean up
      handler();
      document.body.removeChild(testElement);
      subscribeSpy.mockRestore();
    });

    it('should remove blur event listeners when destroy is called', () => {
      const testElement = document.createElement('input');
      testElement.type = 'text';
      testElement.setAttribute('name', 'testField');
      document.body.appendChild(testElement);

      const removeEventListenerSpy = vi.spyOn(testElement, 'removeEventListener');
      const handler = createDirtyHandler('testField', [testElement], storeMock as any);

      handler();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));

      document.body.removeChild(testElement);
      removeEventListenerSpy.mockRestore();
    });
  });
});
