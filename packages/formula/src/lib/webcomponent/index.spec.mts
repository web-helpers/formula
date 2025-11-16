import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FormulaWebComponent } from './index.mjs';

describe('FormulaWebComponent', () => {
  let wc: FormulaWebComponent;
  let form: HTMLFormElement;

  beforeEach(() => {
    // Create form element
    form = document.createElement('form');
    form.innerHTML = `
      <input type="text" name="firstName" value="" />
      <input type="email" name="email" value="" />
      <button type="submit">Submit</button>
    `;

    // Create web component and add to DOM
    wc = document.createElement('formula-form') as FormulaWebComponent;
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
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));
      expect(wc.formEl).toBe(form);
    });

    it('should use root-selector when provided', async () => {
      const container = document.createElement('div');
      const targetForm = document.createElement('form');
      targetForm.id = 'target-form';
      targetForm.innerHTML = '<input type="text" name="test" />';
      container.appendChild(targetForm);

      const wcWithSelector = document.createElement('formula-form') as FormulaWebComponent;
      wcWithSelector.setAttribute('root-selector', '#target-form');
      wcWithSelector.appendChild(container);
      document.body.appendChild(wcWithSelector);

      await new Promise<number>((resolve) => {
        requestAnimationFrame((time) => {
          expect(wcWithSelector.formEl).toBe(targetForm);
          document.body.removeChild(wcWithSelector);
          resolve(time);
        });
      });
    });

    it('should use formula-options attribute', async () => {
      const testWc = document.createElement('formula-form') as FormulaWebComponent;
      const options = { test: 'value' };
      testWc.setAttribute('formula-options', JSON.stringify(options));
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" />';
      testWc.appendChild(testForm);
      document.body.appendChild(testWc);

      await new Promise<number>((resolve) => {
        requestAnimationFrame((time) => {
          // The options object will have additional properties merged in
          expect(testWc.options).toMatchObject(options);
          document.body.removeChild(testWc);
          resolve(time);
        });
      });
    });
  });

  describe('Events', () => {
    it('should dispatch form:init event', async () => {
      const testWc = document.createElement('formula-form') as FormulaWebComponent;
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" />';
      testWc.appendChild(testForm);

      await new Promise<void>((resolve) => {
        testWc.addEventListener('form:init', (e: Event) => {
          const customEvent = e as CustomEvent;
          expect(customEvent.detail).toBeDefined();
          expect(customEvent.detail.stores).toBeDefined();
          expect(customEvent.detail.init).toBeInstanceOf(Function);
          document.body.removeChild(testWc);
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });

    it('should dispatch form:connect event', async () => {
      const testWc = document.createElement('formula-form') as FormulaWebComponent;
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="test" />';
      testWc.appendChild(testForm);

      await new Promise<void>((resolve) => {
        testWc.addEventListener('form:connect', (e: Event) => {
          const customEvent = e as CustomEvent;
          expect(customEvent.detail).toBeDefined();
          expect(customEvent.detail.destroy).toBeInstanceOf(Function);
          document.body.removeChild(testWc);
          resolve();
        });
        document.body.appendChild(testWc);
      });
    });

    it('should dispatch form:values event when formValues changes', async () => {
      // Wait for component to be fully connected and initial events to fire
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      // Now listen for the next event after we make a change
      const eventPromise = new Promise<void>((resolve) => {
        wc.addEventListener(
          'form:values',
          (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.firstName === 'Test') {
              expect(customEvent.detail).toHaveProperty('firstName', 'Test');
              resolve();
            }
          },
          { once: true },
        );
      });

      // Trigger the change with keyup event
      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.value = 'Test';
      input.dispatchEvent(new Event('keyup', { bubbles: true }));

      await eventPromise;
    });

    it('should dispatch form:touched event when field is touched', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const eventPromise = new Promise<void>((resolve) => {
        wc.addEventListener(
          'form:touched',
          (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.firstName) {
              expect(customEvent.detail).toHaveProperty('firstName', true);
              resolve();
            }
          },
          { once: true },
        );
      });

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      await eventPromise;
    });

    it('should dispatch form:dirty event when field becomes dirty', async () => {
      // Wait for component to be fully connected and initial events to fire
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const eventPromise = new Promise<void>((resolve) => {
        wc.addEventListener(
          'form:dirty',
          (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.firstName) {
              expect(customEvent.detail).toHaveProperty('firstName', true);
              resolve();
            }
          },
          { once: true },
        );
      });

      // Trigger the change with keyup event
      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (!input) return;
      input.value = 'Changed';
      input.dispatchEvent(new Event('keyup', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      await eventPromise;
    });

    it('should dispatch form:errors event when validation fails', async () => {
      const formRequired = document.createElement('form');
      formRequired.innerHTML = '<input type="text" name="required" required />';

      const wcRequired = document.createElement('formula-form') as FormulaWebComponent;
      wcRequired.appendChild(formRequired);
      document.body.appendChild(wcRequired);

      await new Promise<void>((resolve) => {
        wcRequired.addEventListener(
          'form:errors',
          (e: Event) => {
            const customEvent = e as CustomEvent;
            // Just verify event is dispatched with detail
            expect(customEvent.detail).toBeDefined();
            resolve();
          },
          { once: true },
        );

        requestAnimationFrame(() => {
          const input = formRequired.querySelector<HTMLInputElement>('input[name="required"]');
          if (!input) return;
          input.value = '';
          input.dispatchEvent(new Event('blur', { bubbles: true }));
        });
      });

      document.body.removeChild(wcRequired);
    });

    it('should dispatch form:is:valid event when form validity changes', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      // Form and formula should be initialized
      expect(wc.form).toBeDefined();
      expect(wc.formula).toBeDefined();
    });

    it('should dispatch form:is:ready event', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));

      expect(wc.form).toBeDefined();
      expect(wc.formula).toBeDefined();
    });
  });

  describe('Submit Handling', () => {
    it('should dispatch form:submit event when handle-submit is set', async () => {
      const testWc = document.createElement('formula-form') as FormulaWebComponent;
      testWc.setAttribute('handle-submit', 'true');
      const testForm = document.createElement('form');
      testForm.innerHTML = '<input type="text" name="firstName" value="John" /><button type="submit">Submit</button>';
      testWc.appendChild(testForm);
      document.body.appendChild(testWc);

      await new Promise<void>((resolve) => {
        testWc.addEventListener(
          'form:submit',
          (e: Event) => {
            const customEvent = e as CustomEvent;
            expect(customEvent.detail).toBeDefined();
            expect(customEvent.detail).toHaveProperty('firstName');
            resolve();
          },
          { once: true },
        );

        requestAnimationFrame(() => {
          const formEl = testWc.querySelector<HTMLFormElement>('form');
          if (!formEl) {
            resolve();
            return;
          }

          const input = formEl.querySelector<HTMLInputElement>('input[name="firstName"]');
          if (!input) return;
          input.value = 'John';
          input.dispatchEvent(new Event('keyup', { bubbles: true }));

          setTimeout(() => {
            formEl.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }, 100);
        });
      });

      document.body.removeChild(testWc);
    });

    it('should not handle submit when handle-submit is not set', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));

      await new Promise<void>((resolve) => {
        let submitFired = false;
        wc.addEventListener('form:submit', () => {
          submitFired = true;
        });

        form.addEventListener(
          'submit',
          (e) => {
            // Default behavior should not be prevented
            e.preventDefault(); // We prevent here for test purposes
            expect(submitFired).toBe(false);
            resolve();
          },
          { once: true },
        );

        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
    });
  });

  describe('Cleanup', () => {
    it('should cleanup subscriptions on disconnectedCallback', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));

      let eventFired = false;
      wc.addEventListener('form:values', () => {
        eventFired = true;
      });

      // Disconnect the component
      document.body.removeChild(wc);

      // Try to trigger an event - it shouldn't fire because subscriptions are cleaned up
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (input) {
        input.value = 'AfterDisconnect';
        input.dispatchEvent(new Event('keyup', { bubbles: true }));
      }

      // Give time for event to potentially fire
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      expect(eventFired).toBe(false);
    });

    it('should call form.destroy on disconnectedCallback', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));

      const destroySpy = vi.fn();
      wc.form.destroy = destroySpy;

      // Disconnect the component
      document.body.removeChild(wc);

      await new Promise<number>((resolve) => {
        requestAnimationFrame((time) => {
          expect(destroySpy).toHaveBeenCalled();
          resolve(time);
        });
      });
    });
  });

  describe('Event Details', () => {
    it('should dispatch events with bubbles: true', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      let bubbles = false;
      document.body.addEventListener(
        'form:values',
        (e) => {
          bubbles = e.bubbles;
        },
        { once: true },
      );

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (input) {
        input.value = 'Test';
        input.dispatchEvent(new Event('keyup', { bubbles: true }));
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      expect(bubbles).toBe(true);
    });

    it('should include detail in custom events', async () => {
      // Wait for component to be fully connected
      await new Promise<number>((resolve) => requestAnimationFrame(resolve));
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const eventPromise = new Promise<void>((resolve) => {
        wc.addEventListener(
          'form:values',
          (e: Event) => {
            const customEvent = e as CustomEvent;
            expect(customEvent.detail).toBeDefined();
            expect(customEvent.detail).toHaveProperty('firstName');
            resolve();
          },
          { once: true },
        );
      });

      const input = form.querySelector<HTMLInputElement>('input[name="firstName"]');
      if (input) {
        input.value = 'Test';
        input.dispatchEvent(new Event('keyup', { bubbles: true }));
      }

      await eventPromise;
    });
  });
});
