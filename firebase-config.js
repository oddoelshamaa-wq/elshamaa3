// Firebase Configuration
// Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Products collection reference
const productsRef = db.collection('products');
const ordersRef = db.collection('orders');
const usersRef = db.collection('users');
const categoriesRef = db.collection('categories');
const driversRef = db.collection('drivers');
const offersRef = db.collection('offers');
const deliveryPricesRef = db.collection('deliveryPrices');
