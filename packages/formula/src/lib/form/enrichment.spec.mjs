import { describe, it, expect, beforeEach } from 'vitest';
import { createEnrichField } from './enrichment.mjs';

describe('Formula Enrichment', () => {
  let enrich;

  beforeEach(() => {
    enrich = createEnrichField('testing', {
      enrich: {
        testing: {
          getLength: (value) => value.length,
        },
      },
    });
  });

  it('should update the enrich store', () => {
    const result = enrich('hello');
    expect(result).toStrictEqual({ getLength: 5 });
  });

  describe('Bug Fix: Accumulator Return', () => {
    it('should properly return accumulator in reduce', () => {
      const multiEnrich = createEnrichField('testing', {
        enrich: {
          testing: {
            getLength: (value) => value.length,
            getUpper: (value) => value.toUpperCase(),
            getLower: (value) => value.toLowerCase(),
          },
        },
      });

      const result = multiEnrich('Hello');
      
      expect(result).toStrictEqual({
        getLength: 5,
        getUpper: 'HELLO',
        getLower: 'hello',
      });
    });

    it('should handle empty enrichment object', () => {
      const emptyEnrich = createEnrichField('testing', {
        enrich: {
          testing: {},
        },
      });

      const result = emptyEnrich('hello');
      expect(result).toStrictEqual({});
    });

    it('should handle missing enrichment config', () => {
      const noEnrich = createEnrichField('testing', { enrich: {} });
      const result = noEnrich('hello');
      expect(result).toStrictEqual({});
    });
  });
});
