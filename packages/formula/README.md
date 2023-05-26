# @webhelpers/formula

<div style="text-align:center;">
    <img src="https://raw.githubusercontent.com/web-helpers/formula/main/packages/formula/docs/logo_256.png" alt="The logo for Formula">
</div>

Formula is a library for creating Dynamic, Reactive Forms for the modern web. Take any HTML form, Formula handles all the reactive bindings with your input elements, and makes the form state available via [Custom Events](#web-component-events) or direct access to it's subscribable stores.

Built using VanillaJS and [nanostores](https://github.com/nanostores/nanostores) it can turn any static HTML5 form into a [fully reactive form](https://stackblitz.com/edit/vitejs-vite-skkuff?file=index.html) - either using the [web component](#use-as-a-web-component), or getting more control over your own elements with the [library features](#use-as-a-library).

Using Formula you don't need to set up any complex configuration or templates to start - simply wrap any form compoment using the `<formula-form>` component, then use `document.querySelector` (or framework equivilent) to use the elements features.

Templates are based on HTML standard, using attribute-based validation on input tags, and works with [Constraints Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation) messages and ARIA.

> 🚨 Formula is the first library in [Web Helpers](https://github.com/web-helpers/) - A set of useful developer-first libraries for the web. It is still in active development - as such the API is still subject to changes.

## Installing and Usage

### Installing

```bash
$ npm install @webhelpers/formula
```

Formula was originally developed as a Svelte Action, creating this library was first migrating to Vanilla JS. As is you can use this API to create your own component, or work without any components ([see example](https://stackblitz.com/edit/vitejs-vite-skkuff?file=index.html))

### Use as a web component

The web component is the eastest way to get started. To use it, include `@webhelpers/formula/webcomponent` in your JS code - this will register the web component for use.

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const formulaEl = document.querySelector('formula-form') as HTMLElement;
  const url = formulaEl.formEl.getAttribute('action');

  // You can subscribe to form value changes and use these to do things
  // like form enrichment such as password stength
  formulaEl.addEventListener('form:values', (e) => {
    // An example of password strength and confirm
      const { password, password_confirm } = e.detail;
      const stength = getPasswordStr(password);
      const passwordsMatch = password === password_confirm;
      passwordMeter.value = strength;
      if (!passwordsMatch) {
        document.querySelector('#password_confirm ~ .error').innerHtml = 'Your password confirm does not match the password'
      }
  });

  // With this you can listen for errors and use this to update the UI
  // however it is better to use CSS properties for display - e.g
  // input:invalid ~ .error { display: block }
  formulaEl.addEventListener('form:errors', (e) => {
    cosnt totalErrors = Object.values(e.detail).reduce((a, b) => a + b.valid ? 0 : 1, 0);
    document.querySelector('#totalErrors').innerHtml = totalErrors;

    Object.entries(e.detail).forEach(([key, value]) => {
      const errorEl = document.querySelector(`#${key} ~ .error`);
      if (errorEl) {
        errorEl.innerHTML = value.message;
      }
    });
  })

  // You can also capture a form submit by adding the `handle-submit`
  // to the `<formula-form>` component and then subscribe to the
  // `form:submit` event
  formulaEl.addEventListener('form:submit', async (e) => {
    const result = await fetch(url, {method: post, body: e.detail});
    // Rest of code goes here
  })
</script>
```

Now you can use the `formula-form` to wrap any existing form, in this case we also get it to take over the submit - this way we can now make our form more reactive to updates and errors:

```html
<formula-form handle-submit>
  <form id="customer-form" method="POST" action="/customer/manage">
    <div>
      <label for="userName">User Name</label>
      <input id="userName" name="username" type="text" required max="20" />
      <span class="error"></span>
    </div>
    <div>
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required min="8" />
      <span class="error"></span>
    </div>
    <div>
      <label for="password_match">Password Match</label>
      <input
        id="password_match"
        name="password_match"
        type="password"
        required
        min="8"
      />
      <span class="error"></span>
    </div>
    <button type="submit">Sign Up</button>
  </form>
</formula-form>
```

### Use as a library

To use as a library, you can pass a set of options to the formula function, and then bind it to a form element. You can also pass functions in for `pre/postChange` events and for enrichment functions.

```js
import { formula } from "@webhelpers/formula";

const formEl = document.querySelector("form");
const formulaInstance = formula({ ...options });
const formInstance = formulaInstance.init(formulaInstance);

formulaInstance.formValues.subscribe((formValues) => {
  console.log("Form Values", formValues);
});

formulaInstance.formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  // Put your own logic here
});
```

## Web Component Attributes

These attributes can be set on the web component to give more control

| Attribute         | Type                  | Default     | Description                                                                                                                                            |
| ----------------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `formula-options` | `string \| undefined` | `undefined` | The options to pass to the formula instance                                                                                                            |
| `handle-submit`   | `boolean`             | `undefined` | If Formula should handle the form submission. If set to true you can use async requests with your form, otherwise it will use the forms default action |
| `root-selector`   | `string \| undefined` | `undefined` | The root selector to use to find the form element, if not set, the first child element will be used - use this if your form is within a container      |

## Web Component Events

These are events that can be subscribed to on the `formula-form` instance

| Event              | Detail                    | Description                                                                                                                    |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `form:dirty`       | `Record<string, boolean>` | Fired when the dirty store is updated                                                                                          |
| `form:enrichment`  | `Record<string, any>`     | Fired when the enrichment store is updated                                                                                     |
| `form:connect`     | `FormulaForm`             | Fired when the form instance is initialised, returns the form instance                                                         |
| `form:init`        | `Formula`                 | Fired when the formula instance is initialised, returns the formula instance                                                   |
| `form:submit`      | `Record<string, any>`     | Fired when the form is submitted if `data-handle-submit` is set on the web component, otherwise the form will submit as normal |
| `form:ready`       | `boolean`                 | Fired when the formReady store is updated                                                                                      |
| `form:valid`       | `boolean`                 | Fired when the formValid store is updated                                                                                      |
| `form:validity`    | `Record<string, any>`     | Fired when the formValidity store is updated                                                                                   |
| `form:values`      | `Record<string, any>`     | Fired when the formValues store is updated                                                                                     |
| `form:postChanges` | `(values) => void`        | Fired after a change is made to the form stores update, contains the latest form state                                         |
| `form:preChanges`  | `function`                | Fired before a change is made to the form stores update, useful for UI changes                                                 |
| `submit:values`    | `Record<string, any>`     | Fired when the submitValues store is updated                                                                                   |
| `form:touched`     | `Record<string, boolean>` | Fired when the touched store is updated                                                                                        |
| `form:errors`      | `Record<string, any>`     | Fired when the validity store is updated                                                                                       |

### Formula Library Options

| Option           | Detail                                     | Description                                                                                                                                                        |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `defaultValues`  | `Record<string, any>`                      | A key/value of input id values and default values to fill them with                                                                                                |
| `enrich`         | `Record<string, Record<string, Function>>` | A key/value of a input ID enrichement name and which allows you to create functions that react to changes in the store - such as password strength                 |
| `messages`       | `Record<string, Record<string, string>>`   | A key/value of ids of fields, each one an object containing [Constraints Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation) keys |
| `validators`     | `Record<string, Record<string, Function>>` | A key/value paid of an input ID and a validator name, the validator returns a function that must return itself `null` or an error message string.                  |
| `formValidators` | `Record<string, Function>`                 | A key/value pair of a name and a function that gets all the form values and can return a boolean value - used for cases such as password matching two fields       |
| `preChanges`     | `() => void`                               | Function called before any store or value updates are applied                                                                                                      |
| `postChanges`    | `(values) => void`                         | Function called after all changes have been made, contains the latest values                                                                                       |
