<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Red Herring Initiative – Confidential Intake</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />

<style>
body {
  font-family: system-ui, Arial, sans-serif;
  background: #0b0b0b;
  color: #fff;
  margin: 0;
  padding: 20px;
}
h1 {
  color: #e10600;
}
#chat {
  max-width: 800px;
  margin: auto;
  background: #111;
  padding: 20px;
  border-radius: 8px;
}
.message {
  margin-bottom: 12px;
}
.bot {
  color: #ffb3b3;
}
.user {
  color: #cce0ff;
}
input, button {
  padding: 10px;
  font-size: 16px;
}
#inputArea {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
button {
  background: #e10600;
  color: #fff;
  border: none;
  cursor: pointer;
}
button:hover {
  background: #ff2b2b;
}
.notice {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 10px;
}
</style>
</head>

<body>

<div id="chat">
  <h1>Confidential Complaint Intake</h1>

  <div class="notice">
    🔒 This intake is confidential. Information entered here is protected and
    is not shared publicly. This system will not disclose other complaints,
    internal security details, or private organizational information.
  </div>

  <div id="messages"></div>

  <div id="inputArea">
    <input id="userInput" placeholder="Type your response…" style="flex:1" />
    <button onclick="send()">Send</button>
  </div>
</div>

<script>
/* ===============================
   CONFIDENTIALITY & SECURITY RULES
   ===============================

   - This chatbot SHALL NOT disclose:
     • Any other person's data
     • Organizational security details
     • Internal systems or storage methods
   - Legal/statute explanations are allowed ONLY AFTER intake completion
   - All stored data is local-only (browser scoped)
*/

const questions = [
  "Hello, I am Helyah, your Red Herring Intake Assistant. What is your full name?",
  "Please describe the incident you are reporting.",
  "Which agency or officer was involved?",
  "What was the date of the incident?",
  "Where did the incident occur?",
  "Do you believe your civil rights were violated?",
  "Do you have any evidence such as photos, witnesses, or documents?",
  "What is your phone number?",
  "What is your email address?",
  "Would you like a director to contact you immediately?"
];

let step = 0;
let intakeComplete = false;

const complaintId = "RH-" + Date.now();
let record = { complaintId };

/* UI helpers */
function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = "message " + cls;
  div.innerText = text;
  document.getElementById("messages").appendChild(div);
  div.scrollIntoView();
}

/* Initial message */
addMessage("Helyah: " + questions[0], "bot");

function send() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage("You: " + text, "user");
  input.value = "";

  /* Intake phase */
  if (!intakeComplete) {
    record["q" + step] = text;
    step++;

    if (step < questions.length) {
      addMessage("Helyah: " + questions[step], "bot");
    } else {
      intakeComplete = true;

      /* Secure local storage */
      localStorage.setItem(
        "redHerringComplaint_" + complaintId,
        JSON.stringify(record)
      );

      addMessage(
        "Helyah: Thank you. Your complaint has been securely recorded. " +
        "A director will review it. You may now ask general informational questions.",
        "bot"
      );
    }
    return;
  }

  /* Post-intake informational mode */
  handlePostIntakeQuestion(text);
}

function handlePostIntakeQuestion(text) {
  const lower = text.toLowerCase();

  if (lower.includes("18 usc 242")) {
    addMessage(
      "Helyah: 18 U.S.C. § 242 is a federal civil rights statute that makes it a crime " +
      "for a person acting under color of law to willfully deprive someone of rights " +
      "protected by the Constitution or federal law. This is general information, not legal advice.",
      "bot"
    );
    return;
  }

  addMessage(
    "Helyah: I can provide general information, but I cannot give legal advice or " +
    "discuss internal organizational security matters.",
    "bot"
  );
}
</script>

</body>
  </html>
