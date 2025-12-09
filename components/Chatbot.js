"use client";

import { useState, useEffect, useRef } from "react";
import { speakText, startRecognition } from "@/utils/speech";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const chatRef = useRef(null);

  // Scripted questions
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

  // Start conversation
  useEffect(() => {
    addBot(questions[0]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Add bot message
  function addBot(text) {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
    speakText(text);
  }

  // Add user message
  function addUser(text) {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  }

  // Handle send
  async function handleSend() {
    if (!input.trim()) return;

    const userText = input.trim();
    addUser(userText);
    setInput("");

    setIsThinking(true);

    // Send user question + history to AI
    let aiReply = null;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, { sender: "user", text: userText }],
          currentQuestion: questions[questionIndex]
        })
      });

      const data = await res.json();
      aiReply = data.reply;
    } catch (e) {
      aiReply = "I’m sorry, I had trouble responding. Please continue.";
    }

    setIsThinking(false);
    addBot(aiReply);

    // MOVE TO NEXT QUESTION
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length && !userText.endsWith("?")) {
      setQuestionIndex(nextIndex);
      setTimeout(() => addBot(questions[nextIndex]), 600);
    }
  }

  // Microphone
  function handleMic() {
    startRecognition((text) => setInput(text));
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Red Herring Initiative – Complaint Intake</h2>

      <div
        ref={chatRef}
        style={{
          height: 400,
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{ textAlign: m.sender === "user" ? "right" : "left" }}
          >
            <b>{m.sender === "user" ? "You: " : "Helyah: "}</b>
            {m.text}
          </div>
        ))}

        {isThinking && <div><i>Helyah is thinking…</i></div>}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response…"
          style={{ flex: 1, padding: 10 }}
        />

        <button onClick={handleSend}>Send</button>
        <button onClick={handleMic}>🎤</button>
      </div>
    </div>
  );
}
