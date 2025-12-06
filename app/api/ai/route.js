import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah's personality + instructions
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.

Your responsibilities:
- Always answer ANY question the user asks (legal terms, statutes, explanations, definitions, etc.).
- Never skip the user's question.
- After answering, allow the scripted intake question to continue.
- Keep answers clear, calm, professional, and supportive.
- Provide general legal information only (not legal advice).
- When asked about 18 USC 242, give a clear plain-language explanation.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    // Convert message history into OpenAI format
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      {
        role: "system",
        content:
          `After answering the user's question, you may continue the intake with: "${currentQuestion}".`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.4,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      {
        reply:
          "I’m sorry — I had trouble processing that. Please continue, I’m still here with you.",
      },
      { status: 500 }
    );
  }
}
