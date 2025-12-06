import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helyah instructions
const SYSTEM_PROMPT = `
You are Helyah, the intake assistant for the Red Herring Initiative.
You MUST answer the user's question before moving to the next scripted question.
Always respond clearly, respectfully, and briefly.
Do not ignore questions. Provide general information, not legal advice.
If asked about 18 USC 242: Explain it plainly.
`;

export async function POST(req) {
  try {
    const { conversationHistory } = await req.json();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 300,
      messages,
    });

    const reply = completion.choices[0].message.content.trim();
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error);
    return NextResponse.json(
      { reply: "I'm sorry, I had trouble responding. Please continue." },
      { status: 500 }
    );
  }
}
