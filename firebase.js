// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkCLeYwRbGtgGVT4ClrFQVERpbRLFwGY0",
  authDomain: "campusconnect-6001a.firebaseapp.com",
  projectId: "campusconnect-6001a",
  storageBucket: "campusconnect-6001a.appspot.com",
  messagingSenderId: "456499876385",
  appId: "1:456499876385:web:34a890197679091d6c8960",
  measurementId: "G-FL7WVP5W3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };