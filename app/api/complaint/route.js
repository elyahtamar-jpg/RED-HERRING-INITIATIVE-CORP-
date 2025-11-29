import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const data = await req.json();
    const { complaintNumber, ...answers } = data;

    await kv.set(`complaint:${complaintNumber}`, {
      complaintNumber,
      answers,
      createdAt: new Date().toISOString(),
      status: "new",
      source: "web-intake",
    });

    return NextResponse.json({ ok: true, complaintNumber });
  } catch (error) {
    console.error("Error saving complaint to KV:", error);
    return NextResponse.json(
      { error: "Failed to save complaint" },
      { status: 500 }
    );
  }
}
