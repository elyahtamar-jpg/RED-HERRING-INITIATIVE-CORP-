import { NextResponse } from "next/server";
import OpenAI from "openai";

// Connect to OpenAI with your Vercel environment variable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah’s personality + rules
const SYSTEM_PROMPT = `
You are Helyah, a smart, calm, respectful intake assistant for the Red Herring Initiative.
Your duties:
- Always answer the user's question FIRST with accurate plain-language information.
- Do NOT skip the user's question.
- You may explain basic legal concepts (ex: 18 USC 242) but DO NOT give legal advice.
- After answering, politely allow the scripted intake to continue.
- Keep responses short, clear, and supportive.
`;

export async function POST(req) {
  try {
    const { messages, userText, currentQuestion, isQuestion } = await req.json();

    const history = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: userText },
    ];

    // AI reply
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.4,
      max_tokens: 300,
    });

    let reply = completion.choices[0].message.content.trim();

    // If user did NOT ask a question, we append the next scripted intake question
    if (!isQuestion && currentQuestion) {
      reply += `\n\n${currentQuestion}`;
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Route Error:", err);

    return NextResponse.json(
      {
        reply:
          "I'm sorry — I had trouble processing that. Please continue, and I will assist.",
      },
      { status: 500 }
    );
  }
}
