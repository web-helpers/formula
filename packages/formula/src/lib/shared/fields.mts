/**
 * A form element that can be an input, select or text area
 */
export type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Type guard to check if an element is a form element
 */
function isFormElement(el: Element): el is FormElement {
  return 'checkValidity' in el && typeof (el as HTMLInputElement).checkValidity === 'function';
}

/**
 * Extract all fields from the form that are valid inputs with `name` property that are not part of a form group
 */
export function getFormFields(rootEl: HTMLElement): FormElement[] {
  const nodeList = rootEl.querySelectorAll('*[name]:not([data-in-group])');
  return Array.from(nodeList).filter(isFormElement);
}

/**
 * Extract all fields from a group that are valid inputs with `name` property
 */
export function getGroupFields(rootEl: HTMLElement): FormElement[] {
  const nodeList = rootEl.querySelectorAll('*[name]');
  return Array.from(nodeList).filter(isFormElement);
}
