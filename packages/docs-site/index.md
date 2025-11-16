---
layout: home

hero:
  name: '🧪 Formula'
  text: 'Progressively-enhanced, Dynamic, Reactive Forms for the Modern Web'
  tagline: Turn any static HTML form into a fully reactive, state-driven experience with zero configuration
  image:
    src: https://raw.githubusercontent.com/web-helpers/formula/main/packages/formula/docs/logo_256.png
    alt: Formula Logo
  actions:
    - theme: brand
      text: Documentation
      link: /docs/index
    - theme: alt
      text: GitHub
      link: https://github.com/web-helpers/formula

features:
  - icon: ⚡
    title: Zero Configuration
    details: Wrap any HTML form with <formula-form> and get instant reactivity. No complex setup, no templates to learn.

  - icon: 🎯
    title: Standards-Based
    details: Built on HTML5 Constraint Validation and ARIA. Works with your existing forms and accessibility tools.

  - icon: 🪶
    title: Lightweight & Fast
    details: Built with VanillaJS and nanostores. Tiny bundle size with maximum performance.

  - icon: 🔄
    title: Reactive Stores
    details: Subscribe to form values, errors, touched, dirty state, and validity in real-time with reactive stores.

  - icon: 🧩
    title: Use Anywhere
    details: Framework agnostic. Use as a web component or integrate directly as a library in React, Vue, Svelte, or vanilla JS.

  - icon: 🎨
    title: Fully Customizable
    details: Complete control over validation, error messages, form enrichment, and submit handling.
---

## Quick Start

Get up and running in seconds with npm or directly in the browser with esm.sh:

### NPM Installation

```bash
npm install @webhelpers/formula
```

### Web Component Usage

The fastest way to get started - just import and use:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Reactive Form</title>
  </head>
  <body>
    <formula-form handle-submit>
      <form>
        <input name="email" type="email" required />
        <input name="password" type="password" required minlength="8" />
        <button type="submit">Submit</button>
      </form>
    </formula-form>

    <script type="module">
      import '@webhelpers/formula/webcomponent';

      const form = document.querySelector('formula-form');

      // Listen to real-time form values
      form.addEventListener('form:values', (e) => {
        console.log('Form data:', e.detail);
      });

      // Handle form submission
      form.addEventListener('form:submit', async (e) => {
        const response = await fetch('/api/submit', {
          method: 'POST',
          body: JSON.stringify(e.detail),
        });
      });
    </script>
  </body>
</html>
```

### CDN Usage (No Build Step)

```html
<script type="module">
  import { formula } from 'https://esm.sh/@webhelpers/formula@latest';

  const formEl = document.querySelector('form');
  const { stores, init } = formula();
  init(formEl);

  stores.formValues.subscribe((values) => {
    console.log('Form values:', values);
  });
</script>
```

## Why Formula?

### 🎯 **Works with Your HTML**

No need to rewrite your forms or learn a new template syntax. Formula enhances your existing HTML forms with reactivity.

### ⚡ **Instant State Management**

Get reactive stores for form values, errors, touched fields, dirty state, and validation - all automatically synced with your form.

### 🔌 **Framework Agnostic**

Use Formula with React, Vue, Svelte, Angular, or vanilla JavaScript. It's just a web component or library import.

### 🪶 **Tiny Bundle Size**

Built with performance in mind. The entire library is lightweight and tree-shakeable.

### ♿ **Accessibility First**

Leverages native HTML5 validation and ARIA attributes for a fully accessible form experience out of the box.

### 🧪 **Test Coverage**

163 tests and good coverage > 90% coverage on complex DOM interactions.

## Core Concepts

### Reactive Stores

Formula provides several reactive stores that automatically update as users interact with your form:

- **`formValues`** - Current values of all form fields
- **`errors`** - Validation errors for each field
- **`touched`** - Which fields have been interacted with
- **`dirty`** - Which fields have been modified
- **`formValid`** - Overall form validation state
- **`formReady`** - Whether the form is ready for submission

### Event-Driven

Subscribe to custom events for fine-grained control:

- `form:values` - Fires when any field value changes
- `form:errors` - Fires when validation state changes
- `form:submit` - Fires on form submission (with `handle-submit`)
- `form:valid` - Fires when form validity changes
- `form:touched` - Fires when a field is touched
- `form:dirty` - Fires when a field becomes dirty

### Form Enrichment

Enhance your forms with computed values, password strength meters, async validation, and more using enrichment functions.

```js
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const { init, enrich, stores } = formula();

enrich((values) => ({
  passwordStrength: computePasswordStrength(values.password),
}));

// how to get password strength
stores.formValues.subscribe((values) => {
  console.log('Password Strength:', values.passwordStrength);
});

init(formEl);
```

## Support

Formula is part of the [Web Helpers](https://github.com/web-helpers/) project - a collection of developer-first libraries for the modern web.

- 🐛 [Report Issues](https://github.com/web-helpers/formula/issues)
- 💡 [Feature Requests](https://github.com/web-helpers/formula/discussions)
- 📖 [Documentation](https://github.com/web-helpers/formula)
- ⭐ [Star on GitHub](https://github.com/web-helpers/formula)
