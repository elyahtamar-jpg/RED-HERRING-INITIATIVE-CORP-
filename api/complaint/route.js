import { kv } from "@upstash/redis";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function generateCaseNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `RHI-${year}-${rand}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, complaint } = body;

    const evaluation = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a civil rights intake analyst.
Determine if the complaint meets ALL elements of 18 U.S.C. § 242:
1. Actor was acting under color of law
2. Willful deprivation of constitutional rights
3. Identifiable victim
4. Specific conduct (not general dissatisfaction)

Respond ONLY in JSON:
{
  "qualifies": true/false,
  "reason": "short explanation",
  "division": "Corrections | Juvenile | DCF | Public Services | Governmental"
}
`
        },
        { role: "user", content: complaint }
      ]
    });

    const result = JSON.parse(evaluation.choices[0].message.content);

    if (!result.qualifies) {
      return Response.json({
        status: "rejected",
        reason: result.reason,
        redirect: "https://www.aclu.org"
      });
    }

    const caseNumber = generateCaseNumber();

    await kv.set(caseNumber, {
      name,
      email,
      complaint,
      division: result.division,
      created: new Date().toISOString()
    });

    return Response.json({
      status: "accepted",
      caseNumber,
      division: result.division
    });

  } catch (err) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
