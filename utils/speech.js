// Text-to-Speech (Helyah speaking)
export function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;   // voice speed
  utter.pitch = 1;  // voice tone
  speechSynthesis.speak(utter);
}

// Speech-to-Text (user microphone input)
export function startRecognition(callback) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recog = new SpeechRecognition();

  recog.lang = "en-US";
  recog.continuous = true;       // 🔥 keeps mic open long-term
  recog.interimResults = false;

  recog.start();

  recog.onresult = (event) => {
    const transcript =
      event.results[event.results.length - 1][0].transcript;
    callback(transcript);
  };

  recog.onerror = () => {
    console.warn("Microphone error occurred");
  };
}
