"use client";
import { useState, useEffect, useRef } from "react";

export default function ComplaintIntake() {

  // 10 Intake Questions
  const questions = [
    "What is your full name?",
    "What is your phone number?",
    "Which division is this complaint for?",
    "Describe what happened.",
    "Was a government official involved?",
    "When did the incident occur?",
    "Where did this occur?",
    "Do you believe your rights under 18 USC 242 were violated?",
    "Do you have evidence?",
    "Do you want a live director to call you?"
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const recognitionRef = useRef(null);
  const [autoListen, setAutoListen] = useState(true);

  // Generate Complaint Number
  const complaintNumber = "RHI-" + Date.now();

  // Text-to-Speech
  const speak = (text, callback = null) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => {
      if (callback) callback();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // Voice recognition (hands-free)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = true;

        recognition.onresult = (event) => {
          const transcript =
            event.results[event.results.length - 1][0].transcript;
          setInput(transcript);

          // auto-send after speaking
          setTimeout(() => send(true), 300);
        };

        recognition.onend = () => {
          if (autoListen) recognition.start();
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setAutoListen(true);
      recognitionRef.current.start();
    }
  };

  // Send Answer
  const send = async (voiceTriggered = false) => {
    if (!voiceTriggered && !input.trim()) return;

    const finalInput = input;

    setMessages((prev) => [...prev, { sender: "user", text: finalInput }]);

    const updated = {
      ...answers,
      [questions[step]]: finalInput,
    };
    setAnswers(updated);
    setInput("");

    const next = step + 1;
    setStep(next);

    // Continue to next question
    if (next < questions.length) {
      const nextQ = questions[next];

      setMessages((prev) => [...prev, { sender: "bot", text: nextQ }]);

      speak(nextQ, () => {
        if (autoListen && recognitionRef.current) {
          recognitionRef.current.start();
        }
      });
    } else {
      // Final Message
      const finalMsg = `Thank you. Your complaint has been recorded. Your complaint number is ${complaintNumber}.`;
      setMessages((prev) => [...prev, { sender: "bot", text: finalMsg }]);
      speak(finalMsg);

      // Save to KV API
      await fetch("/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          complaintNumber,
          ...updated
        })
      });

      if (recognitionRef.current) recognitionRef.current.stop();
    }
  };

  // Start the bot
  useEffect(() => {
    if (messages.length === 0) {
      const greeting =
        "Hello, I am Helyah, The Red Herring Initiative Civil Justice Advocacy Intake Assistant. Before we begin, I must inform you that we are not attorneys or a law firm. We are a nonprofit Civil Justice Advocacy Corporation. Your information is confidential and will be used only for investigative and advocacy purposes.";

      setMessages([
        { sender: "bot", text: greeting },
        { sender: "bot", text: questions[0] }
      ]);

      speak(greeting, () => {
        speak(questions[0], () => {
          if (recognitionRef.current) recognitionRef.current.start();
        });
      });
    }
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto", fontFamily: "Arial" }}>
      <h2>Helyah Intake Assistant</h2>
      <p><strong>Complaint Number:</strong> {complaintNumber}</p>

      <div
        style={{
          padding: 15,
          border: "1px solid #ccc",
          borderRadius: 8,
          minHeight: 200,
          marginBottom: 20,
          background: "#f9f9f9"
        }}
      >
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.sender === "user" ? "You" : "Helyah"}:</strong> {m.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your answer…"
        style={{
          width: "100%",
          padding: 10,
          border: "1px solid #ccc",
          marginBottom: 10
        }}
      />

      <button
        onClick={() => send(false)}
        style={{
          padding: 10,
          width: "100%",
          background: "#333",
          color: "white",
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        Send
      </button>

      <button
        onClick={startListening}
        style={{
          padding: 10,
          width: "100%",
          background: "darkred",
          color: "white",
          borderRadius: 5
        }}
      >
        🎤 Enable Voice Mode
      </button>
    </div>
  );
}
