/**
 * FORTUNE DK - Auth System (Firebase Implementation)
 */
import { auth, db } from './firebase-config.js';
import {
    onAuthStateChanged, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export const Auth = {
    user: null,

    init() {
        // Listen for real-time auth state changes
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = {
                    uid: user.uid,
                    email: user.email,
                    username: user.displayName || user.email.split('@')[0]
                };
                localStorage.setItem('fortune_dk_user', JSON.stringify(this.user));
            } else {
                this.user = null;
                localStorage.removeItem('fortune_dk_user'); // Clear local storage on logout
            }
            this.updateUI();
        });
    },

    // No longer needed as onAuthStateChanged handles this
    // loadUser() {
    //     const savedUser = localStorage.getItem('fortune_dk_user');
    //     this.user = savedUser ? JSON.parse(savedUser) : null;
    // },

    async register(email, password, fullName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with display name
            await updateProfile(user, { displayName: fullName });

            // Optionally, save additional user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: fullName,
                createdAt: serverTimestamp(),
                role: 'customer' // Default role
            });

            console.log("User registered and profile updated:", user);
            return user;
        } catch (error) {
            console.error("Registration Error:", error);
            throw error; // Re-throw to be handled by UI
        }
    },

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Login Error:", error);
            throw error; // Re-throw to be handled by UI
        }
    },

    async logout() {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Logout Error:", error);
        }
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
