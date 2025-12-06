import OpenAI from "openai";

export const runtime = "edge";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, currentQuestion } = body;

    const history = messages
      .map(m => `${m.sender === "user" ? "User" : "Helyah"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are HELYAH, the official AI Intake Agent for the Red Herring Initiative Civil Justice Advocacy Corporation.

Your job:
- Answer questions clearly.
- Provide guidance when the user is confused.
- Help them understand legal terms (without giving legal advice).
- ALWAYS stay respectful and calm.
- If the user asks something unrelated, redirect gently.
- If the user is answering an intake question, acknowledge it.

Conversation so far:
${history}

Current scripted intake question:
"${currentQuestion}"

Respond as HELYAH in a short, clear message.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are HELYAH, a helpful intake assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.4,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "I'm here to help. Please continue.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI ROUTE ERROR:", error);

    return new Response(
      JSON.stringify({ reply: "I'm sorry, something went wrong with the AI system." }),
      { status: 500 }
    );
  }
}
