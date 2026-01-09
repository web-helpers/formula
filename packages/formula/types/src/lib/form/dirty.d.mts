import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores } from '../shared/types.mjs';
/**
 * Creates a handler to set the dirty state for a group of elements
 * @param name The name of the form field group
 * @param elements The group of form elements to monitor
 * @param stores The formula stores containing the dirty and formValues stores
 *
 * @returns A function to destroy the handlers and stop monitoring
 */
export declare function createDirtyHandler(name: string, elements: FormElement[], stores: FormulaStores): () => void;
