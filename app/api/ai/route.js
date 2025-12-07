import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for The Red Herring Initiative.
- Always answer the user's question first.
- After answering, allow the scripted intake to continue.
- Never ignore a question.
- Provide plain-language explanations.
- If asked about 18 USC 242, explain clearly and simply.
- Do not give legal advice; provide general information only.
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
        content: `The next scripted intake question is: "${currentQuestion}".`,
      },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.4,
      max_tokens: 250,
    });

    const reply = response.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Route Error:", err);
    return NextResponse.json(
      { reply: "I'm sorry, something went wrong. Please continue." },
      { status: 500 }
    );
  }
}
