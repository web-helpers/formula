import { createForm } from '../form/form.mjs';

/**
 * The FormulaWebComponent is a web component that can be used to wrap any existing
 * form to make it dynamic. It can be used in any framework or without a framework.
 *
 * To use it, simply wrap your form with the web component and pass the options as a stringified JSON object.
 * Using document.querySelector, you can access the formula instance and the form instance, and use them to
 * interact with the form.
 *
 * By subscribing to the formula instance, you can listen to changes in the form and react to them.
 */
export class FormulaWebComponent extends HTMLElement {
  /**
   * Create the web component root and attach the shadow DOM
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
        </style>
        <slot></slot>
      `;

    // Fetch the first child component and assign it to the element variable
    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => {
      const nodes = slot.assignedNodes({ flatten: true });
      const firstChildComponent = nodes.find(
        (node) => node.nodeType === Node.ELEMENT_NODE
      );

      if (firstChildComponent) {
        this.elementVariable = firstChildComponent;
        this.connectFormula();
      } else {
        console.warn('No child component found.');
      }
    });
  }

  connectFormula() {
    const options = this.dataset?.options
      ? JSON.parse(this.dataset?.options)
      : undefined;
    this.formula = createForm(options);
    this.dispatchEvent(
      new CustomEvent('init', { bubbles: true, detail: this.formula })
    );
    this.form = this.formula.init(this.elementVariable);
    this.dispatchEvent(
      new CustomEvent('form', { bubbles: true, detail: this.formula })
    );
    Object.entries(this.formula.stores).forEach(([key, store]) =>
      store.subscribe((value) =>
        this.dispatchEvent(
          new CustomEvent(key, { bubbles: true, detail: value })
        )
      )
    );
  }
}

customElements.define('formula-webcomponent', FormulaWebComponent);
