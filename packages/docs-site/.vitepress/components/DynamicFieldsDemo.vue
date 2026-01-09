<template>
  <div class="demo-container">
    <div class="demo-grid">
      <div class="demo-card">
        <h3>🛒 Shopping Cart Form</h3>

        <form @submit.prevent="handleSubmit">
          <div class="form-section">
            <h4>Customer Information</h4>
            <div class="form-group">
              <label for="customerName">Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                required
                minlength="2"
                placeholder="Enter customer name"
                autocomplete="off"
                data-1p-ignore
                data-lpignore="true"
                data-protonpass-ignore="true"
              />
              <span class="error-message" id="customerName-error"></span>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="customer@example.com"
                autocomplete="off"
                data-1p-ignore
                data-lpignore="true"
                data-protonpass-ignore="true"
              />
              <span class="error-message" id="email-error"></span>
            </div>

            <div class="form-group">
              <label for="shippingAddress">Shipping Address</label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                required
                maxlength="200"
                rows="3"
                placeholder="Enter full shipping address"
                autocomplete="off"
                data-1p-ignore
                data-lpignore="true"
                data-protonpass-ignore="true"
              ></textarea>
              <span class="error-message" id="shippingAddress-error"></span>
            </div>
          </div>

          <div class="form-section">
            <h4>Cart Items</h4>
            <div id="items-container"></div>
            <button type="button" class="btn btn-secondary" @click="addItem">➕ Add Item</button>
          </div>

          <div class="form-section">
            <h4>Discount & Notes</h4>
            <div class="form-group">
              <label for="discountCode">Discount Code (Optional)</label>
              <input
                type="text"
                id="discountCode"
                name="discountCode"
                placeholder="Enter discount code"
                pattern="[A-Z0-9]{4,10}"
                title="Discount code must be 4-10 uppercase letters or numbers"
                autocomplete="off"
                data-1p-ignore
                data-lpignore="true"
                data-protonpass-ignore="true"
              />
              <span class="error-message" id="discountCode-error"></span>
            </div>

            <div class="form-group">
              <label for="notes">Order Notes (Optional)</label>
              <textarea id="notes" name="notes" rows="3" placeholder="Any special instructions?"></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">💳 Process Order</button>
        </form>
      </div>

      <div class="demo-card">
        <h3>📊 Order Summary</h3>

        <div class="summary-card">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(totals.subtotal) }}</span>
          </div>
          <div v-if="totals.hasDiscount" class="summary-row">
            <span>Discount (10%):</span>
            <span>-{{ formatCurrency(totals.discount) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (10%):</span>
            <span>{{ formatCurrency(totals.tax) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>{{ formatCurrency(totals.shipping) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ formatCurrency(totals.total) }}</span>
          </div>
        </div>

        <h3>📝 Form State</h3>
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
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { formula } from '@webhelpers/formula';

const formValues = ref({});
const formErrors = ref({});

const totals = reactive({
  subtotal: 0,
  discount: 0,
  hasDiscount: false,
  tax: 0,
  shipping: 5.0,
  total: 5.0,
});

let formulaForm = null;
let unsubscribers = [];
let itemCount = 0;
let formulaInstance = null;

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function calculateTotals(values) {
  let subtotal = 0;

  // Calculate subtotal from all items
  Object.keys(values).forEach((key) => {
    if (key.startsWith('item-') && key.endsWith('-total')) {
      const total = parseFloat(values[key]) || 0;
      subtotal += total;
    }
  });

  // Check for discount code
  const discountCode = values.discountCode?.toUpperCase() || '';
  const hasDiscount = discountCode === 'FORM';
  const discount = hasDiscount ? subtotal * 0.1 : 0;
  const subtotalAfterDiscount = subtotal - discount;

  const tax = subtotalAfterDiscount * 0.1;
  const shipping = subtotal >= 500 ? 15.0 : 5.0;
  const total = subtotalAfterDiscount + tax + shipping;

  totals.subtotal = subtotal;
  totals.discount = discount;
  totals.hasDiscount = hasDiscount;
  totals.tax = tax;
  totals.shipping = shipping;
  totals.total = total;
}

function createItemCard(index) {
  const itemsContainer = document.getElementById('items-container');

  const itemCard = document.createElement('div');
  itemCard.className = 'item-card';
  itemCard.id = `item-${index}`;
  itemCard.innerHTML = `
    <div class="item-header">
      <span class="item-title">Item #${index + 1}</span>
      <button type="button" class="btn btn-danger" data-item-index="${index}">
        🗑️ Remove
      </button>
    </div>
    <div class="item-grid">
      <div class="form-group">
        <label for="item-${index}-name">Product Name</label>
        <input 
          type="text" 
          id="item-${index}-name" 
          name="item-${index}-name" 
          required
          placeholder="Product name"
        />
      </div>
      <div class="form-group">
        <label for="item-${index}-quantity">Quantity</label>
        <input 
          type="number" 
          id="item-${index}-quantity" 
          name="item-${index}-quantity" 
          min="1" 
          value="1"
          required
        />
      </div>
      <div class="form-group">
        <label for="item-${index}-price">Price ($)</label>
        <input 
          type="number" 
          id="item-${index}-price" 
          name="item-${index}-price" 
          min="0" 
          step="0.01" 
          value="0"
          required
        />
      </div>
    </div>
    <input type="hidden" id="item-${index}-total" name="item-${index}-total" value="0" />
  `;

  itemsContainer.appendChild(itemCard);

  // Add event listeners for quantity and price to calculate total
  const quantityInput = itemCard.querySelector(`#item-${index}-quantity`);
  const priceInput = itemCard.querySelector(`#item-${index}-price`);
  const totalInput = itemCard.querySelector(`#item-${index}-total`);

  function updateItemTotal() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = quantity * price;
    totalInput.value = total.toFixed(2);
    totalInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  quantityInput.addEventListener('input', updateItemTotal);
  priceInput.addEventListener('input', updateItemTotal);

  // Add remove button handler
  const removeBtn = itemCard.querySelector('.btn-danger');
  removeBtn.addEventListener('click', () => removeItem(index));

  // Trigger initial calculation and notify Formula of new fields
  updateItemTotal();

  // Call updateForm to notify Formula about the new fields
  formulaForm.updateForm();
}

function removeItem(index) {
  const itemCard = document.getElementById(`item-${index}`);
  if (itemCard) {
    itemCard.remove();
    // Trigger update by dispatching input event on form
    const form = document.querySelector('.demo-container form');
    form.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function addItem() {
  createItemCard(itemCount);
  itemCount++;
}

function handleSubmit() {
  const values = formulaForm.formValues.get();

  // Build order summary
  const items = [];
  Object.keys(values).forEach((key) => {
    const match = key.match(/^item-(\d+)-name$/);
    if (match) {
      const index = match[1];
      items.push({
        name: values[`item-${index}-name`],
        quantity: values[`item-${index}-quantity`],
        price: values[`item-${index}-price`],
        total: values[`item-${index}-total`],
      });
    }
  });

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total), 0);

  // Check for discount code
  const discountCode = values.discountCode?.toUpperCase() || '';
  const hasDiscount = discountCode === 'FORM';
  const discount = hasDiscount ? subtotal * 0.1 : 0;
  const subtotalAfterDiscount = subtotal - discount;

  const tax = subtotalAfterDiscount * 0.1;
  const shipping = subtotal >= 500 ? 15.0 : 5.0;
  const total = subtotalAfterDiscount + tax + shipping;

  const orderSummary = {
    customer: {
      name: values.customerName,
      email: values.email,
      address: values.shippingAddress,
    },
    items,
    pricing: {
      subtotal: subtotal.toFixed(2),
      discount: hasDiscount ? discount.toFixed(2) : '0.00',
      discountApplied: hasDiscount,
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
    },
    discountCode: values.discountCode,
    notes: values.notes,
  };

  alert(`Order Submitted!\n\n${JSON.stringify(orderSummary, null, 2)}`);
  console.log('Order submitted:', orderSummary);
}

onMounted(() => {
  const form = document.querySelector('.demo-container form');

  formulaForm = formula({
    defaultValues: {
      customerName: '',
      email: '',
      shippingAddress: '',
      discountCode: '',
      notes: '',
    },
  });

  formulaInstance = formulaForm.init(form);

  // Subscribe to form values
  unsubscribers.push(
    formulaForm.formValues.subscribe((values) => {
      formValues.value = values;
      calculateTotals(values);
    }),
  );

  // Subscribe to form errors
  unsubscribers.push(
    formulaForm.errors.subscribe((errors) => {
      formErrors.value = errors;

      // Update inline error messages
      ['customerName', 'email', 'shippingAddress', 'discountCode'].forEach((field) => {
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

  // Add initial item
  createItemCard(itemCount);
  itemCount++;
});

onUnmounted(() => {
  // Clean up subscriptions
  unsubscribers.forEach((unsubscribe) => unsubscribe());

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-card h4 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
  font-weight: 600;
  font-size: 0.875rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}

/* Styles for dynamically created items - using :deep() to penetrate scoped styles */
:deep(#items-container .item-card) {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

:deep(#items-container .item-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

:deep(#items-container .item-title) {
  font-weight: 600;
  color: #1e293b;
}

:deep(#items-container .item-grid) {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  :deep(#items-container .item-grid) {
    grid-template-columns: 1fr;
  }
}

:deep(#items-container .form-group) {
  margin-bottom: 0;
}

:deep(#items-container label) {
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
  font-weight: 600;
  font-size: 0.875rem;
}

:deep(#items-container input) {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

:deep(#items-container input:focus) {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}

:deep(#items-container .btn-danger) {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

:deep(#items-container .btn-danger:hover) {
  background: #dc2626;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  width: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(245, 87, 108, 0.3);
}

.btn-secondary {
  background: #6366f1;
  color: white;
  width: 100%;
}

.btn-secondary:hover {
  background: #4f46e5;
}

.btn-danger {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
}

.btn-danger:hover {
  background: #dc2626;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.summary-row.total {
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
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

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  min-height: 1rem;
}
</style>
