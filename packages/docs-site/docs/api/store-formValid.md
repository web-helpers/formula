# `formValid`

The `formValid` store is a boolean store that indicates whether the entire form is currently valid. It is `true` if there are no validation errors, and `false` otherwise.

This store is a computed store derived from the `errors` store.

## Shape

```typescript
boolean;
```

## Usage

The most common use case for `formValid` is to enable or disable the form's submit button.

### With the Web Component

Listen for the `form:valid` event.

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');
  const submitButton = document.querySelector('button[type="submit"]');

  // Disable on initial load
  submitButton.disabled = !form.formula.stores.formValid.get();

  form.addEventListener('form:valid', (e) => {
    const isValid = e.detail;
    submitButton.disabled = !isValid;
  });
</script>

<formula-form>
  <form>
    <input name="email" type="email" required />
    <button type="submit">Submit</button>
  </form>
</formula-form>
```

### With the Library

Subscribe to the `formValid` store.

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const formulaInstance = formula().init(formEl);
const submitButton = formEl.querySelector('button[type="submit"]');

formulaInstance.stores.formValid.subscribe((isValid) => {
  submitButton.disabled = !isValid;
});
```
