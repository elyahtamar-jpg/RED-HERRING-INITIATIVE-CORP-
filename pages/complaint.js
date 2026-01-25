"use client";

import { useState, useEffect, useRef } from "react";

export default function HelyahBot() {
  const questions = [
    "What is your full name?",
    "What is your phone number?",
    "Which division is this complaint for?",
    "Describe what happened.",
    "Was a government official involved?",
    "When did the incident occur?",
    "Where did this occur?",
    "Do you believe your rights under 18 USC 242 were violated?",
    "Do you have evidence?",
    "Do you want a live director to call you?",
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const recognitionRef = useRef(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  /* ---------------- TEXT TO SPEECH ---------------- */
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  /* ---------------- INIT SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false; // ✅ REQUIRED FOR ANDROID

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  /* ---------------- SEND ANSWER ---------------- */
  const send = async () => {
    if (!input.trim()) return;

    const updatedAnswers = {
      ...answers,
      [questions[step]]: input,
    };

    setMessages((m) => [...m, { sender: "user", text: input }]);
    setAnswers(updatedAnswers);
    setInput("");

    const next = step + 1;
    setStep(next);

    if (next < questions.length) {
      const nextQ = questions[next];
      setMessages((m) => [...m, { sender: "bot", text: nextQ }]);
      speak(nextQ);
    } else {
      const finalMsg =
        "Thank you. Your complaint has been recorded for review.";
      setMessages((m) => [...m, { sender: "bot", text: finalMsg }]);
      speak(finalMsg);

      await fetch("/api/complaint/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAnswers),
      });
    }
  };

  /* ---------------- START VOICE (USER TAP REQUIRED) ---------------- */
  const startVoice = () => {
    if (!recognitionRef.current) return;
    setVoiceEnabled(true);
    recognitionRef.current.start();
  };

  /* ---------------- INITIAL GREETING ---------------- */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { sender: "bot", text: "Hello, I am Helyah." },
        { sender: "bot", text: questions[0] },
      ]);
      speak("Hello, I am Helyah.");
      speak(questions[0]);
    }
  }, []);

  return (
    <div style={{ color: "white" }}>
      {messages.map((m, i) => (
        <p key={i}>
          <strong>{m.sender === "user" ? "You" : "Helyah"}:</strong>{" "}
          {m.text}
        </p>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your answer…"
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={send}>Send</button>

      <button onClick={startVoice}>
        🎤 {voiceEnabled ? "Voice Enabled" : "Enable Voice Mode"}
      </button>
    </div>
  );
}
