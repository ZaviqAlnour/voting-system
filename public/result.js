import { db } from "./firebase.js";
import { collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { candidates } from "./candidates.js";

async function loadResults() {
  const votesSnapshot = await getDocs(collection(db, "votes"));
  
  // Candidate vote count রাখার জন্য map বানালাম
  let voteCounts = {};
  candidates.forEach(c => voteCounts[c.id] = 0);

  votesSnapshot.forEach(doc => {
    const data = doc.data();
    if (voteCounts[data.candidate] !== undefined) {
      voteCounts[data.candidate]++;
    }
  });

  // UI তে দেখানো
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  
  let winner = null;
  let maxVotes = -1;

  candidates.forEach(c => {
    const count = voteCounts[c.id];
    const p = document.createElement("p");
    p.textContent = `${c.name}: ${count} votes`;
    resultsDiv.appendChild(p);

    if (count > maxVotes) {
      maxVotes = count;
      winner = c.name;
    }
  });

  document.getElementById("winner").innerText = 
    `🏆 Winner: ${winner} with ${maxVotes} votes!`;
}

loadResults();
