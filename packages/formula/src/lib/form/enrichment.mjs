/**
 * Creates an enrichment object for the named group,
 * @param {string} name - The name of the enrichment group
 * @param {import('../../../index.mjs').FormulaOptions} options - The options object
 */
export function createEnrichField(name, options) {
  return (value) =>
    Object.entries(options?.enrich[name] ?? {}).reduce(
      (a, [key, fn]) => (a[key] = fn(value)) && a,
      {}
    );
}
