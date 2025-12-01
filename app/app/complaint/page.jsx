"use client";

import { useState } from "react";

export default function ComplaintPage() {
  const [name, setName] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [complaintNumber, setComplaintNumber] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const complaintNumber = "RHI-" + Date.now();
    setComplaintNumber(complaintNumber);

    await fetch("/api/complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        complaintNumber,
        name,
        evidence,
      }),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Complaint Submitted</h1>
        <p>Your complaint number is:</p>
        <h2>{complaintNumber}</h2>
        <p>Keep this number for your records.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>File a Complaint</h1>

      <form onSubmit={handleSubmit}>
        <label>Your Full Name</label>
        <br />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 20 }}
        />

        <label>Do you have evidence?</label>
        <br />
        <textarea
          required
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          style={{ width: "100%", height: 120, padding: 8, marginBottom: 20 }}
        />

        <button type="submit" style={{ padding: 10, fontSize: 16 }}>
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
