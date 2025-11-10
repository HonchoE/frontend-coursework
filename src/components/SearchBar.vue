<template>
  <div class="search-bar">
    <div class="search-input">
      <i class="fas fa-search"></i>
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search lessons..."
      />
    </div>
    
    <div class="sort-controls">
      <label>Sort by:</label>
      <select
        :value="sortAttribute"
        @change="$emit('update:sortAttribute', $event.target.value)"
      >
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Availability</option>
      </select>
      
      <select
        :value="sortOrder"
        @change="$emit('update:sortOrder', $event.target.value)"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: String,
  sortAttribute: String,
  sortOrder: String
});

defineEmits(['update:searchQuery', 'update:sortAttribute', 'update:sortOrder']);
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input i {
  position: absolute;
  left: 12px;
  color: #666;
}

.search-input input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input input:focus {
  outline: none;
  border-color: #4CAF50;
}

.sort-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sort-controls label {
  font-weight: 600;
  color: #333;
}

.sort-controls select {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.3s;
  background-color: white;
}

.sort-controls select:focus {
  outline: none;
  border-color: #4CAF50;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .sort-controls {
    flex-wrap: wrap;
  }
}
</style>
