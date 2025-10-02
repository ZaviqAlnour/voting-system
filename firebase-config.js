// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBI5t2IqsV1fqgMeH7nPZjj885H4vhpFZA",
  authDomain: "voting-system-a34e4.firebaseapp.com",
  projectId: "voting-system-a34e4",
  storageBucket: "voting-system-a34e4.appspot.com",
  messagingSenderId: "285773144483",
  appId: "1:285773144483:web:b973dadd8c52736b243a16",
  measurementId: "G-WJ1EM0TDSG"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
