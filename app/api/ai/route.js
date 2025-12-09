import { NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah's personality + mission
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.

Your responsibilities:
- ALWAYS answer the user's question in simple, clear language.
- DO NOT skip user questions.
- After answering, allow the scripted intake to continue.
- Do NOT give legal advice — only general explanations.
- If asked about 18 USC 242, explain it clearly and simply.
- Stay respectful, supportive, and professional at all times.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    const formatted = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      })),
      { role: "system", content: `The next scripted question is: "${currentQuestion}"` }
    ];

    const ai = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formatted,
      max_tokens: 300,
      temperature: 0.4
    });

    const reply = ai.choices[0].message.content.trim();
    return NextResponse.json({ reply });

  } catch (err) {
    console.error("AI ROUTE ERROR:", err);
    return NextResponse.json(
      { reply: "I'm sorry — there was a temporary issue processing that." },
      { status: 500 }
    );
  }
}
