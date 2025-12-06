// -------------------------------
//  TEXT-TO-SPEECH
// -------------------------------
export function speakText(text) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

// -------------------------------
//  SINGLE-SHOT SPEECH RECOGNITION
// -------------------------------
export function startRecognition(callback) {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    callback("Speech recognition not supported on this device.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    callback(text);
  };

  recognition.start();
}

// -------------------------------
//  CONTINUOUS SPEECH RECOGNITION
//  (This keeps listening until you press Stop)
// -------------------------------
export function startContinuousRecognition(onText, onStateChange) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onText("Speech recognition not supported.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    onText(text);
  };

  recognition.onstart = () => {
    if (onStateChange) onStateChange(true);
  };

  recognition.onend = () => {
    if (onStateChange) onStateChange(false);
  };

  recognition.start();

  return recognition;
}

// -------------------------------
//  STOP CONTINUOUS RECOGNITION
// -------------------------------
export function stopContinuousRecognition(recognitionInstance) {
  if (!recognitionInstance) return;
  recognitionInstance.stop();
}
