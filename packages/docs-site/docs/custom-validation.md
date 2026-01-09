# Custom Validation

While HTML5 validation is a great starting point, many forms need more complex validation logic. Formula makes it easy to add your own custom rules, including cross-field validation and even asynchronous checks. This example shows how to build a registration form with advanced validation requirements.

## Advanced Registration Form

This form demonstrates several advanced validation techniques, such as checking password strength in real-time, ensuring the "confirm password" field matches, and even checking username availability with a simulated API call.

<script setup>
import CustomValidationDemo from '../.vitepress/components/CustomValidationDemo.vue'
</script>

<CustomValidationDemo />

<details>
<summary><strong>📄 Click to view complete HTML example</strong></summary>

### Complete Vanilla HTML Example

<<< @/docs/examples/custom-validation.html

</details>

## Advanced Validation in Action

Formula is designed to handle complex validation scenarios gracefully. Here are some of the key techniques you can use to build highly secure and user-friendly forms.

### Custom Validation Logic

You can implement any validation logic you need. For instance, the demo includes a real-time password strength checker that gives the user visual feedback as they type. It also demonstrates cross-field validation by ensuring that the password and confirmation fields match.

### Asynchronous Validation

Forms often need to validate data against a server. Formula supports asynchronous validation, as shown in the username availability check. This feature simulates an API call and provides feedback to the user after a short delay, all without blocking the UI.

### Custom Error Messages

Default browser validation messages can be generic. Formula allows you to provide custom, more helpful error messages using a simple `data-message` attribute on your input fields.

### Building a Better User Experience

The key to good form validation is providing clear, immediate feedback. With Formula, you can create a great user experience by:

- **Giving Visual Feedback**: The input borders in the demo change color to indicate whether the data is valid.
- **Real-time Updates**: Validation results are shown as the user types, so they can correct mistakes instantly.
- **Debounced Checks**: For performance-intensive checks like the username availability, the validation is debounced, waiting for the user to pause typing before making the check.
- **Helpful Rule Indicators**: The password strength checker includes a visual checklist, so users know exactly what is required.

## Implementing Custom Validation

### Password Strength Checker

A password strength checker can be implemented with a simple function that checks the password against a set of rules.

```javascript
function checkPasswordStrength(password) {
  let strength = 0;
  const rules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  Object.values(rules).forEach((rule) => {
    if (rule) strength++;
  });

  return { strength, rules };
}
```

### Cross-field Validation

Validating that two fields match is also straightforward. You can compare the values of two inputs and show an error if they don't match.

```javascript
function validatePasswordMatch() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (confirmPassword && password !== confirmPassword) {
    // Show error
    return false;
  }
  return true;
}
```

### Async Validation

For async validation, you can use an `async` function to perform checks like calling an API.

```javascript
async function checkUsernameAvailability(username) {
  // Show loading indicator
  checkingEl.style.display = 'block';

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check availability
  if (takenUsernames.includes(username)) {
    errorEl.textContent = 'Username is already taken';
  } else {
    successEl.textContent = 'Username is available';
  }
}
```

### Custom Error Messages

To override the default browser validation messages, just add a `data-message` attribute to your input.

```html
<!-- Use data-message attribute for custom validation messages -->
<input type="text" name="username" pattern="[a-zA-Z0-9_]+" data-message="Username must contain only letters, numbers, and underscores" />
```

## When to Use Custom Validation

This pattern is perfect for:

- User registration and account settings forms.
- Any form that requires complex validation logic or dependent field validation.
- Forms that need to perform server-side validation for things like username or email availability.

## Next Steps

Try modifying the validation rules, add more custom checks, or integrate with a real backend API for username/email verification! With Formula, you have the flexibility to handle any validation challenge.
