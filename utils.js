/**
 * FORTUNE DK - Utility Functions
 */

document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
});

async function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        try {
            const response = await fetch('header.html');
            headerPlaceholder.innerHTML = await response.text();
            highlightActiveLink();
            initProfileUI();
            if (window.Cart) window.Cart.updateBadge();
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    if (footerPlaceholder) {
        try {
            const response = await fetch('footer.html');
            footerPlaceholder.innerHTML = await response.text();
            const yr = document.getElementById('year');
            if (yr) yr.textContent = new Date().getFullYear();
        } catch (error) {
            console.error('Error loading footer:', error);
        }
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

// Profile Dropdown Handlers
window.toggleProfileDropdown = function () {
    const dropdown = document.getElementById('profile-dropdown');
    const user = localStorage.getItem('fortune_dk_user');

    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    if (dropdown) dropdown.classList.toggle('hidden');
};

window.handleLogout = function () {
    Auth.logout(); // Use the Firebase Auth logout function
};

function initProfileUI() {
    const user = localStorage.getItem('fortune_dk_user');
    const profileContainer = document.getElementById('profile-container');
    if (user && profileContainer) {
        // We could change the icon to an avatar initial here if desired
        const icon = profileContainer.querySelector('svg');
        if (icon) icon.classList.add('text-primary');
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

// helper to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}
