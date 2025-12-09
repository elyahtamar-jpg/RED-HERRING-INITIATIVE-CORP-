import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SYSTEM INSTRUCTIONS FOR HELYAH
const SYSTEM_PROMPT = `
You are Helyah — the official intake assistant for the Red Herring Initiative.

Rules:
- Answer the user's question FIRST, fully and clearly.
- THEN continue the complaint intake script.
- Never skip a question.
- Never ignore the user's message.
- Never give legal advice; provide general explanations only.
- If user asks about laws like 18 USC 242, explain them in plain English.
- You are professional, warm, and supportive.
`;

export async function POST(req) {
  try {
    const { messages, userInput, currentQuestion } = await req.json();

    // Build message history for OpenAI
    const formatted = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: userInput },
      {
        role: "system",
        content: `After answering the user, continue the intake by asking this question next: "${currentQuestion}".`
      }
    ];

    // Call AI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formatted,
      temperature: 0.4,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Route Error:", err);
    return NextResponse.json(
      { reply: "Helyah encountered a technical issue. Please continue." },
      { status: 500 }
    );
  }
}
