import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  // Simplified: log the complaint
  console.log("Complaint received:", data);

  return NextResponse.json({ status: "success", message: "Complaint recorded" });
}
