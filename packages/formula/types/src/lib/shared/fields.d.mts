/**
 * A form element that can be an input, select or text area
 */
export type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
/**
 * Extract all fields from the form that are valid inputs with `name` property that are not part of a form group
 */
export declare function getFormFields(rootEl: HTMLElement): FormElement[];
/**
 * Extract all fields from a group that are valid inputs with `name` property
 */
export declare function getGroupFields(rootEl: HTMLElement): FormElement[];
