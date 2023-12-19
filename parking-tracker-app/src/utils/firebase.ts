import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBaAPC0iP8TzIfmYPeWe0FG2K57eAcRrSQ",
  authDomain: "motorparking-tracker-80865.firebaseapp.com",
  databaseURL: "https://motorparking-tracker-80865-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "motorparking-tracker-80865",
  storageBucket: "motorparking-tracker-80865.appspot.com",
  messagingSenderId: "47412662760",
  appId: "1:47412662760:web:ac902b6dcbc075dd58d45d",
  measurementId: "G-FR9C69RRE2",
  serviceAccount: "motorparking-tracker-80865-firebase-adminsdk-xm7m2-e6b9d65206.json"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app , "gs://motorparking-tracker-80865.appspot.com");

//"gs://motorparking-tracker-80865.appspot.com"