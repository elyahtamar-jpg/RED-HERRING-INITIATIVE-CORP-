import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SYSTEM RULES FOR HELYAH
const SYSTEM_PROMPT = `
You are Helyah, the AI intake assistant for the Red Herring Initiative.
Your job:
- Answer ALL user questions before continuing.
- Give clear, simple explanations.
- You MAY explain laws like 18 USC 242 in plain language.
- You MUST NOT give legal advice or tell users what to file.
- After answering the user, smoothly return to the intake process.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      {
        role: "system",
        content: `If the user asked a question, answer it. Otherwise, guide them toward the next intake question: "${currentQuestion}".`
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
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      {
        reply:
          "I'm sorry, I had trouble processing that. Please continue and I will assist."
      },
      { status: 500 }
    );
  }
}
