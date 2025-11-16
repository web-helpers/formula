import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores, EnrichFields } from '../shared/types.mjs';
interface InitOptions {
  defaultValues?: Record<string, unknown>;
  enrich?: EnrichFields;
}
/**
 * Create the form reset method
 */
export declare function createReset(node: HTMLElement, allGroups: [string, FormElement[]][], stores: FormulaStores, options?: InitOptions): () => void;
export {};
