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

  // Auto-scroll chat window
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Ask question 1 on load
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
      { sender: "user", text: userText }
    ];

    // Detect if user is asking a question
    const askingQuestion =
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
          currentQuestion: questions[questionIndex] || ""
        })
      });

      if (res.ok) {
        const data = await res.json();
        aiReply = data.reply || null;
      }
    } catch (err) {
      console.error("AI error:", err);
      aiReply = "I'm sorry — I couldn't process that. Please continue.";
    }

    setIsThinking(false);

    if (aiReply) {
      addBot(aiReply);
    }

    // If the user asked a question
