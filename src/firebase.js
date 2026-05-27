import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKJW_7IDq75EGEFYl4RLSbLUMyAx4UI4I",
  authDomain: "smart-hub-dd9ab.firebaseapp.com",
  projectId: "smart-hub-dd9ab",
  storageBucket: "smart-hub-dd9ab.firebasestorage.app",
  messagingSenderId: "132000706706",
  appId: "1:132000706706:web:0be60c8e5cfe5bdda1f64b",
  measurementId: "G-W4CCDVQBLY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);