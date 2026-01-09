# `dirty`

The `dirty` store tracks whether a field's value has been changed from its initial value. This is useful for enabling/disabling save buttons, or for warning users about unsaved changes.

## Shape

```typescript
Record<string, boolean>;
```

A field's value is `true` if it is "dirty" (modified), otherwise it is not present in the object.

## Usage

You can use the `dirty` store to provide feedback to the user about the state of the form.

### With the Web Component

Listen for the `form:dirty` event.

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const form = document.querySelector('formula-form');
  const saveIndicator = document.querySelector('#save-indicator');

  let isDirty = false;

  form.addEventListener('form:dirty', (e) => {
    const dirtyFields = e.detail;
    isDirty = Object.keys(dirtyFields).length > 0;

    if (isDirty) {
      saveIndicator.textContent = 'You have unsaved changes.';
    } else {
      saveIndicator.textContent = 'Form is saved.';
    }
  });

  window.addEventListener('beforeunload', (event) => {
    if (isDirty) {
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome
    }
  });
</script>

<formula-form>
  <form>
    <input name="username" type="text" value="initial_username" />
  </form>
</formula-form>
<div id="save-indicator">Form is saved.</div>
```

### With the Library

Subscribe to the `dirty` store directly.

```javascript
import { formula } from '@webhelpers/formula';

const formEl = document.querySelector('form');
const formulaInstance = formula().init(formEl);
const saveButton = document.querySelector('#save-button');

// Disable the save button initially
saveButton.disabled = true;

formulaInstance.stores.dirty.subscribe((dirtyFields) => {
  const isFormDirty = Object.values(dirtyFields).some((isDirty) => isDirty);
  saveButton.disabled = !isFormDirty;
});
```
