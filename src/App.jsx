import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Vote from "./components/Vote";
import Results from "./components/Results";

export default function App() {
  return (
    <Router>
      <nav style={{ display:"flex", justifyContent:"space-around", padding:12, background:"#4CAF50", color:"white" }}>
        <Link style={{ color:"white", textDecoration:"none" }} to="/">Vote</Link>
        <Link style={{ color:"white", textDecoration:"none" }} to="/results">Results</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Vote />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}
