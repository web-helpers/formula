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

::: code-group

```html [npm]
<!DOCTYPE html>
<html>
  <head>
    <title>My Reactive Form</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: system-ui, sans-serif; background: #f5f5f5; padding: 2rem; }
      .card { background: white; border-radius: 12px; padding: 2rem; max-width: 400px; 
              margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      h2 { margin: 0 0 1.5rem; color: #333; }
      .field { margin-bottom: 1rem; }
      label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #555; }
      input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;
              font-size: 1rem; transition: border-color 0.2s; }
      input:focus { outline: none; border-color: #6366f1; }
      input:invalid:not(:placeholder-shown) { border-color: #ef4444; }
      button { width: 100%; padding: 0.75rem; background: #6366f1; color: white;
               border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; }
      button:hover { background: #4f46e5; }
      button:disabled { background: #a5a5a5; cursor: not-allowed; }
      .output { margin-top: 1.5rem; padding: 1rem; background: #1e1e1e; 
                border-radius: 8px; font-family: monospace; font-size: 0.85rem; }
      .output pre { margin: 0; color: #a5d6ff; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>🧪 Sign Up</h2>
      <formula-form handle-submit>
        <form>
          <div class="field">
            <label for="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" 
                   placeholder="Min 8 characters" required minlength="8" />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </formula-form>
      <div class="output">
        <pre id="output">{ "email": "", "password": "" }</pre>
      </div>
    </div>

    <script type="module">
      import '@webhelpers/formula/webcomponent';

      const form = document.querySelector('formula-form');
      const output = document.getElementById('output');

      // Live output as users type
      form.addEventListener('form:values', (e) => {
        output.textContent = JSON.stringify(e.detail, null, 2);
      });

      form.addEventListener('form:submit', async (e) => {
        e.preventDefault();
        alert('Form submitted! Check the console.');
        console.log('Submitted:', e.detail);
      });
    </script>
  </body>
</html>
```

```html [CDN (esm.sh)]
<!DOCTYPE html>
<html>
  <head>
    <title>My Reactive Form</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: system-ui, sans-serif; background: #f5f5f5; padding: 2rem; }
      .card { background: white; border-radius: 12px; padding: 2rem; max-width: 400px; 
              margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      h2 { margin: 0 0 1.5rem; color: #333; }
      .field { margin-bottom: 1rem; }
      label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #555; }
      input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;
              font-size: 1rem; transition: border-color 0.2s; }
      input:focus { outline: none; border-color: #6366f1; }
      input:invalid:not(:placeholder-shown) { border-color: #ef4444; }
      button { width: 100%; padding: 0.75rem; background: #6366f1; color: white;
               border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; }
      button:hover { background: #4f46e5; }
      button:disabled { background: #a5a5a5; cursor: not-allowed; }
      .output { margin-top: 1.5rem; padding: 1rem; background: #1e1e1e; 
                border-radius: 8px; font-family: monospace; font-size: 0.85rem; }
      .output pre { margin: 0; color: #a5d6ff; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>🧪 Sign Up</h2>
      <formula-form handle-submit>
        <form>
          <div class="field">
            <label for="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" 
                   placeholder="Min 8 characters" required minlength="8" />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </formula-form>
      <div class="output">
        <pre id="output">{ "email": "", "password": "" }</pre>
      </div>
    </div>

    <script type="module">
      // No build step required - import directly from esm.sh
      import 'https://esm.sh/@webhelpers/formula/webcomponent';

      const form = document.querySelector('formula-form');
      const output = document.getElementById('output');

      // Live output as users type
      form.addEventListener('form:values', (e) => {
        output.textContent = JSON.stringify(e.detail, null, 2);
      });

      form.addEventListener('form:submit', async (e) => {
        e.preventDefault();
        alert('Form submitted! Check the console.');
        console.log('Submitted:', e.detail);
      });
    </script>
  </body>
</html>
```

:::

That's it! Your form now has reactive state management, automatic validation, and real-time updates. The CDN option requires no build tools - just add the script and start using Formula immediately.

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
