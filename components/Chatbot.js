// Detect REAL user questions so the script does NOT move forward
const askingQuestion =
  userText.includes("?") ||
  userText.toLowerCase().includes("explain") ||
  userText.toLowerCase().includes("what is") ||
  userText.toLowerCase().includes("what are") ||
  userText.toLowerCase().includes("tell me") ||
  userText.toLowerCase().includes("help me understand") ||
  userText.toLowerCase().includes("define") ||
  userText.toLowerCase().includes("explanation");
