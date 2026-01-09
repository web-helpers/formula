<template>
  <div class="demo-container">
    <div class="form-container">
      <form ref="formRef" @submit.prevent="handleSubmit">
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
          <span v-if="formErrors.firstName?.message" class="error-message">
            {{ formErrors.firstName.message }}
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
          <span v-if="formErrors.lastName?.message" class="error-message">
            {{ formErrors.lastName.message }}
          </span>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="formData.email" type="email" id="email" name="email" required autocomplete="off" data-1p-ignore data-lpignore="true" data-protonpass-ignore="true" />
          <span v-if="formErrors.email?.message" class="error-message">
            {{ formErrors.email.message }}
          </span>
        </div>
        <button type="submit" class="submit-btn" :disabled="hasErrors">Submit Form</button>
      </form>
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
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { formula } from '@webhelpers/formula';

const formRef = ref(null);
const formData = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
});

const formValues = ref({});
const formErrors = ref({});
const isDirty = ref(false);
const isTouched = ref(false);

let formulaInstance = null;
let unsubscribers = [];

const hasErrors = computed(() => {
  return Object.keys(formErrors.value).some((key) => formErrors.value[key]?.message);
});

const handleSubmit = () => {
  alert(`Form submitted!\n\n${JSON.stringify(formValues.value, null, 2)}`);
};

// Watch formData and sync with Formula
watch(
  formData,
  (newData) => {
    if (formRef.value) {
      // Dispatch input events to notify Formula of changes
      Object.keys(newData).forEach((key) => {
        const input = formRef.value.querySelector(`[name="${key}"]`);
        if (input) {
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }
  },
  { deep: true },
);

onMounted(() => {
  if (formRef.value) {
    formulaInstance = formula({
      defaultValues: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    });

    const destroy = formulaInstance.init(formRef.value);

    // Subscribe to form values
    const unsubValues = formulaInstance.formValues.subscribe((values) => {
      formValues.value = values;
    });
    unsubscribers.push(unsubValues);

    // Subscribe to form errors
    const unsubErrors = formulaInstance.errors.subscribe((errors) => {
      formErrors.value = errors;
    });
    unsubscribers.push(unsubErrors);

    // Subscribe to dirty state
    const unsubDirty = formulaInstance.dirty.subscribe((dirty) => {
      isDirty.value = Object.values(dirty).some((v) => v);
    });
    unsubscribers.push(unsubDirty);

    // Subscribe to touched state
    const unsubTouched = formulaInstance.touched.subscribe((touched) => {
      isTouched.value = Object.values(touched).some((v) => v);
    });
    unsubscribers.push(unsubTouched);

    unsubscribers.push(destroy);
  }
});

onUnmounted(() => {
  // Clean up all subscriptions and destroy Formula instance
  unsubscribers.forEach((unsub) => {
    if (typeof unsub === 'function') {
      unsub();
    }
  });
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

.form-group input:invalid {
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
