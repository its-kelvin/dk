/**
 * Aura Networks - Utility Functions
 */

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
});

async function loadHeader() {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    try {
        const response = await fetch('header.html');
        const html = await response.text();
        placeholder.innerHTML = html;
        highlightActiveLink();
        if (window.Cart) window.Cart.updateBadge();
        if (window.Auth) window.Auth.updateUI();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Global Navigation Handlers
window.toggleMenu = function () {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
};

window.closeMenu = function () {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
};

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

// helper to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}
