async function handleSend() {
  if (!input.trim() || isThinking) return;

  const userText = input.trim();
  setInput("");
  addUser(userText);

  setIsThinking(true);

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...messages,
          { sender: "user", text: userText }
        ],
        currentQuestion: questions[questionIndex],
      }),
    });

    const data = await res.json();

    if (data.reply) {
      addBot(data.reply);
    }
  } catch (err) {
    console.error("AI Error:", err);
    addBot("I'm sorry — I couldn't process that just now.");
  }

  setIsThinking(false);

  // Move to next scripted question
  const nextIndex = questionIndex + 1;
  setQuestionIndex(nextIndex);

  if (nextIndex < questions.length) {
    setTimeout(() => addBot(questions[nextIndex]), 800);
  } else {
    setTimeout(() => {
      addBot(
        "Thank you. Your complaint has been submitted. A director will review it."
      );
    }, 800);
  }
}
