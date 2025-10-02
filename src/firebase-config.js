// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config (your real values)
const firebaseConfig = {
  apiKey: "AIzaSyBI5t2IqsV1fqgMeH7nPZjj885H4vhpFZA",
  authDomain: "voting-system-a34e4.firebaseapp.com",
  projectId: "voting-system-a34e4",
  storageBucket: "voting-system-a34e4.firebasestorage.app",
  messagingSenderId: "285773144483",
  appId: "1:285773144483:web:b973dadd8c52736b243a16",
  measurementId: "G-WJ1EM0TDSG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
