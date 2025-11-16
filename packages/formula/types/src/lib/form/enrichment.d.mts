import type { EnrichFields } from '../shared/types.mjs';
interface EnrichmentOptions {
  enrich?: EnrichFields;
}
/**
 * Creates an enrichment object for the named group
 */
export declare function createEnrichField(name: string, options?: EnrichmentOptions): (value: unknown) => Record<string, unknown>;
export {};
