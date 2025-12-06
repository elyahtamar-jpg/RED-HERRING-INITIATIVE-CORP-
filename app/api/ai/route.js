import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, currentQuestion } = body;

    // Build chat history for OpenAI
    const chatMessages = [
      {
        role: "system",
        content: `
You are HELYAH, the official intake assistant for the Red Herring Initiative Corp.
Your job is:
1. Answer ANY question the user asks.
2. Keep responses short and clear.
3. NEVER skip their question.
4. Stay professional, respectful, and helpful.
5. If the user asks about civil rights, law, or agencies, give real explanations.
6. After answering, NEVER ask your own questions — the frontend will handle that.
        `,
      },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 150,
      temperature: 0.4,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I’m sorry — I couldn’t generate a response.";

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (err) {
    console.error("AI Route Error:", err);
    return new Response(JSON.stringify({ reply: "AI processing error." }), {
      status: 500,
    });
  }
}
