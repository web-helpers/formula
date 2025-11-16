# Vanilla JavaScript Example

This example demonstrates using Formula with plain JavaScript, without any framework.

## Basic Form

<div id="vanilla-demo">
  <form id="vanilla-form" style="background-color: #f5f5f5; padding: 2rem; border-radius: 8px; max-width: 600px; margin: 2rem 0;">
    <div style="margin-bottom: 1.5rem;">
      <label for="firstName" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">First Name</label>
      <input 
        type="text" 
        id="firstName" 
        name="firstName" 
        required 
        minlength="2"
        style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem;"
      />
    </div>
    
    <div style="margin-bottom: 1.5rem;">
      <label for="lastName" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Last Name</label>
      <input 
        type="text" 
        id="lastName" 
        name="lastName" 
        required 
        minlength="2"
        style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem;"
      />
    </div>
    
    <div style="margin-bottom: 1.5rem;">
      <label for="email" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email</label>
      <input 
        type="email" 
        id="email" 
        name="email" 
        required 
        style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem;"
      />
    </div>
    
    <button type="submit" style="padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; font-weight: 600;">
      Submit Form
    </button>
  </form>

  <div id="form-state" style="margin-top: 2rem; padding: 1rem; background-color: #fff; border-radius: 4px; border: 1px solid #e5e7eb;">
    <h3 style="margin-top: 0;">Form State</h3>
    
    <p>
      <strong>Dirty:</strong>
      <span id="dirty-state" style="display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600; margin-left: 0.5rem; background-color: #fee2e2; color: #991b1b;">No</span>
    </p>
    
    <p>
      <strong>Touched:</strong>
      <span id="touched-state" style="display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600; margin-left: 0.5rem; background-color: #fee2e2; color: #991b1b;">No</span>
    </p>
    
    <p>
      <strong>Valid:</strong>
      <span id="valid-state" style="display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600; margin-left: 0.5rem; background-color: #fee2e2; color: #991b1b;">No</span>
    </p>
    
    <h4>Current Values:</h4>
    <pre id="form-values" style="background-color: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 4px; overflow-x: auto;">{}</pre>
    
    <h4>Validation Errors:</h4>
    <pre id="form-errors" style="background-color: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 4px; overflow-x: auto;">{}</pre>
  </div>
</div>

<script type="module">
import { formula } from '@webhelpers/formula'

// Get form element
const formElement = document.getElementById('vanilla-form')

// Create formula instance with default values
const formulaInstance = formula({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  }
})

// Initialize the form
const form = formulaInstance.init(formElement)

// Get display elements
const formValuesEl = document.getElementById('form-values')
const formErrorsEl = document.getElementById('form-errors')
const dirtyStateEl = document.getElementById('dirty-state')
const touchedStateEl = document.getElementById('touched-state')
const validStateEl = document.getElementById('valid-state')

// Subscribe to form values
formulaInstance.formValues.subscribe((values) => {
  formValuesEl.textContent = JSON.stringify(values, null, 2)
})

// Subscribe to form errors
formulaInstance.errors.subscribe((errors) => {
  formErrorsEl.textContent = JSON.stringify(errors, null, 2)
})

// Subscribe to valid state
formulaInstance.formValid.subscribe((valid) => {
  validStateEl.textContent = valid ? 'Yes' : 'No'
  validStateEl.style.backgroundColor = valid ? '#dcfce7' : '#fee2e2'
  validStateEl.style.color = valid ? '#166534' : '#991b1b'
})

// Subscribe to dirty state
formulaInstance.dirty.subscribe((dirty) => {
  const isDirty = Object.values(dirty).some(v => v)
  dirtyStateEl.textContent = isDirty ? 'Yes' : 'No'
  dirtyStateEl.style.backgroundColor = isDirty ? '#dcfce7' : '#fee2e2'
  dirtyStateEl.style.color = isDirty ? '#166534' : '#991b1b'
})

// Subscribe to touched state
formulaInstance.touched.subscribe((touched) => {
  const isTouched = Object.values(touched).some(v => v)
  touchedStateEl.textContent = isTouched ? 'Yes' : 'No'
  touchedStateEl.style.backgroundColor = isTouched ? '#dcfce7' : '#fee2e2'
  touchedStateEl.style.color = isTouched ? '#166534' : '#991b1b'
})

// Handle form submission
formElement.addEventListener('submit', (e) => {
  e.preventDefault()
  const values = formulaInstance.formValues.get()
  alert('Form submitted with values:\\n' + JSON.stringify(values, null, 2))
})
</script>

## How It Works

1. **Import Formula**: Import the `formula` function from `@webhelpers/formula`
2. **Create Instance**: Call `formula()` with optional configuration (like default values)
3. **Initialize**: Call `.init(formElement)` to attach Formula to your form
4. **Subscribe to Stores**: Use `.subscribe()` on any store to react to changes:
   - `formValues` - Current form values
   - `errors` - Validation errors for each field
   - `formValid` - Whether the entire form is valid
   - `dirty` - Which fields have been modified
   - `touched` - Which fields have been focused
   - `enrichment` - Custom enriched data

## API Overview

```javascript
// Create a formula instance
const formulaInstance = formula({
  defaultValues: { /* ... */ },
  validators: { /* custom validators */ },
  enrich: { /* field enrichment functions */ },
  formValidators: { /* form-level validators */ }
})

// Initialize on a form element
const form = formulaInstance.init(formElement)

// Access stores
formulaInstance.formValues.get()        // Get current values
formulaInstance.formValues.subscribe()  // Subscribe to changes

// Utility methods
formulaInstance.resetForm()   // Reset to initial state
formulaInstance.updateForm()  // Update configuration
formulaInstance.destroyForm() // Clean up

// Form instance methods
form.destroy()  // Destroy this specific form instance
```

## Features

- ✅ **Zero Configuration** - Works with standard HTML forms
- ✅ **Reactive Stores** - Built on Nanostores for efficient reactivity
- ✅ **Native Validation** - Uses HTML5 validation attributes
- ✅ **Custom Validators** - Add your own validation logic
- ✅ **Field Enrichment** - Transform or enhance field values
- ✅ **Form Groups** - Manage multiple forms together
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Framework Agnostic** - Works with vanilla JS or any framework
