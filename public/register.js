import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Function to generate unique 6-digit code
function generateCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const code = generateCode();

  try {
    await addDoc(collection(db, "registrations"), {
      name,
      email,
      code,
      voted: false
    });

    document.getElementById("resultMessage").innerText = 
      `✅ Registration Successful! Your Code: ${code}`;
  } catch (error) {
    console.error("Error adding document: ", error);
    document.getElementById("resultMessage").innerText = "❌ Error! Try again.";
  }
});
