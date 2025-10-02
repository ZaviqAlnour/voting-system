import React, { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Results({ pollId }) {
  const [candidates, setCandidates] = useState([]);
  const [votesCount, setVotesCount] = useState({});

  useEffect(() => {
    const loadResults = async () => {
      // Load candidates
      const pollSnap = await getDocs(collection(db, "polls"));
      pollSnap.forEach(doc => {
        if(doc.id === pollId){
          setCandidates(doc.data().candidates);
          const initCount = {};
          doc.data().candidates.forEach(c => initCount[c.id]=0);
          setVotesCount(initCount);
        }
      });

      // Load votes
      const votesSnap = await getDocs(collection(db, "votes"));
      votesSnap.forEach(voteDoc => {
        const v = voteDoc.data();
        if(v.poll_id === pollId){
          setVotesCount(prev => ({...prev, [v.candidate_id]: (prev[v.candidate_id]||0)+1}));
        }
      });
    };
    loadResults();
  }, [pollId]);

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Vote Results</h2>
      {candidates.map(c => (
        <div key={c.id} style={{ marginBottom: 6 }}>
          <strong>{c.name}:</strong> {votesCount[c.id] || 0} votes
          <div style={{ background:"#ddd", height:12, borderRadius:6, marginTop:4 }}>
            <div style={{ width: `${votesCount[c.id]||0*10}%`, background:"#4CAF50", height:"100%", borderRadius:6 }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
