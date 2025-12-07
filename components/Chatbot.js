"use client";

import { useState, useEffect, useRef } from "react";
import { speakText, startRecognition } from "@/utils/speech";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);

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

  // auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // first bot message
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

  async function handleSend() {
    if (!input.trim() || isAIThinking) return;

    const userText = input.trim();
    setInput("");
    addUser(userText);

    // detect REAL QUESTION asked by user
    const isRealQuestion =
      userText.endsWith("?") ||
      userText.toLowerCase().startsWith("what") ||
      userText.toLowerCase().startsWith("why") ||
      userText.toLowerCase().startsWith("how") ||
      userText.toLowerCase().startsWith("when") ||
      userText.toLowerCase().startsWith("where") ||
      userText.toLowerCase().startsWith("explain");

    // build message history for AI
    const conversation = [
      ...messages,
      { sender: "user", text: userText },
    ];

    setIsAIThinking(true);
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
        aiReply = data.reply;
      }
    } catch (err) {
      console.error("AI ERROR:", err);
      aiReply = "I’m having trouble responding right now.";
    }

    setIsAIThinking(false);

    if (aiReply) addBot(aiReply);

    // STOP scripted questions if user asked a real question
    if (isRealQuestion) return;

    // move forward in question script
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    if (nextIndex < questions.length) {
      setTimeout(() => addBot(questions[nextIndex]), 800);
    } else {
      setTimeout(() => {
        addBot("Thank you. Your complaint has been submitted to the Red Herring Initiative.");
      }, 800);
    }
  }

  function handleMic() {
    if (isAIThinking) return;
    startRecognition((txt) => setInput(txt));
  }

  return (
    <div>
      <h2>Red Herring Initiative – Complaint Intake</h2>

      <div
        ref={chatRef}
        style={{
          height: "400px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "12px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left" }}>
            <b>{m.sender === "user" ? "You:" : "Helyah:"}</b> {m.text}
          </div>
        ))}

        {isAIThinking && (
          <div style={{ fontStyle: "italic" }}>Helyah is thinking…</div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #aaa" }}
          disabled={isAIThinking}
        />

        <button onClick={handleSend} disabled={isAIThinking}>
          Send
        </button>

        <button onClick={handleMic} disabled={isAIThinking}>
          🎤
        </button>
      </div>
    </div>
  );
}
