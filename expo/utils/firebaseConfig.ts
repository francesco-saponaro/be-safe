// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Firebase Config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_KEY,
  authDomain: "be-safe-49968.firebaseapp.com",
  projectId: "be-safe-49968",
  storageBucket: "be-safe-49968.firebasestorage.app",
  messagingSenderId: "395699988539",
  appId: "1:395699988539:web:9c6f26d5c99a5be621941e",
};

// Ensure Firebase is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
