import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { candidates } from "./candidates";

export default function Results() {
  const [voteCounts, setVoteCounts] = useState({});
  const [winner, setWinner] = useState("");
  const [votingEnded, setVotingEnded] = useState(false);

  useEffect(() => {
    const checkResults = async () => {
      // Set voting period (2 days)
      const votingStart = new Date("2025-10-02T12:00:00"); // example start time
const votingEnd = new Date(votingStart.getTime() + 5*60*60*1000); // 5 hours later
      const now = new Date();

      if (now >= votingEnd) setVotingEnded(true);

      // Get votes
      const votesSnap = await getDocs(collection(db, "votes"));
      let counts = {};
      candidates.forEach(c => counts[c.id] = 0);

      votesSnap.forEach(v => {
        const data = v.data();
        counts[data.candidate] = (counts[data.candidate] || 0) + 1;
      });

      setVoteCounts(counts);

      // Determine winner
      let max = -1, win = "";
      candidates.forEach(c => {
        if (counts[c.id] > max) {
          max = counts[c.id];
          win = c.name;
        }
      });
      setWinner(win);
    };

    checkResults();
  }, []);

  if (!votingEnded) {
    return <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h2>Results will be available after voting ends.</h2>
    </div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h2>Voting Results</h2>
      {candidates.map(c => (
        <div key={c.id} style={{ marginBottom: 8 }}>
          <strong>{c.name}</strong> ({c.party}): {voteCounts[c.id] || 0} votes
          <div style={{ background: "#ddd", height: 12, borderRadius: 6, marginTop: 4 }}>
            <div style={{ width: `${(voteCounts[c.id]||0)*10}%`, background: "#4CAF50", height: "100%", borderRadius: 6 }}></div>
          </div>
        </div>
      ))}
      <h3 style={{ marginTop: 16 }}>🏆 Winner: {winner}</h3>
    </div>
  );
}
