import type { EnrichFields } from '../shared/types.mjs';

/**
 * Options for enrichment functions
 */
export interface EnrichmentOptions {
  /**
   * Enrichment functions mapped by field name
   */
  enrich?: EnrichFields;
}

/**
 * Creates an enrichment object for the named group
 * @param name The name of the form field group
 * @param options Optional enrichment functions
 *
 * @returns A function that enriches the field values based on the provided options
 */
export function createEnrichField(name: string, options?: EnrichmentOptions): (value: unknown) => Record<string, unknown> {
  return (value: unknown) =>
    Object.entries(options?.enrich?.[name] ?? {}).reduce(
      (a, [key, fn]) => {
        a[key] = fn(value);
        return a;
      },
      {} as Record<string, unknown>,
    );
}
