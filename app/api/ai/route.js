import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 Helyah's personality + instructions
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant of the Red Herring Initiative.

RULES:
- You ALWAYS answer the user’s question first.
- You NEVER ignore the user’s question.
- After answering, keep responses short.
- DO NOT skip ahead in the scripted questions.
- DO NOT give legal advice — only general information.
- If the user asks about 18 USC 242, give a simple clear explanation.
- Tone: professional, supportive, and direct.

After answering, wait for the system to give the next question.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    const history = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // Add system instructions + current scripted question
    const finalMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      {
        role: "system",
        content: `After answering the user's last question, smoothly transition back toward this intake question: "${currentQuestion}". Do NOT skip ahead.`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: finalMessages,
      temperature: 0.4,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Error:", err);
    return NextResponse.json(
      {
        reply:
          "I’m sorry — I had trouble processing your message. Please continue.",
      },
      { status: 500 }
    );
  }
}
