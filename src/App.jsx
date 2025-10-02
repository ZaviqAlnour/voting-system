import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Vote from "./Vote";
import Admin from "./Admin";
import Results from "./Results";

export default function App() {
  return (
    <Router>
      <nav style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "12px",
        backgroundColor: "#4CAF50",
        color: "white",
        fontWeight: "bold"
      }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Vote</Link>
        <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>Admin</Link>
        <Link to="/results" style={{ color: "white", textDecoration: "none" }}>Results</Link>
      </nav>

      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Vote pollId="demo_poll" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/results" element={<Results pollId="demo_poll" />} />
        </Routes>
      </div>
    </Router>
  );
}
