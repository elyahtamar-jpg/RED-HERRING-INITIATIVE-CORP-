"use client";

import { useState } from "react";

export default function ComplaintPage() {
  const [name, setName] = useState("");
  const [evidence, setEvidence] = useState("");

  const submitComplaint = async () => {
    const body = { name, evidence };

    const res = await fetch("/api/complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1>File a Complaint</h1>

      <label>Do you have evidence?</label>
      <input
        type="text"
        value={evidence}
        onChange={(e) => setEvidence(e.target.value)}
        style={{ display: "block", marginBottom: "20px", width: "100%" }}
      />

      <label>Your Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: "20px", width: "100%" }}
      />

      <button
        onClick={submitComplaint}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: "6px",
          border: "none",
        }}
      >
        Submit Complaint
      </button>
    </div>
  );
}
