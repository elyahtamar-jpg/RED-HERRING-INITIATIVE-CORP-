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

  // Auto-scroll chat window
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
        aiReply = data.reply;
      }
    } catch (err) {
      aiReply = "I apologize — I had trouble processing that.";
    }

    setIsThinking(false);

    if (aiReply) {
      addBot(aiReply);
    }

    // If the user asked a question, DO NOT move to next intake question
    const isQuestion = userText.endsWith("?") ||
      userText.toLowerCase().startsWith("what") ||
      userText.toLowerCase().startsWith("why") ||
      userText.toLowerCase().startsWith("how") ||
      userText.toLowerCase().startsWith("when") ||
      userText.toLowerCase().startsWith("where");

    if (isQuestion) return;

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    if (nextIndex < questions.length) {
      addBot(questions[nextIndex]);
    } else {
      addBot("Thank you. Your complaint has been submitted.");
    }
  }

  function handleMic() {
    if (isThinking) return;
    startRecognition(text => setInput(text));
  }

  return (
    <div>
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
          <div style={{ fontStyle: "italic", marginTop: 5 }}>
            Helyah is thinking…
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response…"
          style={{ flex: 1, padding: "12px", borderRadius: "8px" }}
        />

        <button onClick={handleSend}>Send</button>
        <button onClick={handleMic}>🎤</button>
      </div>
    </div>
  );
}
