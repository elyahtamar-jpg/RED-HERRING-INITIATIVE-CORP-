// Text-to-Speech
export function speakText(text) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;

  window.speechSynthesis.cancel(); // stop overlapping
  window.speechSynthesis.speak(utter);
}

// Speech-to-Text
export function startRecognition(callback) {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    callback("Speech recognition is not supported on this device.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false; // ⬅️ required for Next.js 13
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    callback(text);
  };

  recognition.onerror = () => {
    callback("Audio error. Try again.");
  };

  recognition.start();
}
