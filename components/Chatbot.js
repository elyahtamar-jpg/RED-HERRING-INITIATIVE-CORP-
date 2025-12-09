"use client";

import { useState, useEffect, useRef } from "react";
import { speakText, startRecognition } from "../utils/speech";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const chatRef = useRef(null);

  const questions = [
    "Hello, I am Helyah, your Red Herring Intake Assistant. What is your full name?",
    "Please describe the incident you are reporting.",
    "Which agency or officer was involved?",
    "What was the date of the incident?",
    "Where did the incident occur?",
    "Do you believe your civil rights were violated under 18 USC 242?",
    "Do you have evidence such as photos, witnesses, or documents?",
    "What is your phone number so a director can contact you?",
    "What is your email address?",
    "Would you like a live director to call you immediately?"
  ];

  // Scroll chat automatically
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Start with question 1
  useEffect(() => {
    addBot(questions[0]);
  }, []);

  function addBot(text) {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
    speakText(text);
  }

  function addUser(text) {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    addUser(userMsg);

    setIsThinking(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          userInput: userMsg,
          currentQuestion: questions[questionIndex]
        })
      });

      const data = await res.json();
      const aiReply = data.reply || "I'm here — please continue.";

      addBot(aiReply);

      // Move to next question
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);

        setTimeout(() => {
          addBot(questions[questionIndex + 1]);
        }, 800);
      }

    } catch (err) {
      addBot("There was an error processing your request.");
    }

    setIsThinking(false);
  }

  // Voice input handler
  function startVoice() {
    startRecognition((text) => {
      setInput(text);
      speakText("You said: " + text);
    });
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: 20 }}>
      <h2>Red Herring Initiative – Complaint Intake</h2>

      <div
        ref={chatRef}
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "8px",
          background: "#fafafa",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{msg.sender === "bot" ? "Helyah:" : "You:"}</b> {msg.text}
          </div>
        ))}

        {isThinking && (
          <div><i>Helyah is thinking…</i></div>
        )}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response…"
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 18px",
            background: "#d10000",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Send
        </button>

        <button
          onClick={startVoice}
          style={{
            padding: "10px 18px",
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          🎤
        </button>
      </div>
    </div>
  );
}
