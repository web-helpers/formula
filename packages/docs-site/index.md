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

Getting started with Formula takes just minutes. Install it via npm or use it directly from a CDN - no build step required.

### Installation

```bash
npm install @webhelpers/formula
```

### Your First Reactive Form

The simplest way to get started is with the web component. Just wrap your existing HTML form and import Formula:

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

      // Listen to real-time form values as users type
      form.addEventListener('form:values', (e) => {
        console.log('Form data:', e.detail);
      });

      // Handle form submission with your API
      form.addEventListener('form:submit', async (e) => {
        await fetch('/api/submit', {
          method: 'POST',
          body: JSON.stringify(e.detail),
        });
      });
    </script>
  </body>
</html>
```

That's it! Your form now has reactive state management, automatic validation, and real-time updates. No build tools needed if you use a CDN like `esm.sh`.

## Why Formula?

Most form libraries force you to rewrite your HTML or learn complex APIs. Formula takes a different approach: it works with the HTML you already have. Just wrap your form with `<formula-form>` and you instantly get reactive state management, automatic validation, and real-time updates.

Formula is built on web standards - it uses native HTML5 Constraint Validation and ARIA for accessibility. This means your forms work great with screen readers and other assistive technologies without extra effort. The library itself is tiny (under 20KB gzipped) and framework-agnostic, so you can use it with React, Vue, Svelte, or vanilla JavaScript.

Behind the scenes, Formula uses nanostores for reactive state management. As users interact with your form, these stores automatically update with current values, validation errors, touched fields, and dirty state. You can subscribe to these stores to build dynamic UIs that respond instantly to user input.

## Core Concepts

### Reactive State Management

When you initialize Formula on a form, it creates several reactive stores that automatically track your form's state. These stores update in real-time as users interact with your form:

The **formValues** store contains the current value of every field in your form. Subscribe to it to display data elsewhere in your UI, enable/disable buttons, or trigger other actions as users type.

The **errors** store tracks validation errors for each field, combining both HTML5 Constraint Validation and any custom rules you define.

The **touched** and **dirty** stores help you build better UX by tracking which fields users have interacted with and which have been modified from their initial values. This lets you show validation errors only after users have actually edited a field.

The **formValid** and **formReady** stores provide boolean flags for the entire form's state, making it easy to enable submit buttons or show completion indicators.

### Event-Driven Architecture

When using the web component, Formula emits custom events that you can listen to. The `form:values` event fires whenever any field changes. The `form:submit` event fires on submission when you use the `handle-submit` attribute. You can also listen for `form:errors`, `form:touched`, `form:dirty`, and other events to respond to specific state changes.

### Form Enrichment

Sometimes you need to derive additional data from your form values. Formula's enrichment feature lets you add computed fields without storing them in your actual form. For example, you might calculate a password strength score, combine first and last names into a full name, or compute shipping costs based on selected options. Just provide an enrichment function and Formula will keep these computed values up to date in a separate store.

## Support

Formula is part of the [Web Helpers](https://github.com/web-helpers/) project - a collection of developer-first libraries for the modern web.

- 🐛 [Report Issues](https://github.com/web-helpers/formula/issues)
- 💡 [Feature Requests](https://github.com/web-helpers/formula/discussions)
- 📖 [Documentation](https://github.com/web-helpers/formula)
- ⭐ [Star on GitHub](https://github.com/web-helpers/formula)
