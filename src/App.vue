<script setup>
import { ref, computed, onMounted } from 'vue';
import LessonCard from './components/LessonCard.vue';
import Cart from './components/Cart.vue';
import SearchBar from './components/SearchBar.vue';
import SuccessModal from './components/SuccessModal.vue';

// State
const lessons = ref([]);
const cart = ref([]);
const showCart = ref(false);
const sortAttribute = ref('subject');
const sortOrder = ref('asc');
const searchQuery = ref('');
const checkoutForm = ref({
  name: '',
  phone: ''
});
const isNameValid = ref(false);
const isPhoneValid = ref(false);
const showSuccessModal = ref(false);
const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://emma-backend-coursework.onrender.com/api'
  : 'http://localhost:3000/api';
const apiBaseUrl = ref(
  import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl
);

// Computed properties
const filteredLessons = computed(() => {
  if (!searchQuery.value.trim()) {
    return lessons.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return lessons.value.filter(lesson => {
    return (
      lesson.subject.toLowerCase().includes(query) ||
      lesson.location.toLowerCase().includes(query) ||
      lesson.price.toString().includes(query) ||
      lesson.spaces.toString().includes(query)
    );
  });
});

const sortedLessons = computed(() => {
  const lessonsCopy = [...filteredLessons.value];
  
  lessonsCopy.sort((a, b) => {
    let aValue = a[sortAttribute.value];
    let bValue = b[sortAttribute.value];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return lessonsCopy;
});

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.price, 0);
});

const isCheckoutEnabled = computed(() => {
  return cart.value.length > 0 && isNameValid.value && isPhoneValid.value;
});

// Methods
async function fetchLessons() {
  try {
    const response = await fetch(`${apiBaseUrl.value}/lessons`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    lessons.value = data;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    loadMockData();
  }
}

function loadMockData() {
  const mockLessons = [
    { _id: '1', subject: 'Mathematics', location: 'London', price: 50, spaces: 5, icon: 'fas fa-calculator' },
    { _id: '2', subject: 'English', location: 'Manchester', price: 45, spaces: 5, icon: 'fas fa-book' },
    { _id: '3', subject: 'Science', location: 'Birmingham', price: 55, spaces: 5, icon: 'fas fa-flask' },
    { _id: '4', subject: 'Art', location: 'London', price: 40, spaces: 5, icon: 'fas fa-palette' },
    { _id: '5', subject: 'Music', location: 'Liverpool', price: 60, spaces: 5, icon: 'fas fa-music' },
    { _id: '6', subject: 'Sports', location: 'Leeds', price: 35, spaces: 5, icon: 'fas fa-futbol' },
    { _id: '7', subject: 'Drama', location: 'London', price: 50, spaces: 5, icon: 'fas fa-theater-masks' },
    { _id: '8', subject: 'Dance', location: 'Manchester', price: 45, spaces: 5, icon: 'fas fa-person-dancing' },
    { _id: '9', subject: 'Coding', location: 'Birmingham', price: 70, spaces: 5, icon: 'fas fa-code' },
    { _id: '10', subject: 'Chess', location: 'London', price: 30, spaces: 5, icon: 'fas fa-chess' },
  ];

  lessons.value = mockLessons.map((lesson) => ({
    ...lesson,
    imageUrl: `https://via.placeholder.com/400x250.png?text=${encodeURIComponent(lesson.subject)}`
  }));
}

function addToCart(lesson) {
  if (lesson.spaces > 0) {
    cart.value.push({ ...lesson });
    lesson.spaces--;
    updateLesson(lesson);
  }
}

function removeFromCart(index) {
  const removedItem = cart.value[index];
  cart.value.splice(index, 1);
  
  const lesson = lessons.value.find(l => l._id === removedItem._id);
  if (lesson) {
    lesson.spaces++;
    updateLesson(lesson);
  }
}

async function updateLesson(lesson) {
  try {
    const { _id, imageUrl, ...payload } = lesson;
    await fetch(`${apiBaseUrl.value}/lessons/${lesson._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
  }
}

function validateForm() {
  const nameRegex = /^[A-Za-z\s]+$/;
  isNameValid.value = nameRegex.test(checkoutForm.value.name.trim()) && checkoutForm.value.name.trim().length > 0;
  
  const phoneRegex = /^[0-9]+$/;
  isPhoneValid.value = phoneRegex.test(checkoutForm.value.phone.trim()) && checkoutForm.value.phone.trim().length > 0;
}

async function checkout() {
  if (!isCheckoutEnabled.value) return;
  
  const order = {
    name: checkoutForm.value.name,
    phone: checkoutForm.value.phone,
    lessons: cart.value,
    total: cartTotal.value,
    date: new Date().toISOString()
  };
  
  try {
    const response = await fetch(`${apiBaseUrl.value}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    showSuccessModal.value = true;
    
    cart.value = [];
    checkoutForm.value.name = '';
    checkoutForm.value.phone = '';
    isNameValid.value = false;
    isPhoneValid.value = false;
    
    setTimeout(() => {
      showCart.value = false;
    }, 2000);
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('There was an error submitting your order. Please try again.');
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false;
}

onMounted(() => {
  fetchLessons();
});
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1><i class="fas fa-graduation-cap"></i> After School Classes</h1>
      <button @click="showCart = !showCart" class="cart-button">
        <i class="fas fa-shopping-cart"></i>
        Cart ({{ cart.length }})
      </button>
    </header>

    <div v-if="!showCart">
      <SearchBar 
        v-model:searchQuery="searchQuery"
        v-model:sortAttribute="sortAttribute"
        v-model:sortOrder="sortOrder"
      />
      
      <div class="lessons-grid">
        <LessonCard
          v-for="lesson in sortedLessons"
          :key="lesson._id"
          :lesson="lesson"
          @add-to-cart="addToCart"
        />
      </div>
    </div>

    <Cart
      v-else
      :cart="cart"
      :cartTotal="cartTotal"
      :checkoutForm="checkoutForm"
      :isCheckoutEnabled="isCheckoutEnabled"
      :isNameValid="isNameValid"
      :isPhoneValid="isPhoneValid"
      @remove-from-cart="removeFromCart"
      @validate-form="validateForm"
      @checkout="checkout"
      @back="showCart = false"
    />

    <SuccessModal
      v-if="showSuccessModal"
      @close="closeSuccessModal"
    />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 2.5rem;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.cart-button {
  padding: 12px 24px;
  font-size: 1.1rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
  font-weight: 600;
}

.cart-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .lessons-grid {
    grid-template-columns: 1fr;
  }
}
</style>
