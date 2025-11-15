import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { atom, map } from 'nanostores';
import { createFieldExtract } from './extract.mjs';

describe('Formula Extract', () => {
  let storeMock;
  let element;
  let elements;

  beforeEach(() => {
    storeMock = {
      formValues: map({ testing: 'initial' }),
      errors: map({}),
      formValid: atom(true),
    };

    element = document.createElement('input');
    element.type = 'text';
    element.setAttribute('name', 'testing');
    element.value = 'initial';
    elements = [element];
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('Store Access Pattern', () => {
    it('should correctly access store values using formValues.get()', () => {
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.name).toBe('testing');
      expect(result.value).toBe('initial');
    });

    it('should handle missing values with default empty string', () => {
      storeMock.formValues.set({});
      const extract = createFieldExtract('newField', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toBe('');
    });

    it('should handle missing values with default empty array for multi-value', () => {
      const el2 = document.createElement('input');
      el2.type = 'text';
      el2.setAttribute('name', 'testing');
      elements.push(el2);
      document.body.appendChild(el2);

      storeMock.formValues.set({});
      const extract = createFieldExtract('newField', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toEqual([]);
      document.body.removeChild(el2);
    });
  });

  describe('Checkbox Values', () => {
    beforeEach(() => {
      document.body.removeChild(element);
      element = document.createElement('input');
      element.type = 'checkbox';
      element.setAttribute('name', 'testing');
      element.value = 'option1';
      elements = [element];
      document.body.appendChild(element);
    });

    it('should extract single checkbox value as boolean', () => {
      element.checked = true;
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toBe(true);
    });

    it('should extract multiple checkbox values as array', () => {
      const el2 = document.createElement('input');
      el2.type = 'checkbox';
      el2.setAttribute('name', 'testing');
      el2.value = 'option2';
      el2.checked = true;
      elements.push(el2);
      document.body.appendChild(el2);

      element.checked = true;
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toEqual(['option1', 'option2']);
      document.body.removeChild(el2);
    });
  });

  describe('Radio Values', () => {
    beforeEach(() => {
      document.body.removeChild(element);
      element = document.createElement('input');
      element.type = 'radio';
      element.setAttribute('name', 'testing');
      element.value = 'option1';
      
      const el2 = document.createElement('input');
      el2.type = 'radio';
      el2.setAttribute('name', 'testing');
      el2.value = 'option2';
      
      elements = [element, el2];
      document.body.appendChild(element);
      document.body.appendChild(el2);
    });

    afterEach(() => {
      elements.forEach(el => {
        if (el.parentNode) document.body.removeChild(el);
      });
    });

    it('should extract selected radio value', () => {
      elements[1].checked = true;
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(elements[1], false, false);
      
      expect(result.value).toBe('option2');
    });

    it('should return null when no radio is selected', () => {
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toBeNull();
    });
  });

  describe('Number Fields', () => {
    beforeEach(() => {
      document.body.removeChild(element);
      element = document.createElement('input');
      element.type = 'number';
      element.setAttribute('name', 'testing');
      elements = [element];
      document.body.appendChild(element);
    });

    it('should parse number values', () => {
      element.value = '42';
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toBe(42);
    });

    it('should return null for invalid number', () => {
      element.value = '';
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toBeNull();
    });

    it('should parse multiple number values', () => {
      const el2 = document.createElement('input');
      el2.type = 'number';
      el2.setAttribute('name', 'testing');
      el2.value = '10';
      elements.push(el2);
      document.body.appendChild(el2);

      element.value = '5';
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toEqual([5, 10]);
      document.body.removeChild(el2);
    });
  });

  describe('Default Values', () => {
    it('should use default values on init', () => {
      const options = {
        defaultValues: {
          testing: 'default value'
        }
      };
      const extract = createFieldExtract('testing', elements, options, storeMock);
      const result = extract(element, true, false);
      
      expect(result.value).toBe('default value');
    });

    it('should use default array values for multi-value fields on init', () => {
      const el2 = document.createElement('input');
      el2.type = 'text';
      el2.setAttribute('name', 'testing');
      elements.push(el2);
      document.body.appendChild(el2);

      const options = {
        defaultValues: {
          testing: ['value1', 'value2']
        }
      };
      const extract = createFieldExtract('testing', elements, options, storeMock);
      const result = extract(element, true, false);
      
      expect(result.value).toEqual(['value1', 'value2']);
      document.body.removeChild(el2);
    });
  });

  describe('File Input', () => {
    beforeEach(() => {
      document.body.removeChild(element);
      element = document.createElement('input');
      element.type = 'file';
      element.setAttribute('name', 'testing');
      elements = [element];
      document.body.appendChild(element);
    });

    it('should extract FileList value', () => {
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toBeInstanceOf(FileList);
    });
  });

  describe('Select Field', () => {
    beforeEach(() => {
      document.body.removeChild(element);
      element = document.createElement('select');
      element.setAttribute('name', 'testing');
      
      const opt1 = document.createElement('option');
      opt1.value = 'A';
      opt1.text = 'Option A';
      
      const opt2 = document.createElement('option');
      opt2.value = 'B';
      opt2.text = 'Option B';
      
      element.appendChild(opt1);
      element.appendChild(opt2);
      elements = [element];
      document.body.appendChild(element);
    });

    it('should extract single select value', () => {
      element.value = 'B';
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toBe('B');
    });

    it('should extract multiple select values', () => {
      element.setAttribute('multiple', 'multiple');
      element.options[0].selected = true;
      element.options[1].selected = true;
      
      const extract = createFieldExtract('testing', elements, {}, storeMock);
      const result = extract(element, false, false);
      
      expect(result.value).toEqual(['A', 'B']);
    });
  });
});
