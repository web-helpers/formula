import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores } from '../shared/types.mjs';
import type { FieldValidity, ValidationMessages, ValidationRules, EnrichFields } from '../shared/types.mjs';
interface ExtractOptions {
    defaultValues?: Record<string, unknown>;
    messages?: ValidationMessages;
    validators?: ValidationRules;
    enrich?: EnrichFields;
}
interface FieldExtractResult extends FieldValidity {
    name: string;
    value: unknown;
}
/**
 * Create a data handler for any type of input field
 */
export declare function createFieldExtract(name: string, elementGroup: FormElement[], stores: FormulaStores, options?: ExtractOptions): (element: FormElement, isInit: boolean, isReset: boolean) => FieldExtractResult;
export {};
