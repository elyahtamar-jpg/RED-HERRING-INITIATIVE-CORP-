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

  function addBot(text) {
    setMessages(prev => [...prev, { sender: "bot", text }]);
    speakText(text);
  }

  function addUser(text) {
    setMessages(prev => [...prev, { sender: "user", text }]);
  }

  // Detect if user asked a question (so Helyah must answer it)
  function userAskedQuestion(text) {
    const t = text.toLowerCase();
    return (
      t.endsWith("?") ||
      t.startsWith("what") ||
      t.startsWith("why") ||
      t.startsWith("how") ||
      t.startsWith("when") ||
      t.startsWith("where") ||
      t.includes("explain")
    );
  }

  async function handleSend() {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");
    addUser(userText);

    const userAsked = userAskedQuestion(userText);

    // Send to AI route
    setIsThinking(true);

    let reply = null;
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          userText,
          currentQuestion: questions[questionIndex] || "",
          isQuestion: userAsked
        })
      });

      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
      }
    } catch (e) {
      reply = "I'm sorry, I had trouble responding. Please continue.";
    }

    setIsThinking(false);

    if (reply) {
      addBot(reply);
    }

    // Stop here if user asked a question
    if (userAsked) return;

    // Move to next intake question
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    if (nextIndex < questions.length) {
      setTimeout(() => addBot(questions[nextIndex]), 900);
    } else {
      setTimeout(() => {
        addBot("Thank you. Your complaint has been submitted. A director may contact you soon.");
      }, 900);
    }
  }

  function handleMic() {
    if (isThinking) return;
    startRecognition(text => setInput(text));
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Red Herring Initiative – Complaint Intake</h2>

      <div
        ref={chatRef}
        style={{
          border: "1px solid #ccc",
          padding: 12,
          height: 400,
          overflowY: "scroll",
          borderRadius: 10,
          marginBottom: 10
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              marginBottom: 6
            }}
          >
            <b>{m.sender === "user" ? "You:" : "Helyah:"}</b> {m.text}
          </div>
        ))}

        {isThinking && (
          <div style={{ fontStyle: "italic", marginTop: 6 }}>
            Helyah is thinking…
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your answer..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #aaa"
          }}
        />

        <button onClick={handleSend} style={{ padding: 12 }}>
          Send
        </button>

        <button onClick={handleMic} style={{ padding: 12 }}>
          🎤
        </button>
      </div>
    </div>
  );
}
