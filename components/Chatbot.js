"use client";

import { useState, useEffect, useRef } from "react";
import { speakText, startRecognition } from "../utils/speech";

export default function Chatbot() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]);

  async function handleSend() {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");

    // Add user message locally
    const updatedHistory = [
      ...history,
      { role: "user", content: userText },
    ];

    setHistory(updatedHistory);

    // Ask AI
    setIsThinking(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedHistory,
          userInput: userText,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm sorry, I didn't understand.";

      const botMessage = { role: "assistant", content: reply };

      setHistory((prev) => [...prev, botMessage]);
      speakText(reply);

    } catch (err) {
      console.error("AI Chat Error:", err);
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, something went wrong." },
      ]);
    }

    setIsThinking(false);
  }

  function handleMic() {
    if (isThinking) return;
    startRecognition((text) => setInput(text));
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Red Herring Initiative – AI Intake Assistant</h2>

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
        {history.map((m, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            <b>{m.role === "user" ? "You" : "Helyah"}:</b> {m.content}
          </div>
        ))}

        {isThinking && (
          <div style={{ fontStyle: "italic" }}>Helyah is thinking…</div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here…"
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
