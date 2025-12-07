import { NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System instructions for Helyah
const SYSTEM_PROMPT = `
You are Helyah, the intelligent intake assistant for the Red Herring Initiative.
Your rules:
- ALWAYS answer the user's question directly, clearly, and in simple English.
- If the user asks about 18 USC 242, explain it plainly.
- Do NOT ignore the user and do NOT skip questions.
- After answering, allow the scripted intake flow to continue.
- You may give general legal information, but NO legal advice.
`;

export async function POST(req) {
  try {
    const { history, userInput } = await req.json();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userInput },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
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
          "I’m sorry — something went wrong processing that. Please continue and I’ll still help.",
      },
      { status: 500 }
    );
  }
}
