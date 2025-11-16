# Test Page

<script setup>
import { onMounted, ref } from 'vue'
import { formula } from '@webhelpers/formula'

const formValues = ref({})

onMounted(() => {
  const form = document.getElementById('test-form')
  if (form) {
    const formulaForm = formula({
      defaultValues: {
        name: 'Test User',
        email: 'test@example.com'
      }
    })
    
    const instance = formulaForm.init(form)
    
    formulaForm.formValues.subscribe((values) => {
      formValues.value = values
    })
  }
})
</script>

<style>
  #test-form {
    background-color: #f5f5f5;
    color: #000;
    flex-direction: column;
    display: flex;
    gap: 1rem;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
  }
  
  #test-form label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  #test-form input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  #test-form button {
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  #test-form button:hover {
    background-color: #2563eb;
  }
</style>


<form id="test-form">
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <label>
    Email:
    <input type="email" name="email" />
  </label>
  <button type="submit">Submit</button>
</form>
