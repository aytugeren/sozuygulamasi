import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkSki3tQgPaFSKy2WyXkN45a0QtBMT3rg",
  authDomain: "sozuygulamasi-f95c9.firebaseapp.com",
  projectId: "sozuygulamasi-f95c9",
  storageBucket: "sozuygulamasi-f95c9.firebasestorage.app",
  messagingSenderId: "129125361912",
  appId: "1:129125361912:web:bbbcfc6954f4d73db6f30d",
  measurementId: "G-8ZGSN0MHR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);