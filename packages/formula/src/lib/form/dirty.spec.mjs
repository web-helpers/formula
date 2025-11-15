import { map } from 'nanostores';
import { createDirtyHandler } from './dirty.mjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Formula Dirty Check', () => {
  const storeMock = {
    dirty: map({}),
    formValues: map({}),
  };

  let element;
  let elements;
  let destroyHandler;

  beforeEach(() => {
    element = document.createElement('input');
    element.type = 'text';
    element.setAttribute('name', 'testing');
    elements = [element];

    document.body.appendChild(element);
    destroyHandler = createDirtyHandler('testing', elements, storeMock);
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

  it('should update if there is a change in value', () => {
    element.focus();

    // Mock writing to the store
    storeMock.formValues.set({ testing: 'testing' });

    element.blur();

    storeMock.dirty.subscribe((v) => {
      expect(v).toStrictEqual({ testing: true });
    })();
  });

  describe('Memory Leak Prevention', () => {
    it('should properly clean up subscription when destroy is called', () => {
      const subscribeSpy = vi.spyOn(storeMock.formValues, 'subscribe');
      const testElement = document.createElement('input');
      testElement.type = 'text';
      testElement.setAttribute('name', 'testField');
      document.body.appendChild(testElement);

      const handler = createDirtyHandler('testField', [testElement], storeMock);
      
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
      const handler = createDirtyHandler('testField', [testElement], storeMock);
      
      handler();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
      
      document.body.removeChild(testElement);
      removeEventListenerSpy.mockRestore();
    });
  });
});
