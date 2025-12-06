import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.

Rules:
- Always answer ANY question the user asks before moving on.
- NEVER ignore a question.
- Keep responses simple, accurate, professional, and supportive.
- You may explain general law (including 18 USC 242) but do NOT give legal advice.
- After answering, you may continue with intake only if the user is NOT asking a question.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion, isQuestion } = await req.json();

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    if (!isQuestion && currentQuestion) {
      formattedMessages.push({
        role: "system",
        content: `Next scripted intake question: "${currentQuestion}"`,
      });
    }

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
      { reply: "I’m sorry, something went wrong. Please continue." },
      { status: 500 }
    );
  }
}
