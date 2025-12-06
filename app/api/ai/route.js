import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Helyah’s behavior rules ---
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.
Your tasks:
1. Always answer the user's question directly & clearly.
2. Do NOT skip or ignore questions.
3. After answering, allow the system to continue to the next intake question.
4. Do not give legal advice, but you may provide general explanations (e.g., 18 USC 242).
5. Keep responses simple, supportive, and professional.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    // Format conversation for OpenAI
    const formatted = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      {
        role: "system",
        content: `The next scripted intake question is: "${currentQuestion}". 
Answer the user's input first, THEN smoothly allow the intake process to continue.`,
      },
    ];

    // Ask OpenAI for completion
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formatted,
      temperature: 0.4,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI ROUTE ERROR:", err);
    return NextResponse.json(
      {
        reply:
          "I’m sorry — I had trouble processing that. Please continue and I will assist.",
      },
      { status: 500 }
    );
  }
}
