import { createValidationChecker } from './errors.mjs';
import { setAriaValue } from './aria.mjs';

/**
 * Get selected option values from a multi-select element
 * @private
 * @internal
 * @param {HTMLCollectionOf<HTMLOptionElement>} collection
 * @returns {string[]}
 */
function getMultiSelectOptionValues(collection) {
  const selectedValues = [];
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].selected) {
      selectedValues.push(collection[i].value);
    }
  }
  return selectedValues;
}

/**
 * Sets the value of the element
 * @param {import('../shared/fields.mjs').FormEl} element
 * @param {unknown | unknown[]} value
 * @param {boolean} isMultiValue
 * @param {import('../shared/fields.mjs').FormEl[]} elementGroup
 */
function setElementValue(element, value, isMultiValue, elementGroup) {
  if (isMultiValue) {
    elementGroup.forEach((el, i) => {
      if (el.type === 'checkbox') {
        el.checked = value.includes(el.value);
      } else {
        el.value = value[i];
      }
    });
  } else {
    if (element instanceof HTMLSelectElement) {
      [...element?.options].forEach((el) => {
        el.selected = value.includes(el.value);
      });
    } else if (element.type === 'checkbox') {
      element.checked = value;
    } else if (element.type === 'radio') {
      elementGroup.forEach((el) => (el.checked = value === el.value));
    } else if (element.type === 'file') {
      element.files = value instanceof FileList ? value : null;
    } else {
      element.value = value;
    }
  }
}

/**
 * Get the value or values from an element
 * @param {import('../shared/fields.mjs').FormEl} element
 * @param {boolean} isMultiValue
 * @param {import('../shared/fields.mjs').FormEl[]} elementGroup
 * @returns {unknown | unknown[]}
 */
function getElementValues(element, isMultiValue, elementGroup) {
  let elValue;

  if (element instanceof HTMLSelectElement) {
    elValue = element.multiple ? getMultiSelectOptionValues(element.options) : element.value || null;
  } else {
    switch (element.type) {
      case 'number':
      case 'range':
        elValue = isMultiValue
          ? elementGroup.map((v) => parseFloat(v.value)).filter((v) => !isNaN(v))
          : (() => {
              const val = parseFloat(element.value);
              return !isNaN(val) ? val : null;
            })();
        break;
      case 'checkbox':
        elValue = isMultiValue ? elementGroup.filter((e) => e.checked).map((e) => e.value) : element.checked;
        break;
      case 'radio':
        const foundElement = elementGroup.find((el) => el.checked);
        elValue = foundElement ? foundElement.value : null;
        break;
      case 'file':
        elValue = element.files;
        break;
      default:
        elValue = isMultiValue ? elementGroup.map((v) => v.value) : element.value || null;
    }
  }

  return elValue;
}

/**
 * Create a data handler for any type of input field
 * @param {string} name
 * @param {import('../shared/fields.mjs').FormEl[]} elementGroup
 * @param {import('./form.mjs').FormulaOptions} options
 * @param {import('../shared/stores.mjs').FormulaStores} stores
 */
export function createFieldExtract(name, elementGroup, options, stores) {
  const validator = createValidationChecker(name, elementGroup, options);

  let isMultiValue = false;
  if (elementGroup[0].type !== 'radio') {
    isMultiValue = !elementGroup[0].multiple && elementGroup.length > 1;
  }

  /**
   * Function called on every element update, can also be called at initial value
   * Welcome to edge-case hell
   */
  const fn = (instanceOpts, element, isInit, isReset) => {
    let value;
    if (isInit && instanceOpts?.defaultValues?.[name]) {
      value = isMultiValue ? instanceOpts?.defaultValues?.[name] || [] : instanceOpts?.defaultValues?.[name] || '';
    } else {
      value = stores.formValues.get(name)?.[name] ?? (isMultiValue ? [] : '');
    }

    if (!isReset) {
      const elValue = getElementValues(element, isMultiValue, elementGroup);
      // Handle empty value fields that return null
      if (elValue === null && !isInit && value.length > 0) {
        value = '';
      }
      if (elValue !== null) {
        value = isInit && isMultiValue && elValue?.length === 0 ? value : elValue;
      }
    }
    if (isInit || isReset) {
      setElementValue(element, value, isMultiValue, elementGroup);
    }

    setAriaValue(element, elementGroup);

    if (element.dataset?.formulaName) {
      name = element.dataset.formulaName;
    }

    return {
      name,
      value,
      ...validator(element, value),
    };
  };
  return fn.bind(this, options);
}
