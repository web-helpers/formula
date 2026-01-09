import { describe, it, expect } from 'vitest';
import { eventsWithFormKeys } from './lib.mjs';
import type { FormulaStores } from '../shared/types.mjs';

describe('eventsWithFormKeys', () => {
  it('should convert camelCase store keys to colon-separated event names', () => {
    const stores = {
      formValues: {},
      formValid: {},
      errors: {},
    } as unknown as FormulaStores;

    const eventMap = eventsWithFormKeys(stores);

    expect(eventMap.get('formValues')).toBe('form:values');
    expect(eventMap.get('formValid')).toBe('form:valid');
  });

  it('should prepend "form:" to single-word keys', () => {
    const stores = {
      errors: {},
      touched: {},
      dirty: {},
    } as unknown as FormulaStores;

    const eventMap = eventsWithFormKeys(stores);

    expect(eventMap.get('errors')).toBe('form:errors');
    expect(eventMap.get('touched')).toBe('form:touched');
    expect(eventMap.get('dirty')).toBe('form:dirty');
  });

  it('should handle multiple capital letters correctly', () => {
    const stores = {
      formValidity: {},
      submitValues: {},
      enrichment: {},
    } as unknown as FormulaStores;

    const eventMap = eventsWithFormKeys(stores);

    expect(eventMap.get('formValidity')).toBe('form:validity');
    expect(eventMap.get('submitValues')).toBe('submit:values');
    expect(eventMap.get('enrichment')).toBe('form:enrichment');
  });

  it('should return a Map with all store keys', () => {
    const stores = {
      formValues: {},
      errors: {},
      touched: {},
    } as unknown as FormulaStores;

    const eventMap = eventsWithFormKeys(stores);

    expect(eventMap).toBeInstanceOf(Map);
    expect(eventMap.size).toBe(3);
    expect(eventMap.has('formValues')).toBe(true);
    expect(eventMap.has('errors')).toBe(true);
    expect(eventMap.has('touched')).toBe(true);
  });

  it('should handle stores with "is" prefix', () => {
    const stores = {
      formValid: {},
      formReady: {},
    } as unknown as FormulaStores;

    const eventMap = eventsWithFormKeys(stores);

    expect(eventMap.get('formValid')).toBe('form:valid');
    expect(eventMap.get('formReady')).toBe('form:ready');
  });
});
