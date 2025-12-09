// TEXT → SPEECH
export function speakText(text) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;
  window.speechSynthesis.cancel(); // stop overlap
  window.speechSynthesis.speak(utter);
}

// SPEECH → TEXT
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
  recognition.continuous = false; // listens once per button press
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    callback(text);
  };

  recognition.onerror = () => {
    callback("Sorry, I couldn’t hear that. Try again.");
  };

  recognition.start();
}
