<template>
  <div class="cart-container">
    <div class="cart-header">
      <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
      <button @click="$emit('back')" class="back-button">
        <i class="fas fa-arrow-left"></i> Back to Lessons
      </button>
    </div>

    <div v-if="cart.length === 0" class="empty-cart">
      <i class="fas fa-shopping-basket"></i>
      <p>Your cart is empty</p>
    </div>

    <div v-else>
      <div class="cart-items">
        <div
          v-for="(item, index) in cart"
          :key="index"
          class="cart-item"
        >
          <div class="item-info">
            <i :class="item.icon" class="item-icon"></i>
            <div>
              <h4>{{ item.subject }}</h4>
              <p>{{ item.location }}</p>
            </div>
          </div>
          <div class="item-price">
            <span>£{{ item.price }}</span>
            <button @click="$emit('removeFromCart', index)" class="remove-button">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="cart-total">
        <h3>Total: £{{ cartTotal }}</h3>
      </div>

      <div class="checkout-form">
        <h3>Checkout Information</h3>
        
        <div class="form-group">
          <label>Name:</label>
          <input
            type="text"
            v-model="checkoutForm.name"
            @input="$emit('validateForm')"
            placeholder="Enter your name (letters only)"
            :class="{ 'invalid': checkoutForm.name && !isNameValid }"
          />
          <span v-if="checkoutForm.name && !isNameValid" class="error">
            Name must contain letters only
          </span>
        </div>

        <div class="form-group">
          <label>Phone:</label>
          <input
            type="text"
            v-model="checkoutForm.phone"
            @input="$emit('validateForm')"
            placeholder="Enter your phone number (numbers only)"
            :class="{ 'invalid': checkoutForm.phone && !isPhoneValid }"
          />
          <span v-if="checkoutForm.phone && !isPhoneValid" class="error">
            Phone must contain numbers only
          </span>
        </div>

        <button
          @click="$emit('checkout')"
          :disabled="!isCheckoutEnabled"
          class="checkout-button"
          :class="{ 'disabled': !isCheckoutEnabled }"
        >
          Complete Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cart: {
    type: Array,
    required: true
  },
  cartTotal: {
    type: Number,
    required: true
  },
  checkoutForm: {
    type: Object,
    required: true
  },
  isCheckoutEnabled: {
    type: Boolean,
    required: true
  },
  isNameValid: {
    type: Boolean,
    required: true
  },
  isPhoneValid: {
    type: Boolean,
    required: true
  }
});

defineEmits(['removeFromCart', 'validateForm', 'checkout', 'back']);
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.cart-header h2 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.back-button {
  padding: 10px 20px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #555;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-cart i {
  font-size: 4rem;
  margin-bottom: 20px;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-icon {
  font-size: 2rem;
  color: #4CAF50;
}

.item-info h4 {
  margin: 0 0 4px 0;
  color: #333;
}

.item-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-price span {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4CAF50;
}

.remove-button {
  padding: 8px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #d32f2f;
}

.cart-total {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: right;
}

.cart-total h3 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.checkout-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-form h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group input.invalid {
  border-color: #f44336;
}

.form-group .error {
  display: block;
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 4px;
}

.checkout-button {
  width: 100%;
  padding: 14px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-button:hover:not(.disabled) {
  background-color: #45a049;
}

.checkout-button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .cart-item {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .item-price {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
