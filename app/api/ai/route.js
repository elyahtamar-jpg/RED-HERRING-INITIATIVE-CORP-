import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah personality + required behavior
const SYSTEM_PROMPT = `
You are Helyah, the official intake assistant for the Red Herring Initiative.
Rules:
1. Always answer the user's question fully and clearly.
2. NEVER skip their question.
3. AFTER answering, continue the scripted intake question flow.
4. Keep your tone professional, helpful, and calm.
5. Do NOT give legal advice — only general informational explanations.
6. If user asks about 18 USC 242, explain it in simple, plain language.
7. Never ignore or redirect a question.
`;

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    // Combine history into OpenAI format
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      })),
      {
        role: "system",
        content: `After answering the user's question, you MUST also ask this next scripted intake question: "${currentQuestion}".`
      }
    ];

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      max_tokens: 300,
      temperature: 0.4
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      {
        reply:
          "I’m sorry — I had trouble processing that. Please continue and I will assist."
      },
      { status: 500 }
    );
  }
}
