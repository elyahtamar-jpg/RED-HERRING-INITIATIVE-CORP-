import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah's personality + rules
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.

Your responsibilities:
- Always answer the user's question FIRST.
- Give clear, simple, accurate explanations.
- If the user asks about laws (like 18 USC 242), explain them plainly.
- Do NOT give legal advice.
- After answering their question, allow the intake to continue.
- Never ignore the user.
- Never skip their question.
`;

export async function POST(req) {
  try {
    const { history, userInput } = await req.json();

    // Build message log for OpenAI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userInput },
    ];

    // AI response
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.5,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI ERROR:", error);
    return NextResponse.json(
      { reply: "I'm sorry — I had trouble responding just now. Please continue." },
      { status: 500 }
    );
  }
}
