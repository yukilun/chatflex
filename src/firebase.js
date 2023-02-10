// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdIzPsVkK0qMFNVpYTRDAJgKMu5-pIfEo",
    authDomain: "chatflex-d988f.firebaseapp.com",
    projectId: "chatflex-d988f",
    storageBucket: "chatflex-d988f.appspot.com",
    messagingSenderId: "314391867027",
    appId: "1:314391867027:web:28131757e5e2aee9ab2766"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
// export const db = getFirestore();
export const db = getDatabase();