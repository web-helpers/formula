import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores } from '../shared/types.mjs';
/**
 * Creates a handler to set the dirty state for a group of elements
 */
export declare function createDirtyHandler(name: string, elements: FormElement[], stores: FormulaStores): () => void;
