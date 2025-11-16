import type { FormElement } from '../shared/fields.mjs';
import type { FieldValidity, ValidatorFn, ValidationMessages } from '../shared/types.mjs';

interface ValidationCheckOptions {
  messages?: ValidationMessages;
  validators?: Record<string, Record<string, ValidatorFn>>;
}

/**
 * Extracts validity errors from the element and merges with custom errors.
 */
function extractErrors(el: FormElement, custom?: Record<string, string>): Record<string, string> {
  const output: Record<string, string> = {};
  for (const key in el.validity) {
    if (key !== 'valid' && el.validity[key as keyof ValidityState]) {
      output[key] = el.validationMessage || key;
    }
  }
  return { ...output, ...custom };
}

/**
 * Gets the result of any custom validations available on the fields.
 */
function getCustomValidations(value: unknown, values: Record<string, unknown>, validations: Record<string, ValidatorFn> = {}): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.entries(validations).forEach(([key, validation]) => {
    const message = validation(value, values);
    if (message !== null) {
      errors[key] = message;
    }
  });

  return errors;
}

/**
 * Creates a validation checker for an element group
 */
export function createValidationChecker(
  inputGroup: string,
  elementGroup: FormElement[],
  values: Record<string, unknown>,
  options?: ValidationCheckOptions,
): (el: FormElement, elValue: unknown) => FieldValidity {
  return (el: FormElement, elValue: unknown): FieldValidity => {
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
    const customMessages: Record<string, string> = {
      ...options?.messages?.[inputGroup],
      ...(el.dataset as Record<string, string>),
    };

    // Check for any custom validations
    const customErrors = getCustomValidations(elValue, values, options?.validators?.[inputGroup]);

    const errors = extractErrors(el, customErrors);
    const errorKeys = Object.keys(errors);

    // If there are errors, check if we have a custom message for the first error
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      // Check if there's a custom message for this error type
      if (customMessages[firstErrorKey]) {
        el.setCustomValidity(customMessages[firstErrorKey]);
      } else if (customErrors[firstErrorKey]) {
        // Use the custom validator's message
        el.setCustomValidity(customErrors[firstErrorKey]);
      }
    }
    
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
