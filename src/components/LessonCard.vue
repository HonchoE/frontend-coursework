<template>
  <div class="lesson-card">
    <div class="lesson-image">
      <img :src="imageSrc" :alt="`${lesson.subject} lesson image`" loading="lazy" />
    </div>
    <div class="lesson-icon">
      <i :class="lesson.icon"></i>
    </div>
    <h3>{{ lesson.subject }}</h3>
    <div class="lesson-details">
      <p><i class="fas fa-map-marker-alt"></i> {{ lesson.location }}</p>
      <p><i class="fas fa-pound-sign"></i> {{ lesson.price }}</p>
      <p><i class="fas fa-users"></i> {{ lesson.spaces }} spaces</p>
    </div>
    <button 
      @click="$emit('addToCart', lesson)"
      :disabled="lesson.spaces === 0"
      :class="{ 'disabled': lesson.spaces === 0 }"
    >
      {{ lesson.spaces > 0 ? 'Add to Cart' : 'Sold Out' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  lesson: {
    type: Object,
    required: true
  }
});

defineEmits(['addToCart']);

const imageSrc = computed(() => {
  const apiBaseUrl = import.meta.env.PROD
    ? 'https://emma-backend-coursework.onrender.com'
    : 'http://localhost:3000';
  
  if (props.lesson?.image) {
    return `${apiBaseUrl}${props.lesson.image}`;
  }
  
  const subject = props.lesson?.subject || 'Lesson';
  return `https://via.placeholder.com/400x250.png?text=${encodeURIComponent(subject)}`;
});
</script>

<style scoped>
.lesson-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-align: center;
  border: 1px solid #e0e0e0;
  position: relative;
  overflow: hidden;
}

.lesson-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}
.lesson-image {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  margin-bottom: 20px;
  position: relative;
}

.lesson-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lesson-icon {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 16px;
}

.lesson-card h3 {
  font-size: 1.5rem;
  margin: 12px 0;
  color: #333;
}

.lesson-details {
  margin: 16px 0;
  color: #666;
}

.lesson-details p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.lesson-card button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);
  margin-top: 16px;
}

.lesson-card button:hover:not(.disabled) {
  background: linear-gradient(135deg, #45a049, #3d8b40);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
}

.lesson-card button.disabled {
  background: linear-gradient(135deg, #ccc, #bbb);
  cursor: not-allowed;
  color: #666;
  box-shadow: none;
}
</style>
