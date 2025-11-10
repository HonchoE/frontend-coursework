const { createApp } = Vue;

createApp({
    data() {
        return {
            lessons: [],
            cart: [],
            showCart: false,
            sortAttribute: 'subject',
            sortOrder: 'asc',
            searchQuery: '',
            checkoutForm: {
                name: '',
                phone: ''
            },
            isNameValid: false,
            isPhoneValid: false,
            showSuccessModal: false,
            apiBaseUrl: 'http://localhost:3000/api' // Change this to your AWS/Render URL after deployment
        };
    },
    computed: {
        // Filter lessons based on search query
        filteredLessons() {
            if (!this.searchQuery.trim()) {
                return this.lessons;
            }
            
            const query = this.searchQuery.toLowerCase();
            return this.lessons.filter(lesson => {
                return (
                    lesson.subject.toLowerCase().includes(query) ||
                    lesson.location.toLowerCase().includes(query) ||
                    lesson.price.toString().includes(query) ||
                    lesson.spaces.toString().includes(query)
                );
            });
        },
        
        // Sort lessons based on selected attribute and order
        sortedLessons() {
            const lessons = [...this.filteredLessons];
            
            lessons.sort((a, b) => {
                let aValue = a[this.sortAttribute];
                let bValue = b[this.sortAttribute];
                
                // Handle string comparison
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }
                
                if (this.sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            
            return lessons;
        },
        
        // Calculate cart total
        cartTotal() {
            return this.cart.reduce((total, item) => total + item.price, 0);
        },
        
        // Check if checkout button should be enabled
        isCheckoutEnabled() {
            return this.cart.length > 0 && this.isNameValid && this.isPhoneValid;
        }
    },
    methods: {
        // Fetch lessons from API
        async fetchLessons() {
            try {
                const response = await fetch(`${this.apiBaseUrl}/lessons`);
                const data = await response.json();
                this.lessons = data;
            } catch (error) {
                console.error('Error fetching lessons:', error);
                // Use mock data if API is not available
                this.loadMockData();
            }
        },
        
        // Load mock data for testing
        loadMockData() {
            this.lessons = [
                { id: 1, subject: 'Mathematics', location: 'London', price: 50, spaces: 5, icon: 'fas fa-calculator' },
                { id: 2, subject: 'English', location: 'Manchester', price: 45, spaces: 5, icon: 'fas fa-book' },
                { id: 3, subject: 'Science', location: 'Birmingham', price: 55, spaces: 5, icon: 'fas fa-flask' },
                { id: 4, subject: 'Art', location: 'London', price: 40, spaces: 5, icon: 'fas fa-palette' },
                { id: 5, subject: 'Music', location: 'Liverpool', price: 60, spaces: 5, icon: 'fas fa-music' },
                { id: 6, subject: 'Sports', location: 'Leeds', price: 35, spaces: 5, icon: 'fas fa-futbol' },
                { id: 7, subject: 'Drama', location: 'London', price: 50, spaces: 5, icon: 'fas fa-theater-masks' },
                { id: 8, subject: 'Dance', location: 'Manchester', price: 45, spaces: 5, icon: 'fas fa-person-dancing' },
                { id: 9, subject: 'Coding', location: 'Birmingham', price: 70, spaces: 5, icon: 'fas fa-code' },
                { id: 10, subject: 'Chess', location: 'London', price: 30, spaces: 5, icon: 'fas fa-chess' },
                { id: 11, subject: 'Photography', location: 'Bristol', price: 65, spaces: 5, icon: 'fas fa-camera' },
                { id: 12, subject: 'Cooking', location: 'Leeds', price: 55, spaces: 5, icon: 'fas fa-utensils' }
            ];
        },
        
        // Add lesson to cart
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                // Add to cart
                this.cart.push({ ...lesson });
                
                // Decrease available spaces
                lesson.spaces--;
                
                // Update on server
                this.updateLesson(lesson);
            }
        },
        
        // Remove lesson from cart
        removeFromCart(index) {
            const removedItem = this.cart[index];
            this.cart.splice(index, 1);
            
            // Find the original lesson and increase spaces
            const lesson = this.lessons.find(l => l.id === removedItem.id);
            if (lesson) {
                lesson.spaces++;
                this.updateLesson(lesson);
            }
        },
        
        // Update lesson on server
        async updateLesson(lesson) {
            try {
                await fetch(`${this.apiBaseUrl}/lessons/${lesson.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(lesson)
                });
            } catch (error) {
                console.error('Error updating lesson:', error);
            }
        },
        
        // Validate form inputs
        validateForm() {
            // Name validation: letters only (including spaces)
            const nameRegex = /^[A-Za-z\s]+$/;
            this.isNameValid = nameRegex.test(this.checkoutForm.name.trim()) && this.checkoutForm.name.trim().length > 0;
            
            // Phone validation: numbers only
            const phoneRegex = /^[0-9]+$/;
            this.isPhoneValid = phoneRegex.test(this.checkoutForm.phone.trim()) && this.checkoutForm.phone.trim().length > 0;
        },
        
        // Checkout process
        async checkout() {
            if (!this.isCheckoutEnabled) return;
            
            const order = {
                name: this.checkoutForm.name,
                phone: this.checkoutForm.phone,
                lessons: this.cart,
                total: this.cartTotal,
                date: new Date().toISOString()
            };
            
            try {
                const response = await fetch(`${this.apiBaseUrl}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });
                
                if (response.ok) {
                    // Show success modal
                    this.showSuccessModal = true;
                    
                    // Reset form and cart
                    this.cart = [];
                    this.checkoutForm.name = '';
                    this.checkoutForm.phone = '';
                    this.isNameValid = false;
                    this.isPhoneValid = false;
                    
                    // Go back to lessons after a delay
                    setTimeout(() => {
                        this.showCart = false;
                    }, 2000);
                }
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('There was an error submitting your order. Please try again.');
            }
        },
        
        // Perform search
        performSearch() {
            // Search is handled by computed property filteredLessons
            // This method can be used for additional search logic if needed
        }
    },
    mounted() {
        // Fetch lessons when app is mounted
        this.fetchLessons();
    }
}).mount('#app');
