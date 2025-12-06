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

  // Start with first question
  useEffect(() => {
    addBot(questions[0]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  function addBot(text) {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
    speakText(text);
  }

  function addUser(text) {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  }

  async function handleSend() {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");
    addUser(userText);

    const askingQuestion =
      userText.endsWith("?") ||
      ["what", "why", "how", "when", "where"].some((q) =>
        userText.toLowerCase().startsWith(q)
      );

    setIsThinking(true);

    // Call backend AI
    let aiReply = null;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userText }),
      });

      if (res.ok) {
        const data = await res.json();
        aiReply = data.reply;
      }
    } catch (err) {
      aiReply = "I'm sorry, I couldn't process that.";
    }

    setIsThinking(false);

    if (aiReply) addBot(aiReply);

    if (askingQuestion) return;

    // Continue scripted intake
    const next = questionIndex + 1;
    setQuestionIndex(next);

    if (next < questions.length) {
      setTimeout(() => addBot(questions[next]), 900);
    } else {
      addBot("Thank you. Your complaint has been submitted.");
    }
  }

  function handleMic() {
    if (isThinking) return;
    startRecognition((text) => setInput(text));
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Red Herring Initiative – Complaint Intake</h2>

      <div
        ref={chatRef}
        style={{
          border: "1px solid #ccc",
          padding: "12px",
          borderRadius: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left" }}>
            <b>{m.sender === "user" ? "You:" : "Helyah:"}</b> {m.text}
          </div>
        ))}

        {isThinking && (
          <div style={{ fontStyle: "italic", marginTop: 4 }}>
            Helyah is thinking…
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #aaa",
          }}
          disabled={isThinking}
        />

        <button onClick={handleSend} disabled={isThinking} style={{ padding: "12px" }}>
          Send
        </button>

        <button onClick={handleMic} disabled={isThinking} style={{ padding: "12px" }}>
          🎤
        </button>
      </div>
    </div>
  );
}
