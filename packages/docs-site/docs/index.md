# Formula Documentation

Welcome to the Formula documentation! Formula is a lightweight, framework-agnostic library for creating dynamic, reactive forms with zero configuration.

## Getting Started

### Installation

Install Formula via npm:

```bash
npm install @webhelpers/formula
```

Or use it directly in the browser with esm.sh (no build step required):

```html
<script type="module">
  import { formula } from 'https://esm.sh/@webhelpers/formula@latest';
</script>
```

### Your First Form

The quickest way to get started is with the web component:

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

That's it! Your form is now reactive with automatic validation, error handling, and state management.

## Core Concepts

### Reactive Stores

Formula uses [nanostores](https://github.com/nanostores/nanostores) to provide reactive state management. Every form automatically gets these stores:

- **`formValues`** - Real-time values of all form fields
- **`errors`** - Validation errors for each field
- **`touched`** - Tracks which fields the user has interacted with
- **`dirty`** - Tracks which fields have been modified from their initial values
- **`formValid`** - Boolean indicating if the entire form is valid
- **`formReady`** - Boolean indicating if the form is ready to submit

### Custom Events

When using the web component, Formula emits custom events you can listen to:

| Event          | Payload                   | Description                                     |
| -------------- | ------------------------- | ----------------------------------------------- |
| `form:values`  | `Record<string, any>`     | Fires when any field value changes              |
| `form:errors`  | `Record<string, any>`     | Fires when validation state changes             |
| `form:touched` | `Record<string, boolean>` | Fires when a field is touched                   |
| `form:dirty`   | `Record<string, boolean>` | Fires when a field becomes dirty                |
| `form:valid`   | `boolean`                 | Fires when overall form validity changes        |
| `form:ready`   | `boolean`                 | Fires when form ready state changes             |
| `form:submit`  | `Record<string, any>`     | Fires on form submission (with `handle-submit`) |
| `form:init`    | `Formula`                 | Fires when the formula instance is initialized  |
| `form:connect` | `FormulaForm`             | Fires when the form instance is initialized     |

### HTML5 Validation

Formula leverages native HTML5 [Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation) attributes:

```html
<input name="email" type="email" required pattern="[^@]+@[^@]+\.[^@]+" />

<input name="age" type="number" min="18" max="120" />

<input name="username" type="text" minlength="3" maxlength="20" required />
```

All native validation attributes work automatically with Formula.

## Usage Patterns

### As a Web Component

The easiest way to use Formula - just wrap your form:

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');

  // Subscribe to value changes
  form.addEventListener('form:values', (e) => {
    console.log('Current values:', e.detail);
  });

  // Handle submission
  form.addEventListener('form:submit', async (e) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e.detail),
    });

    if (response.ok) {
      console.log('Form submitted successfully!');
    }
  });
</script>

<formula-form handle-submit>
  <form action="/api/submit" method="POST">
    <!-- Your form fields here -->
  </form>
</formula-form>
```

### As a Library

For more control, use Formula as a library:

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const formulaInstance = formula({
  // Optional configuration
  preChanges: (values) => {
    console.log('Before change:', values);
  },
  postChanges: (values) => {
    console.log('After change:', values);
  },
});

const formInstance = formulaInstance.init(formEl);

// Subscribe to stores directly
formulaInstance.stores.formValues.subscribe((values) => {
  console.log('Form values:', values);
});

formulaInstance.stores.errors.subscribe((errors) => {
  console.log('Form errors:', errors);
});

formulaInstance.stores.formValid.subscribe((isValid) => {
  const submitBtn = formEl.querySelector('[type="submit"]');
  submitBtn.disabled = !isValid;
});
```

## Web Component Attributes

Configure the `<formula-form>` component with these attributes:

| Attribute         | Type    | Default     | Description                                                                  |
| ----------------- | ------- | ----------- | ---------------------------------------------------------------------------- |
| `handle-submit`   | boolean | `false`     | If present, Formula will handle form submission and emit `form:submit` event |
| `root-selector`   | string  | `undefined` | CSS selector to find the form element (if not a direct child)                |
| `formula-options` | string  | `undefined` | JSON string of options to pass to the formula instance                       |

### Examples

```html
<!-- Let Formula handle submission -->
<formula-form handle-submit>
  <form>...</form>
</formula-form>

<!-- Form nested in a container -->
<formula-form root-selector=".my-form">
  <div class="wrapper">
    <form class="my-form">...</form>
  </div>
</formula-form>

<!-- Pass custom options -->
<formula-form formula-options='{"validateOnBlur": true}'>
  <form>...</form>
</formula-form>
```

## Advanced Features

### Form Enrichment

Enhance your forms with computed values and custom logic:

```javascript
const formulaInstance = formula({
  enrichment: (values) => {
    return {
      passwordStrength: calculateStrength(values.password),
      passwordsMatch: values.password === values.password_confirm,
      fullName: `${values.firstName} ${values.lastName}`,
    };
  },
});

formulaInstance.stores.enrichment.subscribe((enriched) => {
  console.log('Enriched data:', enriched);
});
```

### Custom Validation

Add custom validation beyond HTML5 constraints:

```javascript
import { formula } from '@webhelpers/formula';

const formulaInstance = formula({
  postChanges: (values) => {
    // Custom validation logic
    if (values.password && values.password.length < 8) {
      // Update UI or set custom errors
    }
  },
});
```

### Styling with State

Use CSS to style forms based on their state:

```css
/* Style invalid fields that have been touched */
input:invalid[aria-invalid='true'] {
  border-color: red;
}

/* Style valid fields */
input:valid {
  border-color: green;
}

/* Show error messages only for touched invalid fields */
input:invalid[aria-invalid='true'] ~ .error-message {
  display: block;
}

.error-message {
  display: none;
  color: red;
  font-size: 0.875rem;
}
```

## Examples

### Basic Form

See a [complete working example](./basic-form.md) with:

- Live form values display
- Error handling
- Dirty/touched state indicators
- Form submission handling
- No build step required (uses esm.sh)

### Password Strength Meter

```javascript
form.addEventListener('form:values', (e) => {
  const { password } = e.detail;
  const strength = calculatePasswordStrength(password);
  document.querySelector('#strength-meter').value = strength;
});
```

### Async Validation

```javascript
form.addEventListener('form:values', async (e) => {
  const { username } = e.detail;
  if (username && username.length >= 3) {
    const available = await checkUsernameAvailability(username);
    const errorEl = document.querySelector('#username ~ .error');
    errorEl.textContent = available ? '' : 'Username already taken';
  }
});
```

### Form Reset

```javascript
const resetBtn = document.querySelector('#reset-btn');
resetBtn.addEventListener('click', () => {
  // Reset the form element
  formEl.reset();

  // Formula will automatically update all stores
});
```

## Framework Integration

### React

```jsx
import { useEffect, useRef, useState } from 'react';
import '@webhelpers/formula/webcomponent';

function MyForm() {
  const formRef = useRef(null);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const form = formRef.current;

    const handleValues = (e) => {
      setFormValues(e.detail);
    };

    form.addEventListener('form:values', handleValues);

    return () => {
      form.removeEventListener('form:values', handleValues);
    };
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
  <formula-form ref="formulaForm" handle-submit @form:values="handleValues" @form:submit="handleSubmit">
    <form>
      <input name="email" type="email" required />
      <button type="submit">Submit</button>
    </form>
  </formula-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import '@webhelpers/formula/webcomponent';

const formulaForm = ref(null);
const formValues = ref({});

const handleValues = (e) => {
  formValues.value = e.detail;
};

const handleSubmit = async (e) => {
  console.log('Submitting:', e.detail);
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

## API Reference

For a detailed look at the Formula API, please see the following pages:

- **[`formula(options)`](./api/formula-function.md)**: The core function for creating a Formula instance.
- **[Reactive Stores](./api/stores.md)**: A deep dive into the individual stores (`formValues`, `errors`, `dirty`, etc.).
- **[`<formula-form>` Web Component](./api/web-component.md)**: Full documentation for the web component, including attributes and events.

### TypeScript Support

Formula includes TypeScript definitions. Import types as needed:

```typescript
import type { Formula, FormulaOptions, FormulaStores } from '@webhelpers/formula';
```

## Contributing

Formula is part of the [Web Helpers](https://github.com/web-helpers/) project. Contributions are welcome!

- [Report Issues](https://github.com/web-helpers/formula/issues)
- [Submit Pull Requests](https://github.com/web-helpers/formula/pulls)
- [Join Discussions](https://github.com/web-helpers/formula/discussions)

## License

Formula is [MIT licensed](https://github.com/web-helpers/formula/blob/main/LICENSE).
