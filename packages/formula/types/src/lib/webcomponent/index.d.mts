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
 * @element formula-form
 *
 * @attr {boolean} handle-submit If Formula should handle the form submission, you can provide the key only or a boolean value
 * @attr {string} root-selector The root selector to use to find the form element, if not set, the first child element will be used
 * @attr {string} formula-options The options to pass to the formula instance, this should be a JSON string and cannot include functions
 *
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
 *  console.log('Formula initialised');
 * });
 * wc.addEventListener('formValues', (e) => {
 *  console.log('Form values updated', e.detail);
 * });
 * ```
 *
 * @fires {Formula} form:init Fired when the formula instance is initialised, returns the formula instance
 * @fires {FormulaForm} form:connect Fired when the form instance is initialised, returns the form instance
 * @fires {Record<string, any>} form:submit Fired when the form is submitted if `data-handle-submit` is set on the web component, otherwise the form will submit as normal
 * @fires {Record<string, any>} form:values Fired when the formValues store is updated
 * @fires {Record<string, any>} submit:values Fired when the submitValues store is updated
 * @fires {Record<string, boolean>} form:touched Fired when the touched store is updated
 * @fires {Record<string, boolean>} form:dirty Fired when the dirty store is updated
 * @fires {Record<string, any>} form:errors Fired when the validity store is updated
 * @fires {Record<string, any>} form:validity Fired when the formValidity store is updated
 * @fires {Record<string, any>} form:enrichment Fired when the enrichment store is updated
 * @fires {boolean} form:is:valid Fired when the formValid store is updated
 * @fires {boolean} form:is:ready Fired when the formReady store is updated
 * @fires {function} form:preChanges Fired before a change is made to the form stores update, useful for UI changes
 * @fires {(values) => void} form:postChanges Fired after a change is made to the form stores update, contains the latest form state
 */
export class FormulaWebComponent extends HTMLElement {
  /**
   * @type {boolean} If Formula should handle the form submission
   * @attr {boolean} handle-submit
   */
  handleSubmit: boolean;
  /**
   * @type {string | undefined} The root selector to use to find the form element
   * @attr {string | undefined} root-selector
   */
  rootSelector: string | undefined;
  /**
   * @type {string | undefined} The root selector to use to find the form element
   * @attr {string} formula-options
   */
  formulaOptions: string | undefined;
  connectedCallback(): void;
  disconnectedCallback(): void;
  options: any;
  formEl: Element | null | undefined;
  formula: import("../form/form.mjs").Formula | undefined;
  eventNames: Map<string, string> | undefined;
  form:
    | {
        elements: HTMLElement[];
        destroy: () => void;
      }
    | undefined;
  #private;
}
