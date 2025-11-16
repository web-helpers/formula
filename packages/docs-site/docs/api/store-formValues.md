# `formValues`

The `formValues` store holds an object containing the real-time values of all fields in your form. The keys of the object are the `name` attributes of your form controls.

## Shape

```typescript
Record<string, any>;
```

## Usage

You can subscribe to the `formValues` store to react to any changes in the form's data. This is useful for updating your UI, saving form state, or triggering other actions.

### With the Web Component

When using the `<formula-form>` web component, you can listen for the `form:values` custom event.

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');
  form.addEventListener('form:values', (e) => {
    console.log('Current form values:', e.detail);
    // e.detail is the same as formValues.get()
  });
</script>

<formula-form>
  <form>
    <input name="email" type="email" />
    <input name="name" type="text" />
  </form>
</formula-form>
```

### With the Library

If you're using Formula as a library, you can subscribe directly to the store.

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const formulaInstance = formula().init(formEl);

const unsubscribe = formulaInstance.stores.formValues.subscribe((values) => {
  console.log('Form values have changed:', values);
  // Update your UI, e.g., with a preview of the form data
});

// To get the current value at any time:
const currentValues = formulaInstance.stores.formValues.get();
```
