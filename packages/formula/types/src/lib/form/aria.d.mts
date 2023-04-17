/**
 * Sets the ARIA role for the given element based on its input type.
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} el - The form element.
 * @param {HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[]} elements - A collection of form elements.
 */
export function setAriaRole(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, elements: HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[]): void;
/**
 * Sets ARIA states based on the attributes of the form element.
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} el - The form element.
 */
export function setAriaStates(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void;
/**
 * Updates the ARIA checked state for the given element and other elements in the group.
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} element - The form element.
 * @param {HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[]} elGroup - A collection of form elements.
 */
export function setAriaValue(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, elGroup: HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[]): void;
/**
 * Sets the ARIA role for the container element based on whether it is a group or not.
 * @param {HTMLElement} container - The container element.
 * @param {boolean} isGroup - Whether the container is a group.
 */
export function setAriaContainer(container: HTMLElement, isGroup: boolean): void;
/**
 * Adds the ARIA button role to all buttons in the container that do not have an ARIA role.
 * @param {HTMLElement} container - The container element with buttons.
 */
export function setAriaButtons(container: HTMLElement): void;
