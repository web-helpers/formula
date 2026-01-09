<template>
  <div class="demo-container">
    <div class="demo-grid">
      <div class="demo-card">
        <h3>🔐 User Registration</h3>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">
              <div class="label-with-hint">
                <span>Username</span>
                <span class="hint">3-20 characters</span>
              </div>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              minlength="3"
              maxlength="20"
              pattern="[a-zA-Z0-9_]+"
              required
              placeholder="Choose a username"
              data-message="Username must be 3-20 characters (letters, numbers, underscore only)"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-protonpass-ignore="true"
            />
            <span v-if="checkingUsername" class="checking">Checking availability...</span>
            <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
            <span v-if="usernameSuccess" class="success-message">{{ usernameSuccess }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              data-message="Please enter a valid email address"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-protonpass-ignore="true"
            />
            <span class="error-message" id="email-error"></span>
          </div>

          <div class="form-group">
            <label for="password">
              <div class="label-with-hint">
                <span>Password</span>
                <span class="hint">At least 8 characters</span>
              </div>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              minlength="8"
              required
              placeholder="Enter password"
              @input="handlePasswordInput"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-protonpass-ignore="true"
            />
            <div v-if="passwordStrength.visible" class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :class="passwordStrength.className"></div>
              </div>
              <div class="strength-text" :class="passwordStrength.textClassName">
                {{ passwordStrength.text }}
              </div>
            </div>
            <span class="error-message" id="password-error"></span>
          </div>

          <div class="validation-rules">
            <h4>Password Requirements:</h4>
            <ul>
              <li :class="passwordRules.length">At least 8 characters</li>
              <li :class="passwordRules.lowercase">One lowercase letter</li>
              <li :class="passwordRules.uppercase">One uppercase letter</li>
              <li :class="passwordRules.number">One number</li>
              <li :class="passwordRules.special">One special character (!@#$%^&*)</li>
            </ul>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Re-enter password"
              @input="handleConfirmPasswordInput"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-protonpass-ignore="true"
            />
            <span class="error-message" id="confirmPassword-error">{{ confirmPasswordError }}</span>
          </div>

          <div class="form-group">
            <label for="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              min="13"
              max="120"
              required
              placeholder="Your age"
              data-message="You must be at least 13 years old to register"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-protonpass-ignore="true"
            />
            <span class="error-message" id="age-error"></span>
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <select id="country" name="country" required>
              <option value="">Select your country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
              <option value="other">Other</option>
            </select>
            <span class="error-message" id="country-error"></span>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="terms" name="terms" required data-message="You must accept the terms of service" />
              <label for="terms"> I agree to the Terms of Service and Privacy Policy </label>
            </div>
            <span class="error-message" id="terms-error"></span>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="newsletter" name="newsletter" />
              <label for="newsletter"> Subscribe to newsletter for updates </label>
            </div>
          </div>

          <button type="submit" :disabled="hasErrors">Create Account</button>
        </form>
      </div>

      <div class="demo-card">
        <h3>📊 Form State</h3>
        <div class="badges">
          <span class="badge" :class="hasErrors ? 'badge-error' : 'badge-success'">
            {{ hasErrors ? 'Invalid' : 'Valid' }}
          </span>
          <span class="badge" :class="isDirty ? 'badge-success' : 'badge-error'">
            {{ isDirty ? 'Dirty' : 'Clean' }}
          </span>
          <span class="badge" :class="isTouched ? 'badge-success' : 'badge-error'">
            {{ isTouched ? 'Touched' : 'Untouched' }}
          </span>
        </div>

        <h3>📝 Form Values</h3>
        <div class="code-block">
          <pre>{{ JSON.stringify(formValues, null, 2) }}</pre>
        </div>

        <h3>⚠️ Validation Errors</h3>
        <div class="code-block">
          <pre>{{ JSON.stringify(formErrors, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { formula } from '@webhelpers/formula';

const formValues = ref({});
const formErrors = ref({});
const isDirty = ref(false);
const isTouched = ref(false);

const checkingUsername = ref(false);
const usernameError = ref('');
const usernameSuccess = ref('');
const confirmPasswordError = ref('');

const passwordStrength = ref({
  visible: false,
  className: '',
  textClassName: '',
  text: '',
});

const passwordRules = ref({
  length: '',
  lowercase: '',
  uppercase: '',
  number: '',
  special: '',
});

let formulaForm = null;
let unsubscribers = [];
let usernameCheckTimeout = null;
let formulaInstance = null;

// Simulated database of taken usernames
const takenUsernames = ['admin', 'user', 'test', 'john', 'jane'];

const hasErrors = computed(() => {
  return Object.keys(formErrors.value).some((key) => formErrors.value[key]?.message);
});

function checkPasswordStrength(password) {
  let strength = 0;
  const rules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  // Update rule indicators
  Object.keys(rules).forEach((rule) => {
    if (rules[rule]) {
      passwordRules.value[rule] = 'valid';
      strength++;
    } else {
      passwordRules.value[rule] = password.length > 0 ? 'invalid' : '';
    }
  });

  return { strength, rules };
}

function updatePasswordStrength(password) {
  if (!password) {
    passwordStrength.value.visible = false;
    return;
  }

  passwordStrength.value.visible = true;
  const { strength } = checkPasswordStrength(password);

  if (strength <= 2) {
    passwordStrength.value.className = 'strength-weak';
    passwordStrength.value.textClassName = 'strength-weak-text';
    passwordStrength.value.text = 'Weak password';
  } else if (strength <= 3) {
    passwordStrength.value.className = 'strength-medium';
    passwordStrength.value.textClassName = 'strength-medium-text';
    passwordStrength.value.text = 'Medium password';
  } else {
    passwordStrength.value.className = 'strength-strong';
    passwordStrength.value.textClassName = 'strength-strong-text';
    passwordStrength.value.text = 'Strong password';
  }
}

async function checkUsernameAvailability(username) {
  if (!username || username.length < 3) {
    checkingUsername.value = false;
    usernameSuccess.value = '';
    return;
  }

  checkingUsername.value = true;
  usernameError.value = '';
  usernameSuccess.value = '';

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  checkingUsername.value = false;

  if (takenUsernames.includes(username.toLowerCase())) {
    usernameError.value = 'Username is already taken';
  } else {
    usernameSuccess.value = '✓ Username is available';
  }
}

function validatePasswordMatch() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (confirmPassword && password !== confirmPassword) {
    confirmPasswordError.value = 'Passwords do not match';
    return false;
  } else if (confirmPassword) {
    confirmPasswordError.value = '';
    return true;
  }
  return true;
}

function handlePasswordInput(e) {
  updatePasswordStrength(e.target.value);
  validatePasswordMatch();
}

function handleConfirmPasswordInput() {
  validatePasswordMatch();
}

function handleSubmit() {
  // Final validation
  const password = document.getElementById('password').value;
  const { strength } = checkPasswordStrength(password);

  if (strength < 3) {
    alert('Please use a stronger password (at least Medium strength)');
    return;
  }

  if (!validatePasswordMatch()) {
    alert('Passwords do not match');
    return;
  }

  const username = document.getElementById('username').value;
  if (takenUsernames.includes(username.toLowerCase())) {
    alert('Username is not available');
    return;
  }

  const values = formulaForm.formValues.get();
  alert(`Registration Successful!\n\nWelcome, ${values.username}!`);
  console.log('Registration submitted:', values);
}

onMounted(() => {
  const form = document.querySelector('.demo-container form');

  formulaForm = formula({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      country: '',
      terms: false,
      newsletter: false,
    },
  });

  formulaInstance = formulaForm.init(form);

  // Subscribe to form values
  unsubscribers.push(
    formulaForm.formValues.subscribe((values) => {
      formValues.value = values;
    }),
  );

  // Subscribe to form errors
  unsubscribers.push(
    formulaForm.errors.subscribe((errors) => {
      formErrors.value = errors;

      // Update inline error messages for standard fields
      ['email', 'password', 'age', 'country', 'terms'].forEach((field) => {
        const errorEl = document.getElementById(`${field}-error`);
        if (errorEl) {
          if (errors[field]?.message) {
            errorEl.textContent = errors[field].message;
          } else {
            errorEl.textContent = '';
          }
        }
      });
    }),
  );

  // Subscribe to dirty state
  unsubscribers.push(
    formulaForm.dirty.subscribe((dirty) => {
      isDirty.value = Object.values(dirty).some((v) => v);
    }),
  );

  // Subscribe to touched state
  unsubscribers.push(
    formulaForm.touched.subscribe((touched) => {
      isTouched.value = Object.values(touched).some((v) => v);
    }),
  );

  // Username input handler with debounce
  const usernameInput = document.getElementById('username');
  usernameInput.addEventListener('input', (e) => {
    clearTimeout(usernameCheckTimeout);
    usernameCheckTimeout = setTimeout(() => {
      checkUsernameAvailability(e.target.value);
    }, 500);
  });
});

onUnmounted(() => {
  // Clean up subscriptions
  unsubscribers.forEach((unsubscribe) => unsubscribe());

  // Clear timeout
  if (usernameCheckTimeout) {
    clearTimeout(usernameCheckTimeout);
  }

  // Destroy formula instance
  if (formulaInstance) {
    formulaInstance.destroy();
  }
});
</script>

<style scoped>
.demo-container {
  margin: 2rem 0;
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1400px;
}

@media (max-width: 1024px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}

.demo-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.demo-card h3 {
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
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

.label-with-hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: normal;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input.valid {
  border-color: #10b981;
}

input.invalid {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  min-height: 1rem;
}

.success-message {
  color: #10b981;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.checking {
  color: #3b82f6;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s;
  border-radius: 2px;
}

.strength-weak {
  width: 33%;
  background: #ef4444;
}

.strength-medium {
  width: 66%;
  background: #f59e0b;
}

.strength-strong {
  width: 100%;
  background: #10b981;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 600;
}

.strength-weak-text {
  color: #ef4444;
}
.strength-medium-text {
  color: #f59e0b;
}
.strength-strong-text {
  color: #10b981;
}

.validation-rules {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.validation-rules h4 {
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.validation-rules ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.validation-rules li {
  font-size: 0.75rem;
  color: #64748b;
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.validation-rules li::before {
  content: '○';
  color: #cbd5e1;
}

.validation-rules li.valid::before {
  content: '✓';
  color: #10b981;
}

.validation-rules li.invalid::before {
  content: '✗';
  color: #ef4444;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.checkbox-group input[type='checkbox'] {
  width: auto;
  margin-top: 0.25rem;
}

.checkbox-group label {
  margin-bottom: 0;
  font-weight: normal;
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
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.badges {
  margin-bottom: 1.5rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
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
  max-height: 400px;
  overflow-y: auto;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
