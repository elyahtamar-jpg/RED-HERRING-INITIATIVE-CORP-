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
    "What is your phone number?",
    "What is your email address?",
    "Would you like a live director to call you immediately?"
  ];

  useEffect(() => {
    addBot(questions[0]);
  }, []);

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

  function userAskedQuestion(text) {
    const q = text.trim().toLowerCase();
    return (
      q.startsWith("what") ||
      q.startsWith("why") ||
      q.startsWith("how") ||
      q.startsWith("when") ||
      q.startsWith("where") ||
      q.endsWith("?")
    );
  }

  async function handleSend() {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    addUser(userText);
    setInput("");

    const isUserQuestion = userAskedQuestion(userText);
    setIsThinking(true);

    let aiReply = null;
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          userText,
          currentQuestion: questions[questionIndex],
        }),
      });

      const data = await res.json();
      aiReply = data.reply || null;
    } catch {
      aiReply = "I'm sorry, something went wrong. Please continue.";
    }

    setIsThinking(false);

    if (aiReply) addBot(aiReply);

    // If user asked a real question → DO NOT move forward
    if (isUserQuestion) return;

    // Continue with next scripted intake question
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      setTimeout(() => addBot(questions[nextIndex]), 900);
    } else {
      setTimeout(
        () =>
          addBot(
            "Thank you. Your complaint has been submitted. A director may contact you."
          ),
        900
      );
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
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              marginBottom: 4,
            }}
          >
            <b>{m.sender === "user" ? "You:" : "Helyah:"}</b> {m.text}
          </div>
        ))}

        {isThinking && (
          <div style={{ fontStyle: "italic", color: "gray" }}>
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
        />

        <button onClick={handleSend} style={{ padding: "12px" }}>
          Send
        </button>

        <button onClick={handleMic} style={{ padding: "12px" }}>
          🎤
        </button>
      </div>
    </div>
  );
}
