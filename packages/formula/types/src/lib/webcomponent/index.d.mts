import type { FormulaOptions } from '../shared/types.mjs';
import type { Formula, FormulaForm } from '../form/form.mjs';
/**
 * The FormulaWebComponent is a web component that can be used to wrap any existing
 * form to make it dynamic. It can be used in any framework or without a framework.
 */
export declare class FormulaWebComponent extends HTMLElement {
    #private;
    handleSubmit: boolean;
    rootSelector: string | undefined;
    formulaOptions: FormulaOptions | undefined;
    options: FormulaOptions | undefined;
    formula: Formula;
    form: FormulaForm;
    formEl: HTMLElement;
    eventNames: Map<string, string>;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
}
