import type { EnrichFields } from '../shared/types.mjs';

interface EnrichmentOptions {
  enrich?: EnrichFields;
}

/**
 * Creates an enrichment object for the named group
 */
export function createEnrichField(
  name: string,
  options?: EnrichmentOptions
): (value: unknown) => Record<string, unknown> {
  return (value: unknown) =>
    Object.entries(options?.enrich?.[name] ?? {}).reduce((a, [key, fn]) => {
      a[key] = fn(value);
      return a;
    }, {} as Record<string, unknown>);
}
