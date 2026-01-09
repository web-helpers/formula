import { createForm } from '../form/form.mjs';
import { eventsWithFormKeys } from './lib.mjs';

import type { FormulaOptions } from '../shared/types.mjs';
import type { Formula, FormulaForm } from '../form/form.mjs';

/**
 * The FormulaWebComponent is a web component that can be used to wrap any existing
 * form to make it dynamic. It can be used in any framework or without a framework.
 */
export class FormulaWebComponent extends HTMLElement {
  handleSubmit = true;
  rootSelector: string | undefined = undefined;
  formulaOptions: FormulaOptions | undefined = undefined;
  options: FormulaOptions | undefined = undefined;
  formula!: Formula;
  form!: FormulaForm;
  formEl!: HTMLElement;
  eventNames!: Map<string, string>;

  #subscriptions: Array<() => void> = [];

  constructor() {
    super();
  }

  connectedCallback() {
    window.requestAnimationFrame(() => this.#connectFormula());
  }

  disconnectedCallback() {
    if (this.handleSubmit && this.formEl) {
      this.formEl.removeEventListener('submit', this.#onHandleSubmit);
    }
    this.#subscriptions.forEach((unsub) => unsub());
    this.#subscriptions = [];
    if (this.form) {
      this.form.destroy();
    }
  }

  #getComponentOptions() {
    this.options = this.hasAttribute('formula-options') ? JSON.parse(this.getAttribute('formula-options')!) : undefined;

    this.rootSelector = this.getAttribute('root-selector') ?? undefined;
  }

  #connectForm() {
    this.formEl = this.rootSelector ? ((document ?? this).querySelector(this.rootSelector)! as HTMLElement) : (this.firstElementChild as HTMLElement);

    if (this.getAttribute('handle-submit') === 'true') {
      this.formEl.addEventListener('submit', this.#onHandleSubmit.bind(this));
    }
  }

  #connectFormula() {
    this.#getComponentOptions();
    this.#connectForm();

    this.formula = createForm(this.options || {}, undefined, undefined, {});
    this.eventNames = eventsWithFormKeys(this.formula.stores);
    this.dispatchEvent(new CustomEvent('form:init', { bubbles: true, detail: this.formula }));

    this.form = this.formula.init(this.formEl);
    this.dispatchEvent(new CustomEvent('form:connect', { bubbles: true, detail: this.form }));

    Object.entries(this.formula.stores).forEach(([key, store]) => {
      const unsub = store.subscribe((value: unknown) =>
        this.dispatchEvent(
          new CustomEvent(this.eventNames.get(key)!, {
            bubbles: true,
            detail: value,
          }),
        ),
      );
      this.#subscriptions.push(unsub);
    });
  }

  #onHandleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('form:submit', {
        bubbles: true,
        detail: this.formula.stores.formValues.get(),
      }),
    );
  };
}

customElements.define('formula-form', FormulaWebComponent);
