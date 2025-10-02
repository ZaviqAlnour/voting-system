import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function Vote({ pollId }) {
  const [user, setUser] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [pollTitle, setPollTitle] = useState("");
  const [voted, setVoted] = useState(false);

  const provider = new GoogleAuthProvider();

  // Login function
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  // Check registration code
  const checkRegistration = async () => {
    if (!codeInput) return alert("Enter your registration code");
    const q = query(
      collection(db, "registration"),
      where("code", "==", codeInput)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("Invalid registration code");
      setRegistered(false);
    } else {
      setRegistered(true);
    }
  };

  // Load poll info
  useEffect(() => {
    const loadPoll = async () => {
      const pollDoc = await getDocs(collection(db, "polls"));
      pollDoc.forEach(doc => {
        if (doc.id === pollId) {
          setPollTitle(doc.data().title);
          setCandidates(doc.data().candidates);
        }
      });
    };
    loadPoll();
  }, [pollId]);

  const handleVote = async (candidateId) => {
    if (!user) return alert("Login first");
    if (!registered) return alert("Enter valid registration code first");

    try {
      await addDoc(collection(db, "votes"), {
        poll_id: pollId,
        voter_uid: user.uid,
        candidate_id: candidateId,
        votedAt: new Date()
      });
      alert("Vote successful!");
      setVoted(true);
    } catch (err) {
      console.error(err);
      alert("You already voted!");
      setVoted(true);
    }
  };

  if (!user) {
    return <button onClick={handleLogin}>Login with Google</button>;
  }

  if (!registered) {
    return (
      <div>
        <p>Enter your registration code to vote:</p>
        <input
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
        />
        <button onClick={checkRegistration}>Check Code</button>
      </div>
    );
  }

  if (voted) {
    return <p>Thank you for voting!</p>;
  }

  return (
    <div>
      <h2>{pollTitle}</h2>
      {candidates.map(c => (
        <button
          key={c.id}
          onClick={() => handleVote(c.id)}
          style={{ display: "block", margin: "8px 0" }}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
