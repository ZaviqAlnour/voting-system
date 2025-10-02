import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBI5t2IqsV1fqgMeH7nPZjj885H4vhpFZA",
  authDomain: "voting-system-a34e4.firebaseapp.com",
  projectId: "voting-system-a34e4",
  storageBucket: "voting-system-a34e4.appspot.com",
  messagingSenderId: "285773144483",
  appId: "1:285773144483:web:b973dadd8c52736b243a16",
  measurementId: "G-WJ1EM0TDSG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
