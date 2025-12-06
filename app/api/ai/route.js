import OpenAI from "openai";

export const runtime = "edge";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages, currentQuestion } = await req.json();

    // Build conversation into OpenAI format
    const formattedMessages = messages.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // Add system instructions for Helyah
    formattedMessages.unshift({
      role: "system",
      content: `
You are HELYAH, the official intake assistant for the Red Herring Initiative.
You:
- Answer user questions clearly.
- Provide helpful explanations.
- DO NOT skip the user's question.
- After answering, stay focused on civil rights, misconduct, and complaint intake.
- Keep responses short unless the user asks for detail.
`
    });

    // Current question context
    if (currentQuestion) {
      formattedMessages.push({
        role: "assistant",
        content: `The next scripted question is: "${currentQuestion}".`,
      });
    }

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      max_tokens: 150,
      temperature: 0.4
    });

    const reply = completion.choices[0].message.content.trim();

    return Response.json({ reply });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);
    return Response.json({ reply: "Helyah encountered an error while responding." });
  }
}
