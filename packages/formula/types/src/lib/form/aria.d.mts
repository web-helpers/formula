import type { FormElement } from '../shared/fields.mjs';
/**
 * Sets the ARIA role for the given element based on its input type
 */
export declare function setAriaRole(el: FormElement, elements: FormElement[]): void;
/**
 * Sets ARIA states based on the attributes of the form element
 */
export declare function setAriaStates(el: FormElement): void;
/**
 * Updates the ARIA checked state for the given element
 */
export declare function setAriaValue(element: FormElement, elGroup: FormElement[]): void;
/**
 * Sets the ARIA role for the container element
 */
export declare function setAriaContainer(container: HTMLElement, isGroup: boolean): void;
/**
 * Adds the ARIA button role to all buttons in the container
 */
export declare function setAriaButtons(container: HTMLElement): void;
