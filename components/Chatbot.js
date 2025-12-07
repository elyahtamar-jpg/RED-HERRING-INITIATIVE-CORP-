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
    "What is your full name?",
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

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Start intake
  useEffect(() => {
    addBot("Hello, I am Helyah, your Red Herring Intake Assistant.");
    setTimeout(() => addBot(questions[0]), 800);
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

    const isQuestion =
      userText.endsWith("?") ||
      ["what", "why", "how", "when", "where", "can", "should"].some(word =>
        userText.toLowerCase().startsWith(word)
      );

    // Build OpenAI message format
    const history = messages.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    setIsThinking(true);

    // Ask AI
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          userInput: userText,
        }),
      });

      const data = await response.json();
      addBot(data.reply);
    } catch (error) {
      console.error(error);
      addBot("I'm sorry, something went wrong.");
    }

    setIsThinking(false);

    // If the user asked a question → do NOT advance
    if (isQuestion) return;

    // Otherwise continue intake
    const next = questionIndex + 1;
    setQuestionIndex(next);

    if (next < questions.length) {
      setTimeout(() => addBot(questions[next]), 900);
    } else {
      setTimeout(() => addBot("Thank you. Your complaint has been submitted."), 1000);
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
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left" }}>
            <b>{m.sender === "user" ? "You:" : "Helyah:"}</b> {m.text}
          </div>
        ))}

        {isThinking && <div><i>Helyah is thinking…</i></div>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your answer…"
          style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #aaa" }}
          disabled={isThinking}
        />

        <button onClick={handleSend} style={{ padding: 12 }} disabled={isThinking}>
          Send
        </button>

        <button onClick={handleMic} style={{ padding: 12 }} disabled={isThinking}>
          🎤
        </button>
      </div>
    </div>
  );
}
