/**
 * Aura Networks - Utility Functions
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    highlightActiveLink();
    handleNavbarScroll();
});

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            sunIcon.classList.toggle('hidden', !isDark);
            moonIcon.classList.toggle('hidden', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

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
