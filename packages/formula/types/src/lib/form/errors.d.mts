import type { FormElement } from '../shared/fields.mjs';
import type { FieldValidity, ValidatorFn, ValidationMessages } from '../shared/types.mjs';
interface ValidationCheckOptions {
    messages?: ValidationMessages;
    validators?: Record<string, Record<string, ValidatorFn>>;
}
/**
 * Creates a validation checker for an element group
 */
export declare function createValidationChecker(inputGroup: string, elementGroup: FormElement[], values: Record<string, unknown>, options?: ValidationCheckOptions): (el: FormElement, elValue: unknown) => FieldValidity;
export {};
