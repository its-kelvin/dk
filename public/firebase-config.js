// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { FieldValue } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js"; // Import FieldValue
import { getStorage } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDv-SJqXR3eXh_uozsRmm463K7F3t06pj0",
  authDomain: "dkweb-c820f.firebaseapp.com",
  projectId: "dkweb-c820f",
  storageBucket: "dkweb-c820f.firebasestorage.app",
  messagingSenderId: "64952994298",
  appId: "1:64952994298:web:8a8a4e8632828e26fe7c43",
  measurementId: "G-BCP9MLRWK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage, FieldValue };
