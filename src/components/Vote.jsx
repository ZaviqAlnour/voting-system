import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { candidates } from "./candidates";

export default function Vote() {
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [votingAllowed, setVotingAllowed] = useState(true);
  const [userIP, setUserIP] = useState("");

  // Fetch user IP
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setUserIP(data.ip))
      .catch(err => console.log(err));
  }, []);

  const handleVote = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selected) {
      setMessage("⚠️ Please select a candidate.");
      return;
    }

    try {
      // Check if this IP has already voted
      const q = query(collection(db, "votes"), where("ip", "==", userIP));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        setVotingAllowed(false);
        setMessage("⚠️ You have already voted from this device!");
        return;
      }

      // Save vote
      await addDoc(collection(db, "votes"), {
        candidate: selected,
        ip: userIP,
        time: new Date()
      });

      setVotingAllowed(false);
      setMessage("✅ Vote Submitted Successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error submitting vote!");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h2>Cast Your Vote</h2>
      {votingAllowed ? (
        <form onSubmit={handleVote}>
          <select
            style={{ width: "100%", marginBottom: 8, padding: 8 }}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required
          >
            <option value="">Select Candidate</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.party})
              </option>
            ))}
          </select>
          <button style={{ width: "100%", padding: 10, background: "#4CAF50", color: "white" }} type="submit">
            Vote
          </button>
        </form>
      ) : (
        <p>⚠️ You have already voted!</p>
      )}
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
