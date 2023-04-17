/**
 * Creates a validation checker for an element group. Checks with custom validators if they exist,
 * and also checks for custom messages.
 *
 * @private
 * @param {string} inputGroup - The name of the group of elements that this validation message will update.
 * @param {import('../shared/fields.mjs').FormEl} elementGroup - The element group containing the element siblings.
 * @param {import('./form.mjs').FormulaOptions=} options - The passed formula options.
 * @returns {Function} - Function called each time an element is updated, which returns the field validity state.
 */
export function createValidationChecker(inputGroup: string, elementGroup: import('../shared/fields.mjs').FormEl, options?: import('./form.mjs').FormulaOptions | undefined): Function;
/**
 * A validation function, it should return null if there is no error, or a string if there is an error
 */
export type ValidationFn = (value: unknown | unknown[]) => string | null;
/**
 * A single validation rule with the name of the rule and validation function
 */
export type ValidationRule = Record<string, ValidationFn>;
/**
 * Custom validation rules for Formula
 */
export type ValidationRules = Record<string, ValidationRule>;
