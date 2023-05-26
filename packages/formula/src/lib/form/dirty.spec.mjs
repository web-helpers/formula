import { map } from 'nanostores';
import { createDirtyHandler } from './dirty.mjs';

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
});
