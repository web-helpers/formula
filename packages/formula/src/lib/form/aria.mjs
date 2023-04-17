/**
 * Recursively find the parent element that contains a radio group, stopping at elements with 'beakerGroup' or
 * 'formulaForm' data attributes.
 * @param {HTMLElement=} el - The HTML element containing the radio group.
 * @returns {HTMLElement|undefined} - The parent container of the radio group or undefined if not found.
 */
function getRadioGroupParent(el) {
  if (!el || !el.parentElement) {
    return undefined;
  }

  const parent = el.parentElement;
  const isGroupContainer =
    parent.querySelectorAll(':scope input[type=radio]').length > 1;
  const hasStoppingAttribute =
    parent.dataset?.beakerGroup || parent.dataset?.formulaForm;

  if (isGroupContainer && !hasStoppingAttribute) {
    return parent;
  }

  return getRadioGroupParent(parent);
}

/**
 * Sets the ARIA role for the given element based on its input type.
 * @param {import('../shared/fields.mjs').FormEl} el - The form element.
 * @param {import('../shared/fields.mjs').FormEl[]} elements - A collection of form elements.
 */
export function setAriaRole(el, elements) {
  if (el.hasAttribute('aria-role')) {
    return;
  }

  /**
   *
   * @param {string} role
   * @returns
   */
  const setRole = (role) => el.setAttribute('aria-role', role);

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
      })()
    );
  }
}

/**
 * Sets ARIA states based on the attributes of the form element.
 * @param {import('../shared/fields.mjs').FormEl} el - The form element.
 */
export function setAriaStates(el) {
  if (el.hasAttribute('required')) {
    el.setAttribute('aria-required', 'true');
  }
}

/**
 * Updates the ARIA checked state for the given element and other elements in the group.
 * @param {import('../shared/fields.mjs').FormEl} element - The form element.
 * @param {import('../shared/fields.mjs').FormEl[]} elGroup - A collection of form elements.
 */
export function setAriaValue(element, elGroup) {
  if (element.type === 'radio') {
    elGroup.forEach((el) => el.removeAttribute('aria-checked'));
  }

  element.setAttribute('aria-checked', element?.checked ? 'true' : 'false');
}

/**
 * Sets the ARIA role for the container element based on whether it is a group or not.
 * @param {HTMLElement} container - The container element.
 * @param {boolean} isGroup - Whether the container is a group.
 */
export function setAriaContainer(container, isGroup) {
  if (!container.hasAttribute('aria-role')) {
    container.setAttribute('aria-role', isGroup ? 'row' : 'form');
  }
}

/**
 * Adds the ARIA button role to all buttons in the container that do not have an ARIA role.
 * @param {HTMLElement} container - The container element with buttons.
 */
export function setAriaButtons(container) {
  const nonAriaButtons = Array.from(
    container.querySelectorAll('button:not([aria-role])')
  );
  nonAriaButtons.forEach((el) => el.setAttribute('aria-role', 'button'));
}
