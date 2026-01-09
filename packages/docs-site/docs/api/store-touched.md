# `touched`

The `touched` store keeps track of which fields the user has interacted with (i.e., focused and then blurred). This is useful for controlling when to show validation errors, improving the user experience by not showing errors for fields the user hasn't visited yet.

## Shape

```typescript
Record<string, boolean>;
```

A field's value is `true` if it has been touched, otherwise it is not present in the object.

## Usage

Combine the `touched` state with the `errors` state to show error messages only when a field is both invalid and has been touched.

### With the Web Component

You can listen to both `form:touched` and `form:errors` events to manage UI updates.

```html
<style>
  .error-message {
    display: none;
    color: red;
  }
  input.touched:invalid {
    border-color: red;
  }
  input.touched:invalid ~ .error-message {
    display: block;
  }
</style>

<formula-form>
  <form>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
    <div class="error-message" id="email-error"></div>
  </form>
</formula-form>

<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');
  const emailInput = document.querySelector('#email');
  const emailError = document.querySelector('#email-error');

  let touchedState = {};
  let errorState = {};

  form.addEventListener('form:touched', (e) => {
    touchedState = e.detail;
    if (touchedState.email) {
      emailInput.classList.add('touched');
    }
    updateEmailError();
  });

  form.addEventListener('form:errors', (e) => {
    errorState = e.detail;
    updateEmailError();
  });

  function updateEmailError() {
    if (touchedState.email && errorState.email) {
      emailError.textContent = errorState.email;
    } else {
      emailError.textContent = '';
    }
  }
</script>
```

### With the Library

By subscribing to the `touched` and `errors` stores, you can achieve the same result.

```javascript
import { formula } from '@webhelpers/formula';
import { map } from 'nanostores';

const formEl = document.querySelector('form');
const formulaInstance = formula().init(formEl);

const $uiState = map({});

formulaInstance.stores.touched.subscribe((touched) => {
  for (const field in touched) {
    const input = formEl.querySelector(`[name="${field}"]`);
    input.classList.toggle('touched', touched[field]);
  }
});

formulaInstance.stores.errors.subscribe((errors) => {
  // Logic to show/hide errors based on both touched and error state
});
```
