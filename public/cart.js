/**
 * FORTUNE DK - Cart System
 */

const Cart = {
    items: [],

    init() {
        this.loadCart();
        this.updateBadge();
        this.addEventListeners();
        this.renderCheckout(); // Triggers render on page load
    },

    loadCart() {
        const savedCart = localStorage.getItem('fortune_dk_cart');
        this.items = savedCart ? JSON.parse(savedCart) : [];
    },

    saveCart() {
        localStorage.setItem('fortune_dk_cart', JSON.stringify(this.items));
        this.updateBadge();
        this.renderCheckout(); // Triggers render whenever cart changes
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
    },

    // --- RENDER CHECKOUT LOGIC ---
    renderCheckout() {
        const cartList = document.getElementById('cartItemsList');
        if (!cartList) return;

        let html = '';
        this.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
            <div class="flex flex-col gap-3 p-3 bg-white border border-gray-100 rounded-xl mb-3 shadow-sm">
                <div class="flex items-center gap-3">
                    <img src="${item.image || 'https://placehold.co/100x100'}" class="w-14 h-14 rounded-lg object-cover border border-gray-200">
                    <div class="flex-1">
                        <h3 class="text-sm font-bold text-dark leading-tight">${item.name}</h3>
                        <p class="text-[11px] text-secondary font-semibold mt-1">Unit: KES ${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div class="flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                        <button class="px-2.5 py-1 text-dark hover:bg-gray-200 font-bold" onclick="window.decrementQty('${item.id}')">-</button>
                        <span class="w-8 text-center text-xs font-bold">${item.quantity}</span>
                        <button class="px-2.5 py-1 text-dark hover:bg-gray-200 font-bold" onclick="window.incrementQty('${item.id}')">+</button>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-secondary font-bold uppercase mb-0.5">Item Total</p>
                        <p class="text-sm font-black text-primary">KES ${itemTotal.toLocaleString()}</p>
                    </div>
                </div>
            </div>`;
        });

        cartList.innerHTML = html || '<p class="text-center text-secondary py-4 font-bold">YOUR CART IS EMPTY</p>';

        const total = this.getTotal();
        const formattedTotal = `KES ${total.toLocaleString()}`;
        if (document.getElementById('summarySubtotal')) document.getElementById('summarySubtotal').textContent = formattedTotal;
        if (document.getElementById('summaryTotal')) document.getElementById('summaryTotal').textContent = formattedTotal;
    }
};

// Global helpers for the adjustable quantity buttons
window.incrementQty = (id) => {
    const item = Cart.items.find(i => i.id === id);
    if (item) Cart.updateQuantity(id, item.quantity + 1);
};

window.decrementQty = (id) => {
    const item = Cart.items.find(i => i.id === id);
    if (item) {
        if (item.quantity > 1) {
            Cart.updateQuantity(id, item.quantity - 1);
        } else {
            Cart.removeItem(id);
        }
    }
};

// Global export for use in other scripts
window.Cart = Cart;
Cart.init();