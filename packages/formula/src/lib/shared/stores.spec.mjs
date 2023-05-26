import { createFormStores } from './stores.mjs';

describe('Formula Stores', () => {
  it('should create empty default stores', () => {
    const stores = createFormStores();
    expect(stores.formValues.get()).toStrictEqual({});
  });

  it('should create store with default values', () => {
    const stores = createFormStores({
      defaultValues: {
        foo: 'testing',
        bar: 'formula',
      },
    });
    expect(stores.formValues.get()).toStrictEqual({
      foo: 'testing',
      bar: 'formula',
    });
  });

  it('should create store with default validity', () => {
    const stores = createFormStores({
      defaultValues: {
        foo: 'testing',
      },
    });
    expect(stores.errors.get()).toStrictEqual({
      foo: {
        valid: true,
        invalid: false,
        message: '',
        errors: {},
      },
    });
  });

  it('should create store with default touched', () => {
    const stores = createFormStores({
      defaultValues: {
        foo: 'testing',
      },
    });
    expect(stores.touched.get()).toStrictEqual({ foo: false });
  });

  it('should create store with default dirty', () => {
    const stores = createFormStores({
      defaultValues: {
        foo: 'testing',
      },
    });
    expect(stores.dirty.get()).toStrictEqual({ foo: false });
  });

  it('should create store with default enrichment', () => {
    const stores = createFormStores({
      defaultValues: {
        foo: 'testing',
      },
      enrich: {
        foo: {
          valueLength: (value) => value.length,
        },
      },
    });
    expect(stores.enrichment.get()).toStrictEqual({
      foo: {
        valueLength: 7,
      },
    });
  });
});
