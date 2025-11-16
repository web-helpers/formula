import { createValidationChecker } from './errors.mjs';
import { setAriaValue } from './aria.mjs';
import type { FormElement } from '../shared/fields.mjs';
import type { FormulaStores } from '../shared/types.mjs';
import type { FieldValidity, ValidationMessages, ValidationRules, EnrichFields } from '../shared/types.mjs';

interface ExtractOptions {
  defaultValues?: Record<string, unknown>;
  messages?: ValidationMessages;
  validators?: ValidationRules;
  enrich?: EnrichFields;
}

interface FieldExtractResult extends FieldValidity {
  name: string;
  value: unknown;
}

/**
 * Get selected option values from a multi-select element
 */
function getMultiSelectOptionValues(collection: HTMLCollectionOf<HTMLOptionElement>): string[] {
  const selectedValues: string[] = [];
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].selected) {
      selectedValues.push(collection[i].value);
    }
  }
  return selectedValues;
}

/**
 * Sets the value of the element
 */
function setElementValue(
  element: FormElement,
  value: unknown,
  isMultiValue: boolean,
  elementGroup: FormElement[]
): void {
  if (isMultiValue) {
    const valueArray = Array.isArray(value) ? value : [];
    elementGroup.forEach((el, i) => {
      if (el.type === 'checkbox') {
        (el as HTMLInputElement).checked = valueArray.includes(el.value);
      } else {
        el.value = String(valueArray[i] ?? '');
      }
    });
  } else {
    if (element instanceof HTMLSelectElement) {
      const valueArray = Array.isArray(value) ? value : [value];
      Array.from(element.options).forEach((el) => {
        el.selected = valueArray.includes(el.value);
      });
    } else if (element.type === 'checkbox') {
      (element as HTMLInputElement).checked = Boolean(value);
    } else if (element.type === 'radio') {
      elementGroup.forEach((el) => ((el as HTMLInputElement).checked = value === el.value));
    } else if (element.type === 'file') {
      (element as HTMLInputElement).files = value instanceof FileList ? value : null;
    } else {
      element.value = String(value ?? '');
    }
  }
}

/**
 * Get the value or values from an element
 */
function getElementValues(
  element: FormElement,
  isMultiValue: boolean,
  elementGroup: FormElement[]
): unknown {
  let elValue: unknown;

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
        elValue = isMultiValue ? elementGroup.filter((e) => (e as HTMLInputElement).checked).map((e) => e.value) : (element as HTMLInputElement).checked;
        break;
      case 'radio':
        const foundElement = elementGroup.find((el) => (el as HTMLInputElement).checked);
        elValue = foundElement ? foundElement.value : null;
        break;
      case 'file':
        elValue = (element as HTMLInputElement).files;
        break;
      default:
        elValue = isMultiValue ? elementGroup.map((v) => v.value) : element.value || null;
    }
  }

  return elValue;
}

/**
 * Create a data handler for any type of input field
 */
export function createFieldExtract(
  name: string,
  elementGroup: FormElement[],
  stores: FormulaStores,
  options?: ExtractOptions
): (element: FormElement, isInit: boolean, isReset: boolean) => FieldExtractResult {
  const values = stores.formValues.get();
  const validator = createValidationChecker(name, elementGroup, values, options);

  let isMultiValue = false;
  if (elementGroup[0].type !== 'radio') {
    isMultiValue = !(elementGroup[0] as HTMLSelectElement).multiple && elementGroup.length > 1;
  }

  /**
   * Function called on every element update, can also be called at initial value
   */
  return (element: FormElement, isInit: boolean, isReset: boolean): FieldExtractResult => {
    let value: unknown;
    if (isInit && options?.defaultValues?.[name] !== undefined) {
      value = isMultiValue ? options?.defaultValues?.[name] || [] : options?.defaultValues?.[name] || '';
    } else {
      value = stores.formValues.get()[name] ?? (isMultiValue ? [] : '');
    }

    if (!isReset) {
      const elValue = getElementValues(element, isMultiValue, elementGroup);
      // Handle empty value fields that return null
      if (elValue === null && !isInit && (Array.isArray(value) ? value.length > 0 : value !== '')) {
        value = '';
      }
      if (elValue !== null) {
        value = isInit && isMultiValue && Array.isArray(elValue) && elValue.length === 0 ? value : elValue;
      }
    }

    if (isInit || isReset) {
      setElementValue(element, value, isMultiValue, elementGroup);
    }

    setAriaValue(element, elementGroup);

    let fieldName = name;
    if (element.dataset?.formulaName) {
      fieldName = element.dataset.formulaName;
    }

    return {
      name: fieldName,
      value,
      ...validator(element, value),
    };
  };
}
