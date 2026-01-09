# Web Component Guide

The `<formula-form>` web component is the easiest way to add reactive form handling to your HTML. It works with any framework or no framework at all, providing instant validation, state management, and event handling.

## Complete Example

This example demonstrates a fully-featured Formula web component with real-time state updates, error handling, and form submission.

<details>
<summary><strong>📄 Click to view complete HTML example</strong></summary>

### Complete Vanilla HTML Example

This is a complete, self-contained HTML file that you can save and open directly in your browser. It uses [esm.sh](https://esm.sh) to import Formula without any build tools.

<<< @/docs/examples/web-component.html

</details>

### Live Demo

<script setup>
import WebComponentDemo from '../.vitepress/components/WebComponentDemo.vue'
</script>

<WebComponentDemo />

## Quick Start

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';
</script>

<formula-form handle-submit>
  <form>
    <input name="email" type="email" required />
    <button type="submit">Submit</button>
  </form>
</formula-form>
```

## API Events

The web component emits the following custom events:

| Event          | Payload Type                    | Description                                                    |
| -------------- | ------------------------------- | -------------------------------------------------------------- |
| `form:values`  | `Record<string, any>`           | Fires when any field value changes                             |
| `form:errors`  | `Record<string, FieldValidity>` | Fires when validation state changes                            |
| `form:touched` | `Record<string, boolean>`       | Fires when a field is touched (focused then blurred)           |
| `form:dirty`   | `Record<string, boolean>`       | Fires when a field value differs from its initial value        |
| `form:valid`   | `boolean`                       | Fires when overall form validity changes                       |
| `form:ready`   | `boolean`                       | Fires when form is valid AND dirty                             |
| `form:submit`  | `Record<string, any>`           | Fires on form submission (only with `handle-submit` attribute) |
| `form:connect` | `FormulaForm`                   | Fires when the formula instance is initialized                 |

### FieldValidity Structure

The `form:errors` event payload contains `FieldValidity` objects:

```typescript
interface FieldValidity {
  valid: boolean; // True if field is valid
  invalid: boolean; // True if field is invalid
  message: string; // The validation error message
  errors: Record<string, string>; // Map of specific validation errors
}
```

## Attributes

Configure the `<formula-form>` component with these attributes:

- `handle-submit` - When present, prevents default form submission and emits `form:submit` event
- `root-selector` - CSS selector to find the form element if not a direct child
- `formula-options` - JSON string of options to pass to the formula instance

## See Also

- [Complete Interactive Example](./examples/web-component.html)
- [API Reference](./api/web-component.md)
- [Store Documentation](./api/stores.md)
