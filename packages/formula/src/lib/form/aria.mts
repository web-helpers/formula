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
 * Recursively find the parent element that contains a radio group
 * @param el The starting element to search from
 *
 * @returns The parent element that contains the radio group, or undefined if not found
 */
function getRadioGroupParent(el?: HTMLElement): HTMLElement | undefined {
  if (!el || !el.parentElement) {
    return undefined;
  }

  const parent = el.parentElement;
  const isGroupContainer = parent.querySelectorAll(':scope input[type=radio]').length > 1;
  const hasStoppingAttribute = parent.dataset?.beakerGroup || parent.dataset?.formulaForm;

  if (isGroupContainer && !hasStoppingAttribute) {
    return parent;
  }

  return getRadioGroupParent(parent);
}

/**
 * Sets the ARIA role for the given element based on its input type
 * @param el The form element to set the ARIA role for
 * @param elements The group of elements the form element belongs to
 *
 * @returns void
 */
export function setAriaRole(el: FormElement, elements: FormElement[]): void {
  if (el.hasAttribute('aria-role')) {
    return;
  }

  const setRole = (role: string) => el.setAttribute('aria-role', role);

  if (el.type === 'radio') {
    if (elements.length < 2) {
      el?.parentElement?.setAttribute('aria-role', 'radiogroup');
    } else {
      const radioGroup = getRadioGroupParent(el);
      if (radioGroup) radioGroup.setAttribute('aria-role', 'radiogroup');
    }
    setRole('radio');
  } else {
    setRole(
      (function () {
        switch (el.type) {
          case 'select-one':
          case 'select-multiple':
          case 'checkbox':
            return el.type;
          case 'file':
            return 'file-upload';
          case 'textarea':
            return 'textbox';
          default:
            return `input-${el.type}`;
        }
      })(),
    );
  }
}

/**
 * Sets ARIA states based on the attributes of the form element
 * @param el The form element to set ARIA states for
 *
 * @returns void
 */
export function setAriaStates(el: FormElement): void {
  if (el.hasAttribute('required')) {
    el.setAttribute('aria-required', 'true');
  }
}

/**
 * Updates the ARIA checked state for the given element
 * @param element The form element to update the ARIA checked state for
 * @param elGroup The group of elements the form element belongs to
 *
 * @returns void
 */
export function setAriaValue(element: FormElement, elGroup: FormElement[]): void {
  if (element.type === 'radio') {
    elGroup.forEach((el) => el.removeAttribute('aria-checked'));
    element.setAttribute('aria-checked', (element as HTMLInputElement).checked ? 'true' : 'false');
  } else if (element.type === 'checkbox') {
    element.setAttribute('aria-checked', (element as HTMLInputElement).checked ? 'true' : 'false');
  }
}

/**
 * Sets the ARIA role for the container element
 * @param container The container element to set the ARIA role for
 * @param isGroup Whether the container is a group of elements
 *
 * @returns void
 */
export function setAriaContainer(container: HTMLElement, isGroup: boolean): void {
  if (!container.hasAttribute('aria-role')) {
    container.setAttribute('aria-role', isGroup ? 'row' : 'form');
  }
}

/**
 * Adds the ARIA button role to all buttons in the container
 * @param container The container element containing the buttons
 *
 * @returns void
 */
export function setAriaButtons(container: HTMLElement): void {
  const nonAriaButtons = Array.from(container.querySelectorAll('button:not([aria-role])'));
  nonAriaButtons.forEach((el) => el.setAttribute('aria-role', 'button'));
}
