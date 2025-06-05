// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
