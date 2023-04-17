/**
 * A form element that can be an input, select or text area
 * @typedef {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} FormEl
 */

/**
 * Extract all fields from the form that are valid inputs with `name` property that are not part of a form group
 *
 * @private
 * @internal
 * @param {HTMLElement} rootEl
 * @returns {FormEl[]} Array of form elements
 */
export function getFormFields(rootEl) {
  const nodeList = rootEl.querySelectorAll('*[name]:not([data-in-group])'); // as NodeListOf<HTMLElement>;
  return Array.from(nodeList).filter((el) => el.checkValidity); //as FormEl[];
}

/**
 * Extract all fields from a group that are valid inputs with `name` property
 * @param {HTMLElement} rootEl
 * @returns {FormEl[]} Array of form elements
 */
export function getGroupFields(rootEl) {
  /* @type {NodeListOf<HTMLElement>} */
  const nodeList = rootEl.querySelectorAll('*[name]'); // as NodeListOf<HTMLElement>;
  return Array.from(nodeList).filter((el) => el.checkValidity); // as FormEl[];
}
