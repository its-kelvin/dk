/**
 * Aura Networks - Utility Functions
 */

document.addEventListener('DOMContentLoaded', () => {
    highlightActiveLink();
    handleNavbarScroll();
});

// Active Link Highlighting
function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active-link', 'text-primary');
        } else {
            link.classList.remove('active-link', 'text-primary');
        }
    });
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'bg-white/90', 'dark:bg-dark/90');
        } else {
            navbar.classList.remove('shadow-lg', 'bg-white/90', 'dark:bg-dark/90');
        }
    });
}

// helper to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}

// Mobile Menu Toggle
window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobileMenuOverlay');
    if (menu) menu.classList.toggle('active');
};

window.closeMobileMenu = function () {
    const menu = document.getElementById('mobileMenuOverlay');
    if (menu) menu.classList.remove('active');
};
