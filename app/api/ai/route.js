import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah’s brain + rules
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.

Your duties:
- Answer ANY question the user asks, clearly and in simple language.
- If a question is about law (ex: 18 USC 242), give a clear explanation but NOT legal advice.
- You MUST answer user questions BEFORE continuing with the intake script.
- Stay professional, calm, friendly, and informative.
- Never skip questions. Never ignore what the user asked.
- After answering, you may allow the script to continue.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    // Build formatted conversation for the AI
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      })),
      {
        role: "system",
        content: `The next scripted intake question is: "${currentQuestion}".`
      }
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.4,
      max_tokens: 250
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Route Error:", err);
    return NextResponse.json(
      {
        reply:
          "I'm sorry — I'm having trouble right now. Please continue and I will assist."
      },
      { status: 500 }
    );
  }
}
