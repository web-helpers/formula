# Formula Examples

This page demonstrates various features of the `@webhelpers/formula` library.

## Basic Form Example

### JavaScript

```js
import { formula } from '@webhelpers/formula'

// Get the form element
const form = document.getElementById('basic-form')

// Create formula instance with default values
const formulaForm = formula({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  }
})

// Initialize the form
const instance = formulaForm.init(form)

// Subscribe to form values
formulaForm.formValues.subscribe((values) => {
  console.log('Form values:', values)
})

// Subscribe to form errors
formulaForm.errors.subscribe((errors) => {
  console.log('Form errors:', errors)
})

// Subscribe to dirty state
formulaForm.dirty.subscribe((dirty) => {
  const isDirty = Object.values(dirty).some(v => v)
  console.log('Form is dirty:', isDirty)
})

// Subscribe to touched state
formulaForm.touched.subscribe((touched) => {
  const isTouched = Object.values(touched).some(v => v)
  console.log('Form is touched:', isTouched)
})
```

### HTML

```html
<form id="basic-form">
  <div>
    <label for="firstName">First Name</label>
    <input 
      type="text" 
      id="firstName" 
      name="firstName" 
      required 
      minlength="2"
    />
  </div>
  
  <div>
    <label for="lastName">Last Name</label>
    <input 
      type="text" 
      id="lastName" 
      name="lastName" 
      required 
      minlength="2"
    />
  </div>
  
  <div>
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
    />
  </div>
  
  <button type="submit">Submit Form</button>
</form>
```

### Live Demo

<script setup>
import { onMounted, ref } from 'vue'
import { formula } from '@webhelpers/formula'

const formValues = ref({})
const formErrors = ref({})
const isDirty = ref(false)
const isTouched = ref(false)

onMounted(() => {
  const form = document.getElementById('basic-form')
  if (form) {
    const formulaForm = formula({
      defaultValues: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }
    })
    
    const instance = formulaForm.init(form)
    
    // Subscribe to form values
    formulaForm.formValues.subscribe((values) => {
      formValues.value = values
    })
    
    // Subscribe to form errors
    formulaForm.errors.subscribe((errors) => {
      formErrors.value = errors
    })
    
    // Subscribe to dirty state
    formulaForm.dirty.subscribe((dirty) => {
      isDirty.value = Object.values(dirty).some(v => v)
    })
    
    // Subscribe to touched state
    formulaForm.touched.subscribe((touched) => {
      isTouched.value = Object.values(touched).some(v => v)
    })
  }
})
</script>

<style scoped>
.demo-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

@media (max-width: 768px) {
  .demo-container {
    grid-template-columns: 1fr;
  }
}

.form-container {
  background-color: #1e293b;
  padding: 1.5rem;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #e2e8f0;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #475569;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: #0f172a;
  color: #e2e8f0;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-group input:invalid {
  border-color: #ef4444;
}

.submit-btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
}

.submit-btn:hover {
  background-color: #2563eb;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.form-state {
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.form-state h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.form-state h4 {
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.state-indicator {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.state-true {
  background-color: #dcfce7;
  color: #166534;
}

.state-false {
  background-color: #fee2e2;
  color: #991b1b;
}

.error-message {
  color: #fca5a5;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

pre {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.75rem;
  margin: 0.5rem 0;
}
</style>

<div class="demo-container">
  <div class="form-container">
  <form id="basic-form">
    <div class="form-group">
      <label for="firstName">First Name</label>
      <input 
        type="text" 
        id="firstName" 
        name="firstName" 
        required 
        minlength="2"
      />
      <span v-if="formErrors.firstName?.message" class="error-message">{{ formErrors.firstName.message }}</span>
    </div>
    <div class="form-group">
      <label for="lastName">Last Name</label>
      <input 
        type="text" 
        id="lastName" 
        name="lastName" 
        required 
        minlength="2"
      />
      <span v-if="formErrors.lastName?.message" class="error-message">{{ formErrors.lastName.message }}</span>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        name="email" 
        required 
      />
      <span v-if="formErrors.email?.message" class="error-message">{{ formErrors.email.message }}</span>
    </div>
    <button type="submit" class="submit-btn">
      Submit Form
    </button>
  </form>
</div>
  <div class="form-state">
    <h3>Form State</h3>
    <p>
      <strong>Dirty:</strong>
      <span :class="['state-indicator', isDirty ? 'state-true' : 'state-false']">
        {{ isDirty ? 'Yes' : 'No' }}
      </span>
      <strong style="margin-left: 1rem;">Touched:</strong>
      <span :class="['state-indicator', isTouched ? 'state-true' : 'state-false']">
        {{ isTouched ? 'Yes' : 'No' }}
      </span>
    </p>
    <h4>Values:</h4>
    <pre style="font-size: 0.75rem; padding: 0.5rem;">{{ JSON.stringify(formValues, null, 2) }}</pre>
    <h4>Errors:</h4>
    <div v-for="(error, field) in formErrors" :key="field" style="margin-bottom: 0.5rem;">
      <div v-if="error.message" style="font-size: 0.875rem;">
        <strong>{{ field }}:</strong> <span style="color: #dc2626;">{{ error.message }}</span>
      </div>
    </div>
    <pre style="font-size: 0.75rem; padding: 0.5rem;">{{ JSON.stringify(formErrors, null, 2) }}</pre>
  </div>
</div>

## Features Demonstrated

- **Default Values**: The form is initialized with default values
- **Reactive State**: Form values, errors, dirty state, and touched state are all reactive
- **Built-in Validation**: Uses native HTML5 validation attributes
- **Real-time Updates**: State updates as you type and interact with the form

## Next Steps

Try editing the form fields to see the state update in real-time!
