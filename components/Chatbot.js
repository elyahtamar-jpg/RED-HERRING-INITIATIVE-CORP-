"use client";

import { useState, useEffect, useRef } from "react";
import { speakText, startRecognition } from "@/utils/speech";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const chatRef = useRef(null);

  // All intake questions
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

  // Auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Start with first question
  useEffect(() => {
    addBot(questions[0]);
  }, []);

  // Add bot message
  function addBot(text) {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
    speakText(text);
  }

  // Add user message
  function addUser(text) {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  }

  // AI question detection
  function userIsAsking(text) {
    const lower = text.toLowerCase();

    const triggers = [
      "what", "why", "how", "when", "where",
      "explain", "tell me", "help me",
      "can you", "could you", "should i", "what do i do",
      "definition", "meaning"
    ];

    return triggers.some(t => lower.includes(t)) || text.endsWith("?");
  }

  // Handle Send
  async function handleSend() {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");
    addUser(userText);

    const askingAI = userIsAsking(userText);

    // Build conversation history
    const conversation = [
      ...messages,
      { sender: "user", text: userText }
    ];

    // If user asks a REAL question → AI must answer BEFORE going on
    if (askingAI) {
      setIsThinking(true);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversation,
            currentQuestion: questions[questionIndex]
          })
        });

        const data = await res.json();
        addBot(data.reply || "I'm here to help.");

      } catch (err) {
        addBot("I'm sorry, I couldn't process that right now.");
      }

      setIsThinking(false);
      return; // ❗ Stop here, do NOT move to next intake question
    }

    // Otherwise follow scripted intake
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    if (nextIndex < questions.length) {
      setTimeout(() => addBot(questions[nextIndex]), 900);
    } else {
      addBot("Thank you. Your complaint has been submitted. A director may contact you after review.");
    }
  }

  // Speech Recognition
  function handleMic() {
    if (isThinking) return;
    startRecognition((transcript) => setInput(transcript));
  }

  // UI
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
          marginBottom: "10px"
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left", marginBottom: 6 }}>
            <b>{m.sender === "user" ? "You:" : "Helyah:"}</b> {m.text}
          </div>
        ))}

        {isThinking && (
          <div style={{ fontStyle: "italic" }}>
            Helyah is thinking…
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          disabled={isThinking}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #aaa"
          }}
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
