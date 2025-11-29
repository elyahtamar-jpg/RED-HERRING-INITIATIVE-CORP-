"use client";
import { useState } from "react";

export default function ComplaintForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintNumber, setComplaintNumber] = useState("");

  const questions = [
    "Your full name?",
    "Your phone number?",
    "Your email address?",
    "Which division does your complaint belong to? (Juvenile, DCF, Corrections, Public Services, Criminal Justice)",
    "Describe the violation in detail.",
    "When did this incident occur?",
    "Where did it occur?",
    "Were there any witnesses?",
    "Do you have evidence? (documents, screenshots, ID numbers, etc.)",
  ];

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Final step — submit
      setLoading(true);

      const finalComplaintNumber =
        "RHI-" + Math.floor(100000 + Math.random() * 900000);

      const payload = {
        complaintNumber: finalComplaintNumber,
        ...answers,
      };

      const res = await fetch("/api/complaint", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      setLoading(false);

      if (res.ok) {
        setComplaintNumber(finalComplaintNumber);
        setSubmitted(true);
      } else {
        alert("Error submitting complaint");
      }
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Complaint Submitted</h1>
        <p>Your complaint number is:</p>
        <h2>{complaintNumber}</h2>
        <p>A director will review it shortly.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>File a Complaint</h1>
      <p>{questions[step]}</p>

      <input
        type="text"
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          marginTop: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
        onChange={(e) =>
          setAnswers({ ...answers, [questions[step]]: e.target.value })
        }
      />

      <button
        onClick={handleNext}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          background: "#d00",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
        }}
      >
        {step === questions.length - 1 ? "Submit Complaint" : "Next"}
      </button>
    </div>
  );
}
