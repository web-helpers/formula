/**
 * Functions for setting ARIA roles and states on form elements, this provides better accessibility
 * support for screen readers and other assistive technologies within Formula forms.
 *
 * @module formula/lib/form/aria
 * @license MIT
 * @author Tane Piper <me@tane.dev>
 */
import type { FormElement } from '../shared/fields.mjs';
/**
 * Sets the ARIA role for the given element based on its input type
 * @param el The form element to set the ARIA role for
 * @param elements The group of elements the form element belongs to
 *
 * @returns void
 */
export declare function setAriaRole(el: FormElement, elements: FormElement[]): void;
/**
 * Sets ARIA states based on the attributes of the form element
 * @param el The form element to set ARIA states for
 *
 * @returns void
 */
export declare function setAriaStates(el: FormElement): void;
/**
 * Updates the ARIA checked state for the given element
 * @param element The form element to update the ARIA checked state for
 * @param elGroup The group of elements the form element belongs to
 *
 * @returns void
 */
export declare function setAriaValue(element: FormElement, elGroup: FormElement[]): void;
/**
 * Sets the ARIA role for the container element
 * @param container The container element to set the ARIA role for
 * @param isGroup Whether the container is a group of elements
 *
 * @returns void
 */
export declare function setAriaContainer(container: HTMLElement, isGroup: boolean): void;
/**
 * Adds the ARIA button role to all buttons in the container
 * @param container The container element containing the buttons
 *
 * @returns void
 */
export declare function setAriaButtons(container: HTMLElement): void;
