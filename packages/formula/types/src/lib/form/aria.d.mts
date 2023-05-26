/**
 * Sets the ARIA role for the given element based on its input type.
 * @param {import('../shared/fields.mjs').FormEl} el - The form element.
 * @param {import('../shared/fields.mjs').FormEl[]} elements - A collection of form elements.
 */
export function setAriaRole(el: import('../shared/fields.mjs').FormEl, elements: import('../shared/fields.mjs').FormEl[]): void;
/**
 * Sets ARIA states based on the attributes of the form element.
 * @param {import('../shared/fields.mjs').FormEl} el - The form element.
 */
export function setAriaStates(el: import('../shared/fields.mjs').FormEl): void;
/**
 * Updates the ARIA checked state for the given element and other elements in the group.
 * @param {import('../shared/fields.mjs').FormEl} element - The form element.
 * @param {import('../shared/fields.mjs').FormEl[]} elGroup - A collection of form elements.
 */
export function setAriaValue(element: import('../shared/fields.mjs').FormEl, elGroup: import('../shared/fields.mjs').FormEl[]): void;
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
