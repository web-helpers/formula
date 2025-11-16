# `formReady`

The `formReady` store is a boolean store that indicates if the form is ready to be submitted. It is `true` only when the form is both `valid` and `dirty`.

This is useful in scenarios where you only want to allow submission if the form is valid and has changes.

## Shape

```typescript
boolean;
```

## Usage

Use `formReady` to control the enabled state of a submit or save button, ensuring users can only submit a valid form that has pending changes.

### With the Web Component

Listen for the `form:ready` event.

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');
  const submitButton = document.querySelector('button[type="submit"]');

  // Disable on initial load
  submitButton.disabled = !form.formula.stores.formReady.get();

  form.addEventListener('form:ready', (e) => {
    const isReady = e.detail;
    submitButton.disabled = !isReady;
  });
</script>

<formula-form>
  <form>
    <input name="username" type="text" required value="initial" />
    <button type="submit">Save Changes</button>
  </form>
</formula-form>
```

In this example, the "Save Changes" button will be disabled until the user modifies the username to a valid value.

### With the Library

Subscribe to the `formReady` store.

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const formulaInstance = formula().init(formEl);
const submitButton = formEl.querySelector('button[type="submit"]');

formulaInstance.stores.formReady.subscribe((isReady) => {
  submitButton.disabled = !isReady;
});
```

This provides a simple way to enforce that only meaningful changes are submitted.
