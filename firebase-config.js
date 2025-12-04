// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCstSu-hHFohF6BrPv1WrIzxC2B1VQfOM8",
  authDomain: "elshamaa2-d64a2.firebaseapp.com",
  projectId: "elshamaa2-d64a2",
  storageBucket: "elshamaa2-d64a2.firebasestorage.app",
  messagingSenderId: "242173416516",
  appId: "1:242173416516:web:3320ca4580ff137ca0d811",
  measurementId: "G-MJE22XKQHX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other files
window.auth = auth;
window.db = db;
window.storage = storage;
