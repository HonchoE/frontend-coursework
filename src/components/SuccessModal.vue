<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2>Order Successful!</h2>
      <p>Thank you for your purchase. Your order has been confirmed.</p>
      <button @click="$emit('close')" class="close-button">Close</button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.success-icon {
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 20px;
}

.modal-content h2 {
  color: #333;
  margin: 0 0 16px 0;
}

.modal-content p {
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.close-button {
  padding: 12px 32px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-button:hover {
  background-color: #45a049;
}
</style>
