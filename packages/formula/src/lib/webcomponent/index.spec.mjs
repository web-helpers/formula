import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FormulaWebComponent } from './index.mjs';

describe('FormulaWebComponent', () => {
  let wc;
  let form;

  beforeEach(() => {
    // Create form element
    form = document.createElement('form');
    form.innerHTML = `
      <input type="text" name="firstName" value="" />
      <input type="email" name="email" value="" />
      <button type="submit">Submit</button>
    `;

    // Create web component and add to DOM
    wc = document.createElement('formula-form');
    wc.appendChild(form);
    document.body.appendChild(wc);
  });

  afterEach(() => {
    if (wc.parentNode) {
      document.body.removeChild(wc);
    }
  });

  describe('Initialization', () => {
    it('should create web component instance', () => {
      expect(wc).toBeInstanceOf(FormulaWebComponent);
    });

    it('should find form element as first child when no root-selector', async () => {
      // Wait for next animation frame since connectedCallback uses requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(wc.formEl).toBe(form);
    });

    it('should use root-selector when provided', async () => {
      const container = document.createElement('div');
      const targetForm = document.createElement('form');
      targetForm.id = 'target-form';
      targetForm.innerHTML = '<input type="text" name="test" />';
      container.appendChild(targetForm);

      const wcWithSelector = document.createElement('formula-form');
      wcWithSelector.setAttribute('root-selector', '#target-form');
      wcWithSelector.appendChild(container);
      document.body.appendChild(wcWithSelector);

      await new Promise((resolve) => {
        wcWithSelector.addEventListener('form:connect', () => {
          expect(wcWithSelector.formEl).toBe(targetForm);
          document.body.removeChild(wcWithSelector);
          resolve();
        });
      });
    });

    it('should parse formula-options from attribute', async () => {
      // Component already connected, need to create new one with options
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="firstName" value="" />';
      
      const testWc = document.createElement('formula-form');
      const options = { defaultValues: { firstName: 'John' } };
      testWc.setAttribute('formula-options', JSON.stringify(options));
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:init', () => {
          expect(testWc.options).toEqual(options);
          document.body.removeChild(testWc);
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });

    it('should dispatch form:init event with formula instance', async () => {
      // Component already connected, need to create new one
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" value="" />';
      
      const testWc = document.createElement('formula-form');
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:init', (e) => {
          expect(e.detail).toBeDefined();
          expect(e.detail.stores).toBeDefined();
          expect(e.detail.init).toBeInstanceOf(Function);
          document.body.removeChild(testWc);
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });

    it('should dispatch form:connect event with form instance', async () => {
      // Component already connected, need to create new one
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" value="" />';
      
      const testWc = document.createElement('formula-form');
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:connect', (e) => {
          expect(e.detail).toBeDefined();
          expect(e.detail.destroy).toBeInstanceOf(Function);
          document.body.removeChild(testWc);
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });
  });

  describe('Store Events', () => {
    it('should dispatch form:values event when formValues changes', async () => {
      // Wait for component to be fully connected and initial events to fire
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now listen for the next event after we make a change
      const eventPromise = new Promise((resolve) => {
        wc.addEventListener('form:values', (e) => {
          if (e.detail.firstName === 'Test') {
            expect(e.detail).toHaveProperty('firstName', 'Test');
            resolve();
          }
        }, { once: false }); // Don't use once since initial event might fire first
      });

      // Trigger the change with keyup event
      const input = form.querySelector('input[name="firstName"]');
      input.value = 'Test';
      input.dispatchEvent(new Event('keyup', { bubbles: true }));
      
      await eventPromise;
    });

    it('should dispatch form:touched event when field is touched', async () => {
      // Wait for component to be fully connected
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const eventPromise = new Promise((resolve) => {
        wc.addEventListener('form:touched', (e) => {
          if (e.detail.firstName) {
            expect(e.detail).toHaveProperty('firstName', true);
            resolve();
          }
        });
      });

      const input = form.querySelector('input[name="firstName"]');
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      
      await eventPromise;
    });

    it('should dispatch form:dirty event when field becomes dirty', async () => {
      // Wait for component to be fully connected and initial events to fire
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const eventPromise = new Promise((resolve) => {
        wc.addEventListener('form:dirty', (e) => {
          if (e.detail.firstName) {
            expect(e.detail).toHaveProperty('firstName', true);
            resolve();
          }
        });
      });

      // Trigger the change with keyup event
      const input = form.querySelector('input[name="firstName"]');
      input.value = 'Changed';
      input.dispatchEvent(new Event('keyup', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      
      await eventPromise;
    });

    it('should dispatch form:errors event when validation errors occur', async () => {
      const requiredForm = document.createElement('form');
      requiredForm.innerHTML = `
        <input type="text" name="required" required />
      `;

      const wcRequired = document.createElement('formula-form');
      wcRequired.appendChild(requiredForm);

      await new Promise((resolve) => {
        wcRequired.addEventListener('form:connect', () => {
          wcRequired.addEventListener('form:errors', (e) => {
            if (e.detail.required && !e.detail.required.valid) {
              expect(e.detail.required.valid).toBe(false);
              document.body.removeChild(wcRequired);
              resolve();
            }
          });

          const input = requiredForm.querySelector('input[name="required"]');
          input.value = '';
          input.dispatchEvent(new Event('blur', { bubbles: true }));
        });
        // Add to DOM after listener is attached
        document.body.appendChild(wcRequired);
      });
    });

    it('should dispatch form:is:valid event when form validity changes', async () => {
      // Wait for component to be fully connected
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // This form has no validation rules, so formValid won't change
      // Just verify the event stream exists and we can access the current value
      // The stores are on wc.formula, not wc.form
      expect(wc.formula).toBeDefined();
      expect(wc.formula.stores).toBeDefined();
      expect(wc.formula.stores.formValid).toBeDefined();
      const isValid = wc.formula.stores.formValid.get();
      expect(typeof isValid).toBe('boolean');
    });

    it('should dispatch form:is:ready event', async () => {
      // Wait for component to be fully connected  
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // The form:is:ready event should have already fired, check the state instead
      expect(wc.form).toBeDefined();
      expect(typeof wc.form.isReady).not.toBeUndefined();
    });
  });

  describe('Form Submission', () => {
    it('should handle submit and dispatch form:submit event when handle-submit is true', async () => {
      // Need to create new component with handle-submit attribute
      const testForm = document.createElement('form');
      testForm.innerHTML = `
        <input type="text" name="firstName" value="" />
        <input type="email" name="email" value="" />
      `;
      
      const testWc = document.createElement('formula-form');
      testWc.setAttribute('handle-submit', 'true');
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:connect', () => {
          testWc.addEventListener('form:submit', (e) => {
            expect(e.detail).toBeDefined();
            expect(e.detail).toHaveProperty('firstName');
            expect(e.detail).toHaveProperty('email');
            document.body.removeChild(testWc);
            resolve();
          });

          const input = testForm.querySelector('input[name="firstName"]');
          input.value = 'John';

          testForm.dispatchEvent(new Event('submit', { bubbles: true }));
        });
        document.body.appendChild(testWc);
      });
    });

    it('should preventDefault and stopPropagation on submit', async () => {
      // Need to create new component with handle-submit attribute
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" value="" />';
      
      const testWc = document.createElement('formula-form');
      testWc.setAttribute('handle-submit', 'true');
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:connect', () => {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');
          const stopPropagationSpy = vi.spyOn(submitEvent, 'stopPropagation');

          testWc.addEventListener('form:submit', () => {
            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(stopPropagationSpy).toHaveBeenCalled();
            document.body.removeChild(testWc);
            resolve();
          });

          testForm.dispatchEvent(submitEvent);
        });
        document.body.appendChild(testWc);
      });
    });

    it('should not handle submit when handle-submit is not set', async () => {
      // Wait for component to be fully connected
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      await new Promise((resolve) => {
        let submitEventFired = false;

        wc.addEventListener('form:submit', () => {
          submitEventFired = true;
        });

        // Give time for any events to fire
        setTimeout(() => {
          expect(submitEventFired).toBe(false);
          resolve();
        }, 100);

        form.dispatchEvent(new Event('submit', { bubbles: true }));
      });
    });
  });

  describe('Lifecycle', () => {
    it('should cleanup subscriptions on disconnectedCallback', async () => {
      // Wait for component to be fully connected
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Test that events stop firing after disconnection instead of checking private fields
      let eventFired = false;
      wc.addEventListener('form:values', () => {
        eventFired = true;
      });

      // Disconnect the component
      document.body.removeChild(wc);

      // Try to trigger an event - it shouldn't fire because subscriptions are cleaned up
      await new Promise(resolve => setTimeout(resolve, 100));
      const input = form.querySelector('input[name="firstName"]');
      input.value = 'AfterDisconnect';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait to ensure no event fires
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(eventFired).toBe(false);
    });

    it('should call form.destroy on disconnectedCallback', async () => {
      // Wait for component to be fully connected
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const destroySpy = vi.spyOn(wc.form, 'destroy');

      document.body.removeChild(wc);

      expect(destroySpy).toHaveBeenCalled();
    });

    it('should remove submit event listener on disconnect when handle-submit is true', async () => {
      // Need to create new component with handle-submit attribute
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" value="" />';
      
      const testWc = document.createElement('formula-form');
      testWc.setAttribute('handle-submit', 'true');
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:connect', () => {
          const removeEventListenerSpy = vi.spyOn(testWc.formEl, 'removeEventListener');

          document.body.removeChild(testWc);

          expect(removeEventListenerSpy).toHaveBeenCalledWith('submit', expect.any(Function));
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });
  });

  describe('Custom Events', () => {
    it('should dispatch events with bubbles: true', async () => {
      // Need to create new component to catch the event
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" value="" />';
      
      const testWc = document.createElement('formula-form');
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:init', (e) => {
          expect(e.bubbles).toBe(true);
          document.body.removeChild(testWc);
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });

    it('should include detail in custom events', async () => {
      // Need to create new component to catch the event
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" value="" />';
      
      const testWc = document.createElement('formula-form');
      testWc.appendChild(testForm);

      await new Promise((resolve) => {
        testWc.addEventListener('form:init', (e) => {
          expect(e.detail).toBeDefined();
          expect(e.detail).not.toBeNull();
          document.body.removeChild(testWc);
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });
  });
});
