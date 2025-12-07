import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---- HELYAH PERSONALITY + RULESET ----
const SYSTEM_PROMPT = `
You are Helyah, the intake assistant for the Red Herring Initiative.
Your job:
- Answer ANY user question clearly and professionally.
- ALWAYS answer their question BEFORE moving on.
- You may explain laws like 18 USC 242 in simple terms.
- Do NOT give legal advice — only general info.
- Stay supportive, calm, and helpful.
- Never ignore a question.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      {
        role: "system",
        content: `Next scripted intake question: "${currentQuestion}"`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      temperature: 0.4,
    });

    const reply = completion.choices[0].message.content.trim();
    return NextResponse.json({ reply });

  } catch (err) {
    console.error("AI ROUTE ERROR:", err);
    return NextResponse.json(
      { reply: "Sorry — I couldn't process that. Please try again." },
      { status: 500 }
    );
  }
}
