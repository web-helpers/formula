# Dynamic Fields

Many web applications require forms that can change dynamically. Whether you're building a shopping cart, an invoice generator, or a survey, you often need to add or remove fields on the fly. Formula is designed to handle these scenarios effortlessly, automatically tracking new fields without any extra configuration.

## Dynamic Shopping Cart

This example demonstrates how to build a dynamic shopping cart where users can add and remove items. As you'll see, Formula not only manages the form's state but also makes it easy to perform real-time calculations for things like item totals, subtotals, and taxes.

<script setup>
import DynamicFieldsDemo from '../.vitepress/components/DynamicFieldsDemo.vue'
</script>

<DynamicFieldsDemo />

<details>
<summary><strong>📄 Click to view complete HTML example</strong></summary>

### Complete Vanilla HTML Example

<<< @/docs/examples/dynamic-fields.html

</details>

## Handling Dynamic Content

Formula's ability to automatically detect and manage new form fields makes it incredibly powerful for dynamic forms. Here’s how it simplifies the process.

### Adding and Removing Fields

In the shopping cart example, new item fields are added to the form when you click "Add Item." Formula automatically picks up these new fields and includes them in the form's state. When an item is removed, Formula updates the state accordingly. There's no need to manually register or unregister fields.

### Real-time Calculations

Because Formula provides a reactive state object, you can easily subscribe to changes and perform calculations in real-time. In the demo, the subtotal, tax, and grand total are all recalculated whenever an item's quantity or price changes. This is achieved by listening to the `formValues` store and updating the UI accordingly.

### Naming Dynamic Fields

A common convention for naming dynamic fields is to use an index, like `item-0-name`, `item-1-name`, and so on. This makes it easy to process the data later. Formula handles these indexed fields without any issues, giving you a flat structure of values that is simple to work with.

## How It's Done

### Dynamic Field Names

To manage dynamic fields, you can use indexed names. This makes it easy to identify and process groups of related fields.

```javascript
// Use indexed names for dynamic fields
name = 'item-0-name';
name = 'item-0-quantity';
name = 'item-0-price';

// Access them in form values
values['item-0-name'];
values['item-0-quantity'];
```

### Calculated Fields

For values that are calculated from other fields, you can use hidden inputs to store them. This ensures that they are included in the form's state.

```javascript
// Use hidden inputs to store calculated values
<input type="hidden" name="item-0-total" value="0" />;

// Update them programmatically
totalInput.value = (quantity * price).toFixed(2);
totalInput.dispatchEvent(new Event('input', { bubbles: true }));
```

### Reactive Calculations

By subscribing to the `formValues` store, you can react to any changes in the form and perform calculations.

```javascript
// Subscribe to values and calculate totals
formulaForm.formValues.subscribe((values) => {
  let subtotal = 0;
  Object.keys(values).forEach((key) => {
    if (key.endsWith('-total')) {
      subtotal += parseFloat(values[key]) || 0;
    }
  });
  // Update UI with calculated values
});
```

## When to Use Dynamic Fields

This pattern is perfect for:

- Shopping carts and order forms.
- Invoice generators and survey builders.
- Any form where users need to add or remove repeated sections, like adding multiple attendees to an event registration.

## Next Steps

Try this example to see how Formula handles complex dynamic forms with ease. No special configuration needed - Formula automatically tracks all fields, even those added dynamically!
