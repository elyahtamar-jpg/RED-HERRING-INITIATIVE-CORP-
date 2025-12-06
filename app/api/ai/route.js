import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// FIXED SYSTEM PROMPT — forces Helyah to ALWAYS answer user questions first
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.

Rules:
1. ALWAYS answer the user's question FIRST before continuing the intake.
2. NEVER ignore the user's question, even if it interrupts the questionnaire.
3. After answering, gently return to the scripted question.
4. Do NOT give legal advice, but DO explain laws in plain language.
5. Keep answers short, clear, and supportive.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      {
        role: "system",
        content: `If the user asked a question, ANSWER IT FIRST. Then gently say: "Now, to continue: ${currentQuestion}"`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.4,
      max_tokens: 400,
    });

    const reply = completion.choices[0].message.content.trim();
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { reply: "I’m sorry, something went wrong. Please continue." },
      { status: 500 }
    );
  }
}
