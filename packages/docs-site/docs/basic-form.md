# Basic Form

Getting started with web forms should be easy. With Formula, you can take a standard HTML form and bring it to life with reactive state management and validation with almost no configuration. This example shows just how simple it is to get started.

## Your First Formula Form

Below is a standard HTML form. It uses built-in HTML5 validation attributes like `required` and `minlength`. Formula automatically understands these rules and uses them to validate your fields out of the box, providing appropriate error messages without any extra work.

<details>
<summary><strong>📄 Click to view complete HTML example</strong></summary>

### Complete Vanilla HTML Example

This is a complete, self-contained HTML file that you can save and open directly in your browser. It uses [esm.sh](https://esm.sh) to import Formula without any build tools.

<<< @/docs/examples/basic-form.html

</details>

### How it Works

Simply import Formula from a CDN like `https://esm.sh/@webhelpers/formula@latest`, and it gets to work. There are no build tools or complex setup steps required for modern browsers.

Once initialized, Formula gives you a reactive state object that's always in sync with your form. As you can see in the live demo, the form's values, errors, and "dirty" and "touched" states are all updated in real-time as you interact with the fields. This makes it incredibly easy to build dynamic, responsive user interfaces.

### Live Demo

<script setup>
import BasicFormDemo from '../.vitepress/components/BasicFormDemo.vue'
</script>

<BasicFormDemo />

## Key Features

- **Zero-Configuration for Basic Forms**: Formula works with your existing HTML.
- **Reactive State**: Form values, errors, dirty state, and touched state are all reactive Svelte stores.
- **Uses Native HTML5 Validation**: Automatically uses native HTML5 validation attributes.
- **Real-time Updates**: The form state updates as you type and interact with the form.

## Next Steps

Try editing the form fields to see the state update in real-time! This is just the beginning of what Formula can do. Next, we'll explore how to add custom validation logic for more complex scenarios.
