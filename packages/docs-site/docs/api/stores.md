# Stores

Formula provides a set of reactive stores, powered by [nanostores](https://github.com/nanostores/nanostores), that give you real-time state for your forms.

Each store can be subscribed to, allowing you to react to changes in your UI or application logic.

## Available Stores

- [`formValues`](./store-formValues.md) - Real-time values of all form fields.
- [`errors`](./errors.md) - Validation errors for each field.
- [`touched`](./touched.md) - Tracks which fields the user has interacted with.
- [`dirty`](./dirty.md) - Tracks which fields have been modified from their initial values.
- [`formValid`](./form-valid.md) - A boolean indicating if the entire form is valid.
- [`formReady`](./form-ready.md) - A boolean indicating if the form is ready to be submitted.
