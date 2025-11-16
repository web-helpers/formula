# Basic Form Example

This example demonstrates how to set up a basic form using Formula with default values, validation, and reactive state management.

## Basic Form Example

The following is a basic HTML form you can create inside a static `.html` file or within a web component. The form includes fields for first name, last name, and email, along with built-in HTML5 validation attributes like `required` and `minlength` - Formula will automatically pick these validation rules up and provide appropriate error messages.

### Complete Vanilla HTML Example

This is a complete, self-contained HTML file that you can save and open directly in your browser. It uses [esm.sh](https://esm.sh) to import Formula without any build tools.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formula Basic Form Example</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1200px;
      width: 100%;
    }

    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 2rem;
    }

    h1 {
      color: #1e293b;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #475569;
      font-weight: 600;
      font-size: 0.875rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input:invalid:not(:placeholder-shown) {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
      min-height: 1rem;
    }

    button {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    button:active {
      transform: translateY(0);
    }

    .state-section {
      margin-bottom: 1.5rem;
    }

    .state-section h2 {
      color: #1e293b;
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }

    .state-badges {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .badge {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge-success {
      background: #dcfce7;
      color: #166534;
    }

    .badge-error {
      background: #fee2e2;
      color: #991b1b;
    }

    .code-block {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.75rem;
      font-family: 'Monaco', 'Courier New', monospace;
      margin-top: 0.5rem;
    }

    .code-block pre {
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>📝 Basic Form</h1>
      <form id="basic-form">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            required 
            minlength="2"
            placeholder="Enter your first name"
          />
          <span class="error-message" id="firstName-error"></span>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            required 
            minlength="2"
            placeholder="Enter your last name"
          />
          <span class="error-message" id="lastName-error"></span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required
            placeholder="Enter your email"
          />
          <span class="error-message" id="email-error"></span>
        </div>

        <button type="submit">Submit Form</button>
      </form>
    </div>

    <div class="card">
      <div class="state-section">
        <h2>📊 Form State</h2>
        <div class="state-badges">
          <div id="dirty-badge" class="badge badge-error">
            <span>💾</span> Clean
          </div>
          <div id="touched-badge" class="badge badge-error">
            <span>👆</span> Untouched
          </div>
        </div>
      </div>

      <div class="state-section">
        <h2>📝 Values</h2>
        <div class="code-block">
          <pre id="values-display">{}</pre>
        </div>
      </div>

      <div class="state-section">
        <h2>⚠️ Errors</h2>
        <div class="code-block">
          <pre id="errors-display">{}</pre>
        </div>
      </div>
    </div>
  </div>

  <script type="module">
    // Import Formula from esm.sh CDN
    import { formula } from 'https://esm.sh/@webhelpers/formula@latest';

    // Get the form element
    const form = document.getElementById('basic-form');

    // Create formula instance with default values
    const formulaForm = formula({
      defaultValues: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    });

    // Initialize the form
    const instance = formulaForm.init(form);

    // Get display elements
    const valuesDisplay = document.getElementById('values-display');
    const errorsDisplay = document.getElementById('errors-display');
    const dirtyBadge = document.getElementById('dirty-badge');
    const touchedBadge = document.getElementById('touched-badge');

    // Subscribe to form values
    formulaForm.formValues.subscribe((values) => {
      valuesDisplay.textContent = JSON.stringify(values, null, 2);
      console.log('Form values:', values);
    });

    // Subscribe to form errors and update error messages
    formulaForm.errors.subscribe((errors) => {
      errorsDisplay.textContent = JSON.stringify(errors, null, 2);
      
      // Update inline error messages
      ['firstName', 'lastName', 'email'].forEach(field => {
        const errorEl = document.getElementById(`${field}-error`);
        if (errors[field]?.message) {
          errorEl.textContent = errors[field].message;
        } else {
          errorEl.textContent = '';
        }
      });
      
      console.log('Form errors:', errors);
    });

    // Subscribe to dirty state
    formulaForm.dirty.subscribe((dirty) => {
      const isDirty = Object.values(dirty).some((v) => v);
      dirtyBadge.className = `badge ${isDirty ? 'badge-success' : 'badge-error'}`;
      dirtyBadge.innerHTML = `<span>💾</span> ${isDirty ? 'Dirty' : 'Clean'}`;
      console.log('Form is dirty:', isDirty);
    });

    // Subscribe to touched state
    formulaForm.touched.subscribe((touched) => {
      const isTouched = Object.values(touched).some((v) => v);
      touchedBadge.className = `badge ${isTouched ? 'badge-success' : 'badge-error'}`;
      touchedBadge.innerHTML = `<span>👆</span> ${isTouched ? 'Touched' : 'Untouched'}`;
      console.log('Form is touched:', isTouched);
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const values = formulaForm.formValues.get();
      alert(`Form submitted!\n\n${JSON.stringify(values, null, 2)}`);
      console.log('Form submitted with values:', values);
    });
  </script>
</body>
</html>
```

### How to Use

1. Copy the complete HTML code above
2. Save it as `formula-example.html`
3. Open the file in your web browser
4. Start interacting with the form to see real-time state updates

### What's Happening

- **ESM Import**: Formula is imported directly from `https://esm.sh/@webhelpers/formula@latest`
- **No Build Tools**: This works in modern browsers without any bundlers or transpilers
- **Default Values**: The form initializes with pre-filled values
- **Live Updates**: All state updates are reflected in real-time on the right panel
- **Validation**: HTML5 validation rules are automatically detected and enforced
- **Error Messages**: Validation errors appear both inline and in the state panel

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
