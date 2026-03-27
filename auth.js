/**
 * FORTUNE DK - Auth System (Static Simulation with Firebase ready handles)
 */

export const Auth = {
    user: null,

    init() {
        this.loadUser();
        this.updateUI();
    },

    loadUser() {
        const savedUser = localStorage.getItem('fortune_dk_user');
        this.user = savedUser ? JSON.parse(savedUser) : null;
    },

    saveUser(user) {
        localStorage.setItem('fortune_dk_user', JSON.stringify(user));
        this.user = user;
        this.updateUI();
    },

    logout() {
        localStorage.removeItem('fortune_dk_user');
        this.user = null;
        this.updateUI();
        window.location.href = 'index.html';
    },

    isLoggedIn() {
        return this.user !== null;
    },

    updateUI() {
        const authLinks = document.getElementById('authLinks');
        if (!authLinks) return;

        if (this.user) {
            authLinks.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="flex flex-col items-end hidden sm:flex">
                        <span class="text-xs font-bold">${this.user.username}</span>
                        <button onclick="Auth.logout()" class="text-[10px] text-primary font-bold hover:underline">Sign Out</button>
                    </div>
                    <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20">
                        ${this.user.username.substring(0, 2).toUpperCase()}
                    </div>
                </div>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="auth.html" class="hidden sm:inline-flex items-center px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/25">
                    Login
                </a>
                <a href="auth.html" class="sm:hidden p-2.5 bg-primary text-white rounded-xl">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </a>
            `;
        }
    }
};

window.Auth = Auth;
Auth.init();
