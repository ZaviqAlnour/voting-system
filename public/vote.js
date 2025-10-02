import { db } from "./firebase.js";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { candidates } from "./candidates.js";

// Candidate dropdown এ names load করা
const candidateSelect = document.getElementById("candidate");
candidates.forEach(c => {
  const option = document.createElement("option");
  option.value = c.id;
  option.textContent = c.name;
  candidateSelect.appendChild(option);
});

document.getElementById("voteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const code = document.getElementById("code").value.trim();
  const candidate = document.getElementById("candidate").value;

  try {
    // Check যদি code already registered হয়
    const q = query(collection(db, "registrations"), where("code", "==", code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      document.getElementById("voteMessage").innerText = "❌ Invalid Code!";
      return;
    }

    let regDoc;
    querySnapshot.forEach((docSnap) => {
      regDoc = { id: docSnap.id, ...docSnap.data() };
    });

    if (regDoc.voted) {
      document.getElementById("voteMessage").innerText = "⚠️ This code has already voted!";
      return;
    }

    // Vote save করা
    await addDoc(collection(db, "votes"), {
      code,
      candidate,
      time: new Date()
    });

    // Registration update করা যেন voted = true হয়
    await updateDoc(doc(db, "registrations", regDoc.id), {
      voted: true
    });

    document.getElementById("voteMessage").innerText = "✅ Vote Submitted Successfully!";
  } catch (error) {
    console.error("Error submitting vote: ", error);
    document.getElementById("voteMessage").innerText = "❌ Error submitting vote!";
  }
});
