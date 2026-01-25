import dynamic from "next/dynamic";

const HelyahBot = dynamic(() => import("../components/HelyahBot"), { ssr: false });

export default function Complaint() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Complaint Intake</h1>
      <HelyahBot />
    </div>
  );
}
      speak(finalMsg);

      await fetch("/api/complaint/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAnswers),
      });
    }
  };

  /* ---------------- START VOICE (USER TAP REQUIRED) ---------------- */
  const startVoice = () => {
    if (!recognitionRef.current) return;
    setVoiceEnabled(true);
    recognitionRef.current.start();
  };

  /* ---------------- INITIAL GREETING ---------------- */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { sender: "bot", text: "Hello, I am Helyah." },
        { sender: "bot", text: questions[0] },
      ]);
      speak("Hello, I am Helyah.");
      speak(questions[0]);
    }
  }, []);

  return (
    <div style={{ color: "white" }}>
      {messages.map((m, i) => (
        <p key={i}>
          <strong>{m.sender === "user" ? "You" : "Helyah"}:</strong>{" "}
          {m.text}
        </p>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your answer…"
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={send}>Send</button>

      <button onClick={startVoice}>
        🎤 {voiceEnabled ? "Voice Enabled" : "Enable Voice Mode"}
      </button>
    </div>
  );
}
