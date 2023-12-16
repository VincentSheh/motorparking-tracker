import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCxLyWO3S71U2rjWVXognlS8t0Y6QKPQf0",
  authDomain: "ntuisa-app.firebaseapp.com",
  projectId: "ntuisa-app",
  storageBucket: "ntuisa-app.appspot.com",
  messagingSenderId: "195083147793",
  appId: "1:195083147793:web:682f6767688b027004afb0",
  measurementId: "G-LQX7DNDYKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app , "gs://ntuisa-app.appspot.com");