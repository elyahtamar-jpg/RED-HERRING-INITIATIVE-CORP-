import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, currentQuestion } = body || {};

    const conversationText = (messages || [])
      .map((m) => `${m.sender === "user" ? "User" : "Helyah"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are Helyah, the AI Intake Agent for The Red Herring Initiative Civil Justice Advocacy Corporation in Florida.

Rules:
- Be respectful, calm, and supportive.
- DO NOT give legal advice.
- You CAN explain general concepts like misconduct, civil rights violations, excessive force, and 18 USC 242.
- Respond conversationally to whatever the user says.
- Do NOT ask the next scripted question. The app handles the flow.
- Keep responses concise (1–3 sentences).

Current intake question:
"${currentQuestion || ""}"

Conversation so far:
${conversationText}

Respond to the user now.
`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            "AI response unavailable at this time, but your complaint information is still recorded.",
        },
        { status: 200 }
      );
    }

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: prompt },
          {
            role: "user",
            content:
              messages?.length > 0
                ? messages[messages.length - 1].text
                : "Start",
          },
        ],
        temperature: 0.4,
        max_tokens: 180,
      }),
    });

    if (!apiRes.ok) {
      console.error("OpenAI API Error:", await apiRes.text());
      return NextResponse.json(
        { reply: "I’m having trouble responding right now." },
        { status: 200 }
      );
    }

    const data = await apiRes.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Thank you. Your information has been recorded.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("AI Route Error:", err);
    return NextResponse.json(
      {
        reply:
          "Something went wrong processing your message, but your complaint is still recorded.",
      },
      { status: 200 }
    );
  }
}
