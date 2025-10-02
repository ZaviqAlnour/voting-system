import React, { useEffect, useState } from "react";
import { auth, provider, db } from "./firebase-config";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [pollTitle, setPollTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [candidates, setCandidates] = useState([
    { id: "c1", name: "" },
    { id: "c2", name: "" },
    { id: "c3", name: "" },
    { id: "c4", name: "" },
  ]);

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const loadPoll = async () => {
    const docRef = doc(db, "polls", "demo_poll");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setPollTitle(data.title);
      setStartAt(data.start_at.toDate().toISOString().slice(0,16));
      setEndAt(data.end_at.toDate().toISOString().slice(0,16));
      setCandidates(data.candidates);
    }
  };

  useEffect(() => {
    if(user) loadPoll();
  }, [user]);

  const handleSave = async () => {
    const docRef = doc(db, "polls", "demo_poll");
    await setDoc(docRef, {
      title: pollTitle,
      start_at: new Date(startAt),
      end_at: new Date(endAt),
      candidates
    });
    alert("Poll saved!");
  };

  if(!user) return <button onClick={handleLogin}>Login with Google (Admin)</button>;

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Admin Panel</h2>
      <input
        style={{ width: "100%", marginBottom: 8 }}
        value={pollTitle}
        onChange={(e) => setPollTitle(e.target.value)}
        placeholder="Poll Title"
      />
      <label>Start At:</label>
      <input
        type="datetime-local"
        style={{ width: "100%", marginBottom: 8 }}
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
      />
      <label>End At:</label>
      <input
        type="datetime-local"
        style={{ width: "100%", marginBottom: 8 }}
        value={endAt}
        onChange={(e) => setEndAt(e.target.value)}
      />
      <h3>Candidates</h3>
      {candidates.map((c, idx) => (
        <input
          key={c.id}
          style={{ width: "100%", marginBottom: 6 }}
          value={c.name}
          onChange={(e) => {
            const newCandidates = [...candidates];
            newCandidates[idx].name = e.target.value;
            setCandidates(newCandidates);
          }}
          placeholder={`Candidate ${idx+1} Name`}
        />
      ))}
      <button onClick={handleSave} style={{ marginTop: 12, width: "100%", padding: 8, backgroundColor:"#4CAF50", color:"white"}}>Save Poll</button>
    </div>
  );
}
