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
  if (props.lesson?.imageUrl) {
    return props.lesson.imageUrl;
  }

  const subject = props.lesson?.subject || 'Lesson';
  return `https://via.placeholder.com/400x250.png?text=${encodeURIComponent(subject)}`;
});
</script>

<style scoped>
.lesson-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.lesson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
.lesson-image {
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f1f1f1;
  margin-bottom: 16px;
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
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.lesson-card button:hover:not(.disabled) {
  background-color: #45a049;
}

.lesson-card button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
