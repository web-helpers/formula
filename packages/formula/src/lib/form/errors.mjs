/**
 * Extracts validity errors from the element and merges with custom errors.
 *
 * @private
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} el - The element to read the constraints from.
 * @param {Record<string, boolean>=} custom - Custom error keys.
 * @returns {Record<string, boolean>} - An object containing keys for validity errors, set to true.
 */
function extractErrors(el, custom) {
  const output = {};
  for (const key in el.validity) {
    if (key !== 'valid' && el.validity[key]) {
      output[key] = el.validity[key];
    }
  }
  return { ...output, ...custom };
}

/**
 * Gets the result of any custom validations available on the fields.
 * @param {unknown | unknown[]} value
 * @param {Record<string, ValidationFn>} validations
 * @returns {[Record<string, string>, Record<string, boolean>]} - An array containing the messages and errors.
 */
function getCustomValidations(value, validations = {}) {
  const messages = {};
  const errors = {};

  Object.entries(validations).forEach(([key, validation]) => {
    const message = validation(value);
    if (message !== null) {
      messages[key] = message;
      errors[key] = true;
    }
  });

  return [messages, errors];
}

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
export function createValidationChecker(inputGroup, elementGroup, options) {
  /**
   * Method called each time a field is updated.
   *
   * @private
   * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} el - The element to validate against.
   * @param {unknown | unknown[]} elValue - The value for the element.
   * @returns {FormulaError} - A Formula Error object.
   */
  return (el, elValue) => {
    // Reset the validity
    elementGroup.forEach((groupEl) => {
      groupEl.setCustomValidity('');
      groupEl.removeAttribute('data-formula-invalid');
    });

    // If there are no options, just return the current error
    if (!options) {
      const valid = el.checkValidity();
      if (!valid) {
        el.setAttribute('data-formula-invalid', 'true');
      }
      return {
        valid,
        invalid: !valid,
        message: el.validationMessage,
        errors: extractErrors(el),
      };
    }

    // Check for any custom messages in the options or dataset
    const customMessages = {
      ...options?.messages?.[inputGroup],
      ...el.dataset,
    };

    // Check for any custom validations
    const [messages, customErrors] = getCustomValidations(
      elValue,
      options?.validators?.[inputGroup]
    );

    const errors = extractErrors(el, customErrors);
    const errorKeys = Object.keys(errors);

    if (el.checkValidity()) {
      if (errorKeys.length > 0) {
        el.setCustomValidity(messages[errorKeys[0]]);
      }
    } else {
      if (customMessages[errorKeys[0]]) {
        el.setCustomValidity(customMessages[errorKeys[0]]);
      }
    }
    // Recheck validity and show any messages
    const valid = el.checkValidity();
    if (!valid) {
      el.setAttribute('data-formula-invalid', 'true');
    }

    return {
      valid,
      invalid: !valid,
      message: el.validationMessage,
      errors,
    };
  };
}
