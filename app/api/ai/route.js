import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah system instructions
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.

Your responsibilities:
- Answer any question the user asks BEFORE moving on.
- Never skip or ignore questions.
- Keep explanations simple, clear, and correct.
- Provide general legal information, not legal advice.
- If asked about 18 USC 242, explain it plainly.
- Stay supportive and professional.
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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.6,
    });

    const reply = completion.choices[0].message.content.trim();
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI ERROR:", err);
    return NextResponse.json(
      { reply: "Helyah experienced an error, please continue." },
      { status: 500 }
    );
  }
}
