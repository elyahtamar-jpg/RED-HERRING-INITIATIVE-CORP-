import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.
Your goals:
- Answer the user's questions clearly and simply.
- Never ignore what the user asks.
- After answering, smoothly continue the intake process.
- Do NOT give legal advice; only provide general explanations.
- If asked about 18 USC 242, explain it in plain English.
`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.4,
      max_tokens: 250,
    });

    const reply = result.choices[0].message.content || "I'm here. Please continue.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { reply: "I’m sorry — something went wrong. Please continue your intake." },
      { status: 500 }
    );
  }
}
