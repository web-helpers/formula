/**
 * Creates a validation checker for an element group. Checks with custom validators if they exist,
 * and also checks for custom messages.
 *
 * @private
 * @param {string} inputGroup - The name of the group of elements that this validation message will update.
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} elementGroup - The element group containing the element siblings.
 * @param {FormulaOptions=} options - The passed formula options.
 * @returns {Function} - Function called each time an element is updated, which returns the field validity state.
 */
export function createValidationChecker(inputGroup: string, elementGroup: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, options?: FormulaOptions | undefined): Function;
//# sourceMappingURL=errors.d.mts.map