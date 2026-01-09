# `errors`

The `errors` store contains an object with validation errors for each form field. The keys are the field names, and the values are the error messages. If a field is valid, it will not have an entry in the `errors` object.

Formula automatically uses HTML5 Constraint Validation to populate these errors.

## Shape

```typescript
Record<string, string>;
```

## Usage

You can use the `errors` store to display validation messages to the user.

### With the Web Component

Listen for the `form:errors` event to get updates.

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');
  const errorContainer = document.querySelector('#error-summary');

  form.addEventListener('form:errors', (e) => {
    const errors = e.detail;
    errorContainer.innerHTML = '';
    for (const field in errors) {
      const li = document.createElement('li');
      li.textContent = `${field}: ${errors[field]}`;
      errorContainer.appendChild(li);
    }
  });
</script>

<formula-form>
  <form>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
    <div class="error-message" id="email-error"></div>
  </form>
</formula-form>

<ul id="error-summary"></ul>
```

### With the Library

Subscribe to the `errors` store to handle error changes programmatically.

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const formulaInstance = formula().init(formEl);

formulaInstance.stores.errors.subscribe((errors) => {
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach((el) => (el.textContent = ''));

  // Display new errors
  for (const fieldName in errors) {
    const errorEl = document.querySelector(`#${fieldName}-error`);
    if (errorEl) {
      errorEl.textContent = errors[fieldName];
    }
  }
});
```

Formula also adds `aria-invalid="true"` to invalid fields, which you can use for styling:

```css
input[aria-invalid='true'] {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.875rem;
}
```
