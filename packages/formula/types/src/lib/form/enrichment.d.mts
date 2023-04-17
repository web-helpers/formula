/**
 * Enrich function is used with field data to generate an enrichment
 * @typedef {(value: unknown | unknown[]) => unknown} EnrichFn
 */
/**
 * A single validation rule with the name of the rule and validation function
 * @typedef {Record<string, EnrichFn>} EnrichValue
 */
/**
 * Custom validation rules for Formula
 * @typedef {Record<string, EnrichValue>} EnrichFields
 */
/**
 * Creates an enrichment object for the named group,
 * @param {string} name - The name of the enrichment group
 * @param {import('./form.mjs').FormulaOptions} options - The options object
 */
export function createEnrichField(name: string, options: import('./form.mjs').FormulaOptions): (value: any) => [string, EnrichFn];
/**
 * Enrich function is used with field data to generate an enrichment
 */
export type EnrichFn = (value: unknown | unknown[]) => unknown;
/**
 * A single validation rule with the name of the rule and validation function
 */
export type EnrichValue = Record<string, EnrichFn>;
/**
 * Custom validation rules for Formula
 */
export type EnrichFields = Record<string, EnrichValue>;
