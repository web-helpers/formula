import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores } from '../shared/types.mjs';
/**
 * Creates the handler for a group of elements for the touch event
 */
export declare function createTouchHandlers(name: string, elements: FormElement[], stores: FormulaStores): () => void;
