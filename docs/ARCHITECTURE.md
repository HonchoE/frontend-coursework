# Project Architecture

## Component Structure

### Main App (App.vue)
- Central application logic
- State management
- API integration
- Component orchestration

### Components

#### LessonCard.vue
- Displays individual lesson information
- Shows availability and pricing
- Handles add-to-cart interaction

#### SearchBar.vue
- Search input for filtering lessons
- Sort controls (subject, location, price, availability)
- Responsive design

#### Cart.vue
- Shopping cart display
- Checkout form with validation
- Order submission

#### SuccessModal.vue
- Order confirmation modal
- Success animation

## Data Flow

1. App.vue fetches lessons from API on mount
2. Lessons passed to LessonCard components
3. User actions trigger events bubbled to App.vue
4. App.vue updates state and syncs with API
5. Cart manages checkout process

## API Integration

Base URL: `http://localhost:3000/api`

- GET /lessons - Fetch all lessons
- PUT /lessons/:id - Update lesson spaces
- POST /orders - Submit order
