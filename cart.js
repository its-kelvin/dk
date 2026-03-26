/**
 * Aura Networks - Cart System
 */

const Cart = {
    items: [],

    init() {
        this.loadCart();
        this.updateBadge();
        this.addEventListeners();
    },

    loadCart() {
        const savedCart = localStorage.getItem('aura_cart');
        this.items = savedCart ? JSON.parse(savedCart) : [];
    },

    saveCart() {
        localStorage.setItem('aura_cart', JSON.stringify(this.items));
        this.updateBadge();
    },

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.notify(`Added ${product.name} to cart`);
    },

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    },

    clearCart() {
        this.items = [];
        this.saveCart();
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateBadge() {
        const badge = document.getElementById('cartCount');
        if (badge) {
            const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
        }
    },

    notify(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-xl shadow-2xl z-[200] transform transition-all duration-300 translate-y-20';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.remove('translate-y-20'), 100);
        setTimeout(() => {
            toast.classList.add('translate-y-20');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    addEventListeners() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                e.preventDefault();
                const id = btn.dataset.id;
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const image = btn.dataset.image;
                
                this.addItem({ id, name, price, image });
            }
        });
    }
};

// Global export for use in other scripts
window.Cart = Cart;
Cart.init();
