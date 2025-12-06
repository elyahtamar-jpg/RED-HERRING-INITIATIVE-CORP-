import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ⭐ Helyah's personality + intake purpose
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.
Your job:
- Answer ANY question the user asks (legal explanation, definitions, guidance).
- Keep answers simple, accurate, supportive, and professional.
- ONLY after answering, allow the script to continue to the next intake question.
- Do NOT give legal advice. Provide general information only.
- Never ignore questions. Always respond meaningfully.
- If user asks about 18 USC 242, give a clear plain-language explanation.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    // Convert history to OpenAI format
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      {
        role: "system",
        content: `The scripted intake question the assistant will ask next is: "${currentQuestion}"`,
      },
    ];

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.5,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      {
        reply:
          "I'm sorry — I had trouble processing that. Please continue your complaint and I will assist.",
      },
      { status: 500 }
    );
  }
}
