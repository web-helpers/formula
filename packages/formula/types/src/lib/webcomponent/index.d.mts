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
 *  console.log('Formula initialised');
 * });
 * wc.addEventListener('formValues', (e) => {
 *  console.log('Form values updated', e.detail);
 * });
 * ```
 *
 * @fires {Formula} form:init: Fired when the formula instance is initialised, returns the formula instance
 * @fires {FormulaForm} form:connect: Fired when the form instance is initialised, returns the form instance
 * @fires {Record<string, any> form:submit: Fired when the form is submitted if `data-handle-submit` is set on the web component, otherwise the form will submit as normal
 * @fires {Record<string, any> formValues: Fired when the formValues store is updated
 * @fires {Record<string, any> submitValues: Fired when the submitValues store is updated
 * @fires {Record<string, boolean> touched: Fired when the touched store is updated
 * @fires {Record<string, boolean> dirty: Fired when the dirty store is updated
 * @fires {Record<string, any> validity: Fired when the validity store is updated
 * @fires {Record<string, any> formValidity: Fired when the formValidity store is updated
 * @fires {Record<string, any> enrichment: Fired when the enrichment store is updated
 * @fires {boolean} formValid: Fired when the formValid store is updated
 * @fires {boolean} formReady: Fired when the formReady store is updated
 * @fires {function} preChanges: Fired before a change is made to the form stores update, useful for UI changes
 * @fires {(values) => void} postChanges: Fired after a change is made to the form stores update, contains the latest form state
 */
export class FormulaWebComponent extends HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
    options: any;
    rootSelector: string | undefined;
    handleSubmit: boolean | undefined;
    formEl: Element | null | undefined;
    formula: import("../form/form.mjs").Formula | undefined;
    form: {
        elements: HTMLElement[];
        destroy: () => void;
    } | undefined;
    #private;
}
