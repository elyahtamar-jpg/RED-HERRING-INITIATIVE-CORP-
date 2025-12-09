"use client";

import { useState, useEffect, useRef } from "react";
import { speakText, startRecognition } from "@/utils/speech";

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

  // Scroll chat window
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Start with first question
  useEffect(() => {
    addBot(questions[0]);
  }, []);

  function addBot(text) {
    setMessages(prev => [...prev, { sender: "bot", text }]);
    speakText(text);
  }

  function addUser(text) {
    setMessages(prev => [...prev, { sender: "user", text }]);
  }

  async function handleSend() {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");
    addUser(userText);

    const conversation = [
      ...messages,
      { sender: "user", text: userText },
    ];

    const isARealQuestion =
      userText.endsWith("?") ||
      userText.toLowerCase().startsWith("what") ||
      userText.toLowerCase().startsWith("why") ||
      userText.toLowerCase().startsWith("how") ||
      userText.toLowerCase().startsWith("when") ||
      userText.toLowerCase().startsWith("where");

    setIsThinking(true);
    let aiReply = null;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation,
          currentQuestion: questions[questionIndex] || "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        aiReply = data.reply || null;
      }
    } catch (err) {
      console.error("AI Error:", err);
      aiReply = "Something went wrong, but your complaint is still recorded.";
    }

    setIsThinking(false);

    // If AI responded, show it BEFORE continuing the script
    if (aiReply) addBot(aiReply);

    // If user asked a real question → STOP script until user continues
    if (isARealQuestion) return;

    // Continue scripted intake
    const next = questionIndex + 1;
    setQuestionIndex(next);

    if (next < questions.length) {
      setTimeout(() => addBot(questions[next]), 800);
    } else {
      setTimeout(() => {
        addBot("Thank you. Your complaint has been submitted to the Red Herring Initiative.");
      }, 800);
    }
  }

  function handleMic() {
    if (isThinking) return;
    startRecognition(text => setInput(text));
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
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left", marginBottom: 4 }}>
            <b>{m.sender === "user" ? "You:" : "Helyah:"}</b> {m.text}
          </div>
        ))}

        {isThinking && (
          <div style={{ fontStyle: "italic", marginTop: 4 }}>Helyah is thinking…</div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your answer…"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #aaa",
          }}
          disabled={isThinking}
        />

        <button onClick={handleSend} style={{ padding: "12px" }} disabled={isThinking}>
          Send
        </button>

        <button onClick={handleMic} style={{ padding: "12px" }} disabled={isThinking}>
          🎤
        </button>
      </div>
    </div>
  );
}
