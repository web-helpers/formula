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
 * 
 * @example ```html
 * <formula-webcomponent data-options='{"defaultValues": [{"firstName": "WebHelpers"}]}'>
 *    <form>
 *      <label for="firstName">Name</label>
 *      <input type="text" name="firstName" id="firstName" placeholder="Please enter your first name"/>
 *      <span class="error-message"></span>
 *    </form>
 * </formula-webcomponent>
 * ```
 * 
 * There are several events that can be listened to on the web component:
 * 
 * ```
 * const wc = document.querySelector('formula-webcomponent');
 * wc.addEventListener('init', (e) => {
 *  console.log('Form initialised');
 * });
 * wc.addEventListener('formValues', (e) => {
 *  console.log('Form values updated', e.detail);
 * });
 * ```
 * 
 * - init: Fired when the formula instance is initialised
 * - form: Fired when the form instance is initialised
 * - formValues: Fired when the formValues store is updated
 * - submitValues: Fired when the submitValues store is updated
 * - touched: Fired when the touched store is updated
 * - dirty: Fired when the dirty store is updated
 * - validity: Fired when the validity store is updated
 * - formValidity: Fired when the formValidity store is updated
 * - enrichment: Fired when the enrichment store is updated
 * - isFormValid: Fired when the isFormValid store is updated
 * - isFormReady: Fired when the isFormReady store is updated
 * - preChanges: Fired before a change is made to the form stores update, useful for UI changes
 * - postChanges: Fired after a change is made to the form stores update, contains the latest form state
 */

export class FormulaWebComponent extends HTMLElement {
  /**
   * Create the web component root and attach the shadow DOM
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * In our connected callback we create an inner HTML template and add a slot to it.
   * We then add an event listener to the slot to listen for changes in the slot.and 
   * assign the first child component to the element variable.
   * Once we have the element variable, we can initialise the formula instance.
   */
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
        console.warn('No child components found inside formula-webcomponent');
      }
    });
  }

  /**
   * Gets the options and initialises the formula instance with the web component,
   * and sets up CustomEvent handlers
   */
  connectFormula() {

    /**
     * @type {import('./../form/form.mjs').FormulaOptions | undefined}
     */
    const options = this.dataset?.options
      ? JSON.parse(this.dataset?.options)
      : undefined;
    this.formula = createForm(options);

    this.dispatchEvent(
      new CustomEvent('init', { bubbles: true, detail: this.formula })
    )
    ;
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
