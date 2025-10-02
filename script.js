import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const voteBtn = document.getElementById("vote-btn");
const select = document.getElementById("candidate-select");
const msg = document.getElementById("vote-message");
const resultsContainer = document.getElementById("results-container");
const voteSection = document.getElementById("vote-section");
const resultSection = document.getElementById("result-section");

let userIP = "";

fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => userIP = data.ip)
  .catch(err => console.log(err));

voteBtn.addEventListener("click", async () => {
  const candidate = select.value;
  msg.textContent = "";

  if (!candidate) {
    msg.textContent = "⚠️ Please select a candidate.";
    return;
  }

  // Check if IP already voted
  const q = query(collection(db, "votes"), where("ip", "==", userIP));
  const querySnap = await getDocs(q);

  if (!querySnap.empty) {
    msg.textContent = "⚠️ You have already voted!";
    return;
  }

  // Save vote
  await addDoc(collection(db, "votes"), {
    candidate: candidate,
    ip: userIP,
    time: new Date()
  });

  msg.textContent = "✅ Vote Submitted!";
  voteSection.style.display = "none";
  showResults();
});

// Show results (testing 5 hours bypass)
async function showResults() {
  voteSection.style.display = "none";
  resultSection.style.display = "block";

  const votesSnap = await getDocs(collection(db, "votes"));
  const counts = { c1:0, c2:0, c3:0, c4:0 };

  votesSnap.forEach(v => {
    const data = v.data();
    counts[data.candidate] = (counts[data.candidate] || 0) + 1;
  });

  resultsContainer.innerHTML = "";
  for (let c of ["c1","c2","c3","c4"]) {
    resultsContainer.innerHTML += `<p>${c}: ${counts[c]} votes</p>`;
  }
}
