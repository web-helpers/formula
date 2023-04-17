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
    connectedCallback(): void;
    elementVariable: Node | undefined;
    connectFormula(): void;
    formula: import("../form/form.mjs").Formula | undefined;
    form: {
        elements: HTMLElement[];
        destroy: () => void;
    } | undefined;
}
