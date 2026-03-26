// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYuxByp3JNjoQz0focKwEMUnd2RNftn1w",
  authDomain: "ecommerce-9a1a6.firebaseapp.com",
  projectId: "ecommerce-9a1a6",
  storageBucket: "ecommerce-9a1a6.firebasestorage.app",
  messagingSenderId: "724922104409",
  appId: "1:724922104409:web:e5bec20f05f2b9d17f4f48",
  measurementId: "G-B2VM1JRWP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
