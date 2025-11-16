<template>
  <div class="demo-container">
    <div class="form-container">
      <formula-form ref="formulaFormRef" handle-submit>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              v-model="formData.firstName"
              type="text"
              id="firstName"
              name="firstName"
              required
              minlength="2"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-protonpass-ignore="true"
            />
            <span v-if="shouldShowError('firstName')" class="error-message">
              {{ getErrorMessage('firstName') }}
            </span>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              v-model="formData.lastName"
              type="text"
              id="lastName"
              name="lastName"
              required
              minlength="2"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-protonpass-ignore="true"
            />
            <span v-if="shouldShowError('lastName')" class="error-message">
              {{ getErrorMessage('lastName') }}
            </span>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="formData.email" type="email" id="email" name="email" required autocomplete="off" data-1p-ignore data-lpignore="true" data-protonpass-ignore="true" />
            <span v-if="shouldShowError('email')" class="error-message">
              {{ getErrorMessage('email') }}
            </span>
          </div>
          <button type="submit" class="submit-btn" :disabled="!isFormValid">Submit Form</button>
        </form>
      </formula-form>
    </div>
    <div class="form-state">
      <h3>Form State</h3>
      <p>
        <strong>Dirty:</strong>
        <span :class="['state-indicator', isDirty ? 'state-true' : 'state-false']">
          {{ isDirty ? 'Yes' : 'No' }}
        </span>
        <strong style="margin-left: 1rem">Touched:</strong>
        <span :class="['state-indicator', isTouched ? 'state-true' : 'state-false']">
          {{ isTouched ? 'Yes' : 'No' }}
        </span>
      </p>
      <h4>Values:</h4>
      <pre>{{ JSON.stringify(formValues, null, 2) }}</pre>
      <h4>Errors:</h4>
      <div v-for="(error, field) in formErrors" :key="field" style="margin-bottom: 0.5rem">
        <div v-if="error.message" style="font-size: 0.875rem">
          <strong>{{ field }}:</strong> <span style="color: #dc2626">{{ error.message }}</span>
        </div>
      </div>
      <pre>{{ JSON.stringify(formErrors, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

// Import the web component

import '@webhelpers/formula/webcomponent';

const formulaFormRef = ref(null);
const formData = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
});

const formValues = ref({});
const formErrors = ref({});
const formTouched = ref({});
const isDirty = ref(false);
const isTouched = ref(false);
const isFormValid = ref(false);

const shouldShowError = (fieldName) => {
  return formErrors.value[fieldName]?.message && formTouched.value[fieldName];
};

const getErrorMessage = (fieldName) => {
  return formErrors.value[fieldName]?.message || '';
};

const handleSubmit = () => {
  alert(`Form submitted!\n\n${JSON.stringify(formValues.value, null, 2)}`);
};

// Watch formData and sync with Formula
watch(
  formData,
  (newData) => {
    if (formulaFormRef.value) {
      const form = formulaFormRef.value.querySelector('form');
      if (form) {
        // Dispatch input events to notify Formula of changes
        Object.keys(newData).forEach((key) => {
          const input = form.querySelector(`[name="${key}"]`);
          if (input) {
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      }
    }
  },
  { deep: true },
);

onMounted(() => {
  if (formulaFormRef.value) {
    // Listen to form:values event
    formulaFormRef.value.addEventListener('form:values', (e) => {
      formValues.value = e.detail;
    });

    // Listen to form:errors event
    formulaFormRef.value.addEventListener('form:errors', (e) => {
      formErrors.value = e.detail;
    });

    // Listen to form:touched event
    formulaFormRef.value.addEventListener('form:touched', (e) => {
      formTouched.value = e.detail;
      isTouched.value = Object.values(e.detail).some((v) => v);
    });

    // Listen to form:dirty event
    formulaFormRef.value.addEventListener('form:dirty', (e) => {
      isDirty.value = Object.values(e.detail).some((v) => v);
    });

    // Listen to form:valid event
    formulaFormRef.value.addEventListener('form:valid', (e) => {
      isFormValid.value = e.detail;
    });

    // Listen to form:submit event
    formulaFormRef.value.addEventListener('form:submit', (e) => {
      console.log('Form submitted via web component:', e.detail);
    });
  }
});

onUnmounted(() => {
  // Cleanup is handled by the web component
});
</script>

<style scoped>
.demo-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
  overflow: hidden;
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

.form-group input[data-formula-invalid='true'] {
  border-color: #ef4444;
}

.submit-btn {
  width: 100%;
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
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.form-state h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #1e293b;
}

.form-state h4 {
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
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
