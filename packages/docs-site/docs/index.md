# Formula Documentation

Formula is a lightweight, framework-agnostic library that transforms static HTML forms into reactive, state-driven experiences. Instead of forcing you to rewrite your forms in a specific framework or template language, Formula works with the HTML you already have.

## Getting Started

### Installation

Install Formula via npm:

```bash
npm install @webhelpers/formula
```

For quick prototyping or static sites, you can also import directly from a CDN without any build tools:

```html
<script type="module">
  import { formula } from 'https://esm.sh/@webhelpers/formula@latest';
</script>
```

### Your First Form

The quickest way to get started is with the web component. It wraps your existing HTML form and automatically adds reactive state management:

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';
</script>

<formula-form handle-submit>
  <form>
    <input name="email" type="email" required />
    <input name="password" type="password" required minlength="8" />
    <button type="submit">Submit</button>
  </form>
</formula-form>
```

That's all you need! Your form now has automatic validation, error handling, and reactive state management. The `handle-submit` attribute tells Formula to intercept form submission and emit a `form:submit` event with the form data.

## Understanding Form State

When you initialize Formula on a form, it creates several reactive stores powered by [nanostores](https://github.com/nanostores/nanostores). These stores automatically track your form's state and update in real-time as users interact with it.

### The Core Stores

**formValues** contains the current value of every field in your form. It updates as users type, select options, or check boxes. This is your source of truth for what's actually in the form.

**errors** tracks validation errors for each field. Formula automatically uses HTML5 Constraint Validation (like `required`, `minlength`, `pattern`) to populate this store. You can also add custom validation rules.

**touched** tracks which fields users have focused and then left. This is important for UX - you typically don't want to show error messages until after a user has actually interacted with a field.

**dirty** tracks which fields have been changed from their initial values. A field is "dirty" if its current value differs from what it was when the form loaded or was last reset.

**formValid** is a boolean that tells you if the entire form passes all validation rules. Use this to enable/disable submit buttons or show completion indicators.

**formReady** is similar to formValid but also considers whether all required fields have values. It's a useful shorthand for "can this form be submitted?"

### Working with Stores

Stores are reactive, which means you can subscribe to them and get notified whenever they change:

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const { stores, init } = formula();

// Subscribe to value changes
stores.formValues.subscribe((values) => {
  console.log('Current form data:', values);
  // Update your UI, enable buttons, etc.
});

// Subscribe to errors
stores.errors.subscribe((errors) => {
  console.log('Validation errors:', errors);
  // Display error messages in your UI
});

// Check if form is valid
stores.formValid.subscribe((isValid) => {
  const submitButton = formEl.querySelector('[type="submit"]');
  submitButton.disabled = !isValid;
});

init(formEl);
```

### HTML5 Validation Support

Formula automatically understands all standard HTML5 validation attributes. Just use them in your markup and Formula will enforce the rules:

```html
<!-- Email validation -->
<input name="email" type="email" required />

<!-- Numeric ranges -->
<input name="age" type="number" min="18" max="120" />

<!-- String length -->
<input name="username" type="text" minlength="3" maxlength="20" required />

<!-- Pattern matching -->
<input name="phone" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
```

All these validation rules work automatically with Formula's error store.

## Usage Patterns

Formula offers two main ways to use it: as a web component for simplicity, or as a library for more control. Both approaches give you full access to reactive stores and validation.

### Using the Web Component

The web component is the easiest way to get started. It handles all the setup for you and provides a clean, declarative API:

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');

  // Listen to real-time value changes
  form.addEventListener('form:values', (e) => {
    console.log('Current values:', e.detail);
    // Update your UI, show progress, etc.
  });

  // Handle form submission
  form.addEventListener('form:submit', async (e) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e.detail),
    });

    if (response.ok) {
      form.querySelector('form').reset();
    }
  });

  // Listen to validation errors
  form.addEventListener('form:errors', (e) => {
    console.log('Validation errors:', e.detail);
  });
</script>

<formula-form handle-submit>
  <form action="/api/submit" method="POST">
    <input name="email" type="email" required />
    <input name="password" type="password" required minlength="8" />
    <button type="submit">Submit</button>
  </form>
</formula-form>
```

The web component emits several custom events that you can listen to: `form:values`, `form:errors`, `form:touched`, `form:dirty`, `form:valid`, `form:ready`, and `form:submit`. Each event includes the relevant data in its `detail` property.

### Using as a Library

For more control, you can use Formula as a library and work directly with the stores:

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');

// Create a Formula instance with optional configuration
const { stores, init, destroy } = formula({
  // Run before any stores are updated
  preChanges: (values) => {
    console.log('About to update:', values);
  },

  // Run after all stores are updated - great for custom validation
  postChanges: (values) => {
    if (values.password && values.password !== values.confirmPassword) {
      console.error('Passwords do not match!');
    }
  },

  // Add computed values that derive from form data
  enrichment: (values) => ({
    fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim(),
    passwordStrength: calculatePasswordStrength(values.password),
  }),
});

// Initialize the form
init(formEl);

// Subscribe to stores
stores.formValues.subscribe((values) => {
  console.log('Form values:', values);
});

stores.enrichment.subscribe((enriched) => {
  document.querySelector('#fullname-display').textContent = enriched.fullName;
  document.querySelector('#strength-meter').value = enriched.passwordStrength;
});

stores.formValid.subscribe((isValid) => {
  formEl.querySelector('[type="submit"]').disabled = !isValid;
});

// When you're done (e.g., component unmounts), clean up
// destroy();
```

### Web Component Configuration

You can configure the web component with these attributes:

**handle-submit** - When present, Formula intercepts form submission and emits a `form:submit` event instead of actually submitting the form. This lets you handle submission with JavaScript (e.g., sending an API request).

**root-selector** - If your form isn't a direct child of `<formula-form>`, provide a CSS selector to find it. For example: `root-selector=".my-form"`.

**formula-options** - Pass a JSON string of options to the Formula instance. For example: `formula-options='{"validateOnBlur": true}'`.

## Advanced Features

### Form Enrichment

Sometimes you need to derive additional data from form values without actually storing it in the form itself. Formula's enrichment feature is perfect for computed values like password strength scores, combined names, or calculations:

```javascript
const { stores, init } = formula({
  enrichment: (values) => ({
    // Combine first and last names
    fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim(),

    // Calculate password strength (0-5 score)
    passwordStrength: calculatePasswordStrength(values.password),

    // Check if passwords match
    passwordsMatch: values.password === values.confirmPassword,

    // Compute total price
    total: (values.quantity || 0) * (values.price || 0),
  }),
});

// Access enriched values in a separate store
stores.enrichment.subscribe((enriched) => {
  document.querySelector('#fullname').textContent = enriched.fullName;
  document.querySelector('#strength-meter').value = enriched.passwordStrength;
});
```

The enrichment function runs automatically whenever form values change, and the results are stored in the `enrichment` store.

### Custom Validation

While HTML5 validation handles many common cases, you often need more complex rules. Use the `postChanges` callback to add custom validation logic:

```javascript
const { stores, init } = formula({
  postChanges: (values) => {
    // Check password match
    if (values.password && values.confirmPassword) {
      if (values.password !== values.confirmPassword) {
        // You can set custom error states here
        // or update your UI directly
      }
    }

    // Validate username format
    if (values.username && !/^[a-zA-Z0-9_]+$/.test(values.username)) {
      // Handle invalid username
    }
  },
});
```

For asynchronous validation (like checking username availability with an API), use the web component's event listeners:

```javascript
form.addEventListener('form:values', async (e) => {
  const { username } = e.detail;

  if (username && username.length >= 3) {
    const response = await fetch(`/api/check-username/${username}`);
    const { available } = await response.json();

    const errorEl = document.querySelector('#username-error');
    errorEl.textContent = available ? '' : 'Username already taken';
  }
});
```

### Styling Based on State

Formula automatically sets ARIA attributes on form fields based on their validation state. You can use CSS to style fields accordingly:

```css
/* Style invalid fields that have been touched */
input:invalid[aria-invalid='true'] {
  border-color: #ef4444;
  background-color: #fef2f2;
}

/* Style valid fields */
input:valid[aria-invalid='false'] {
  border-color: #10b981;
}

/* Show error messages only for touched invalid fields */
input:invalid[aria-invalid='true'] ~ .error-message {
  display: block;
}

.error-message {
  display: none;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

## Examples

Learn by example with these complete, working demonstrations:

- **[Basic Form](./basic-form.md)** - A simple contact form showing real-time values, error handling, dirty/touched states, and form submission. No build tools required - uses CDN imports.

- **[Custom Validation](./custom-validation.md)** - An advanced registration form with password strength checking, cross-field validation, and asynchronous username availability checking.

- **[Dynamic Fields](./dynamic-fields.md)** - Add and remove form fields dynamically while maintaining reactive state for all fields.

- **[Web Component Integration](./web-component.md)** - Complete examples of using Formula with React, Vue, and Svelte frameworks.

Each example includes a live demo and complete source code you can copy and modify.

## Framework Integration

Formula works with any JavaScript framework. Here are complete examples for the most popular ones:

### React

```jsx
import { useEffect, useRef, useState } from 'react';
import '@webhelpers/formula/webcomponent';

function MyForm() {
  const formRef = useRef(null);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const form = formRef.current;
    const handleValues = (e) => setFormValues(e.detail);

    form.addEventListener('form:values', handleValues);
    return () => form.removeEventListener('form:values', handleValues);
  }, []);

  return (
    <formula-form ref={formRef} handle-submit>
      <form>
        <input name="email" type="email" required />
        <button type="submit">Submit</button>
      </form>
    </formula-form>
  );
}
```

### Vue

```vue
<template>
  <formula-form handle-submit @form:values="handleValues">
    <form>
      <input name="email" type="email" required />
      <button type="submit">Submit</button>
    </form>
  </formula-form>
</template>

<script setup>
import { ref } from 'vue';
import '@webhelpers/formula/webcomponent';

const formValues = ref({});
const handleValues = (e) => {
  formValues.value = e.detail;
};
</script>
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import '@webhelpers/formula/webcomponent';

  let formValues = {};
  let formulaForm;

  onMount(() => {
    formulaForm.addEventListener('form:values', (e) => {
      formValues = e.detail;
    });
  });
</script>

<formula-form bind:this={formulaForm} handle-submit>
  <form>
    <input name="email" type="email" required />
    <button type="submit">Submit</button>
  </form>
</formula-form>
```

Each framework works essentially the same way - import the web component, use event listeners to react to form changes, and let Formula handle all the complexity of state management and validation.

## API Reference

Formula provides a simple but powerful API. Here are the main entry points:

- **[`formula(options)`](./api/formula-function.md)** - The core function that creates a Formula instance. Pass optional configuration for callbacks and enrichment.

- **[Reactive Stores](./api/stores.md)** - Deep dive into all the reactive stores (`formValues`, `errors`, `dirty`, `touched`, `formValid`, `formReady`). Learn how to subscribe to changes and use store data in your UI.

- **[`<formula-form>` Web Component](./api/web-component.md)** - Complete reference for the web component including all attributes, events, and configuration options.

### TypeScript Support

Formula is written in TypeScript and includes full type definitions. Import types as needed:

```typescript
import type { Formula, FormulaOptions, FormulaStores } from '@webhelpers/formula';

// Use types in your code
const options: FormulaOptions = {
  enrichment: (values) => ({
    fullName: `${values.firstName} ${values.lastName}`,
  }),
};
```

## Contributing

Formula is part of the [Web Helpers](https://github.com/web-helpers/) project. Contributions are welcome!

- [Report Issues](https://github.com/web-helpers/formula/issues)
- [Submit Pull Requests](https://github.com/web-helpers/formula/pulls)
- [Join Discussions](https://github.com/web-helpers/formula/discussions)

## License

Formula is [MIT licensed](https://github.com/web-helpers/formula/blob/main/LICENSE).
