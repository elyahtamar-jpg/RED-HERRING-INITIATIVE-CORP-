// Text-to-Speech
export function speakText(text) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.cancel(); // avoid overlap
  window.speechSynthesis.speak(utter);
}

// 🔹 Single-shot Speech-to-Text (what you already had)
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

// 🔹 NEW: Continuous Speech-to-Text (for hands-free mode)
export function startContinuousRecognition(onFinalText, onListeningStatus) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onFinalText("Speech recognition not supported on this device.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  let finalText = "";

  recognition.onstart = () => {
    if (onListeningStatus) onListeningStatus(true);
  };

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = 0; i < event.results.length; i++) {
      const res = event.results[i];
      if (res.isFinal) {
        finalText += res[0].transcript + " ";
      } else {
        interim += res[0].transcript;
      }
    }

    if (finalText.trim().length > 0) {
      onFinalText(finalText.trim());
      finalText = "";
    }
  };

  recognition.onend = () => {
    // we let the UI decide whether to restart or not
    if (onListeningStatus) onListeningStatus(false);
  };

  recognition.onerror = () => {
    if (onListeningStatus) onListeningStatus(false);
  };

  recognition.start();
  return recognition;
}

export function stopContinuousRecognition(recognitionInstance) {
  if (recognitionInstance) {
    recognitionInstance.onend = null;
    recognitionInstance.stop();
  }
}
