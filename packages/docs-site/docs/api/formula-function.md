# `formula(options?)`

The `formula` function is the entry point for using Formula as a library. It creates a new Formula instance, which you can then use to initialize and manage your form.

## Signature

```typescript
function formula(options?: FormulaOptions): FormulaInstance;
```

## Options

You can pass an optional `options` object to customize Formula's behavior.

- **`preChanges`**: `(values: Record<string, any>) => void`
  A callback function that is executed _before_ any of the stores are updated with new values. This is useful for performing actions or checks before the state changes.

- **`postChanges`**: `(values: Record<string, any>) => void`
  A callback function that is executed _after_ all stores have been updated. This is the ideal place for custom validation or logic that depends on the latest form state.

- **`enrichment`**: `(values: Record<string, any>) => Record<string, any>`
  A function that takes the current form values and returns an object of computed (or "enriched") values. This allows you to derive new state from the form data, such as a password strength score or a combined "fullName" field. The result is stored in the `enrichment` store.

## Returns

The `formula` function returns a `FormulaInstance` object with the following properties and methods:

- **`stores`**: An object containing all the reactive [stores](./stores.md) for the form.
- **`init(formElement: HTMLFormElement)`**: A method to initialize the Formula instance with a specific `<form>` element. This is what wires up all the event listeners and makes the form reactive. It returns the instance for chaining.
- **`destroy()`**: A method to clean up all event listeners and subscriptions created by the instance. Call this when your form is removed from the DOM to prevent memory leaks.

## Usage Example

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');

const formulaInstance = formula({
  // Example: Log values before they change
  preChanges: (values) => {
    console.log('About to update with:', values);
  },

  // Example: Custom validation after changes
  postChanges: (values) => {
    if (values.password !== values.confirmPassword) {
      // You might set a custom error here
      console.error('Passwords do not match!');
    }
  },

  // Example: Compute a full name
  enrichment: (values) => {
    return {
      fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim(),
    };
  },
});

// Initialize the form
formulaInstance.init(formEl);

// Now you can subscribe to stores
formulaInstance.stores.formValues.subscribe((values) => {
  console.log('Current values:', values);
});

formulaInstance.stores.enrichment.subscribe((enriched) => {
  console.log('Enriched data:', enriched);
});

// When the component is unmounted or form is removed
// formulaInstance.destroy();
```
