// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore

const firebaseConfig = {
    apiKey: "AIzaSyBYScO8JT0WARzxRsnJ8YvwPgs6Dd33i4Q",
    authDomain: "racetracker-47ae4.firebaseapp.com",
    projectId: "racetracker-47ae4",
    storageBucket: "racetracker-47ae4.firebasestorage.app",
    messagingSenderId: "836479806873",
    appId: "1:836479806873:web:d0d72b658fc67342d33708",
    measurementId: "G-3R45QKYCF9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication instance
const auth = getAuth(app);

// Get the Firestore instance
const db = getFirestore(app); // Initialize Firestore

// Export both auth and db
export { auth, db };