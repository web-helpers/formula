# `<formula-form>` Web Component

The `<formula-form>` web component is the easiest way to get started with Formula. It's a zero-configuration wrapper around your existing HTML forms that makes them instantly reactive.

## Usage

First, import the web component. This registers the custom element.

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';
</script>
```

Then, wrap your `<form>` with the `<formula-form>` element.

```html
<formula-form handle-submit>
  <form>
    <input name="email" type="email" required />
    <input name="password" type="password" required minlength="8" />
    <button type="submit">Submit</button>
  </form>
</formula-form>
```

## Attributes

You can configure the web component using these attributes:

| Attribute         | Type    | Default     | Description                                                                                                                           |
| ----------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `handle-submit`   | boolean | `false`     | If present, Formula will prevent the default form submission and instead emit a `form:submit` event with the form values.             |
| `root-selector`   | string  | `undefined` | A CSS selector to find the `<form>` element if it's not a direct child of `<formula-form>`.                                           |
| `formula-options` | string  | `undefined` | A JSON string of options to pass to the underlying `formula` instance. See [formula function options](./formula-function.md#options). |

### Attribute Examples

**Handling Submission**

Let Formula manage the submission process.

```html
<formula-form handle-submit>
  <form>...</form>
</formula-form>
```

**Nested Form**

If your form is nested inside other elements, use `root-selector`.

```html
<formula-form root-selector=".my-form-container > form">
  <div class="my-form-container">
    <form>...</form>
  </div>
</formula-form>
```

**Passing Options**

Pass custom options like `enrichment` or `postChanges`.

```html
<formula-form
  formula-options='{
    "enrichment": { "passwordsMatch": "values.password === values.confirmPassword" }
  }'
>
  <form>...</form>
</formula-form>
```

_Note: When passing functions via `formula-options`, you must provide them as strings. Formula will evaluate them._

## Custom Events

The `<formula-form>` component emits custom events that you can listen to for reacting to state changes. The event `detail` property contains the payload.

| Event          | Payload                   | Description                                                      |
| -------------- | ------------------------- | ---------------------------------------------------------------- |
| `form:values`  | `Record<string, any>`     | Fires when any field value changes.                              |
| `form:errors`  | `Record<string, string>`  | Fires when the validation error state changes.                   |
| `form:touched` | `Record<string, boolean>` | Fires when a field is touched.                                   |
| `form:dirty`   | `Record<string, boolean>` | Fires when a field becomes dirty.                                |
| `form:valid`   | `boolean`                 | Fires when the overall form validity changes.                    |
| `form:ready`   | `boolean`                 | Fires when the form's ready state changes (`valid` and `dirty`). |
| `form:submit`  | `Record<string, any>`     | Fires on form submission if `handle-submit` is present.          |
| `form:init`    | `Formula`                 | Fires when the underlying Formula instance is initialized.       |
| `form:connect` | `FormulaForm`             | Fires when the web component itself is connected to the DOM.     |

### Listening to Events

```javascript
const form = document.querySelector('formula-form');

// Listen for value changes
form.addEventListener('form:values', (e) => {
  console.log('Current values:', e.detail);
});

// Handle form submission
form.addEventListener('form:submit', async (e) => {
  const values = e.detail;
  console.log('Submitting:', values);

  // Example: send to an API
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    alert('Form submitted!');
  }
});
```
