import { kv } from "@vercel/kv";

function generateCaseNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RHI-FL-${year}-${random}`;
}

function screenUSC242(complaint) {
  const required = {
    publicOfficial: false,
    underColorOfLaw: false,
    willful: false,
    constitutionalRight: false,
    harm: false,
  };

  const text = complaint.toLowerCase();

  if (
    text.includes("officer") ||
    text.includes("judge") ||
    text.includes("prosecutor") ||
    text.includes("correction") ||
    text.includes("dcf")
  ) required.publicOfficial = true;

  if (
    text.includes("on duty") ||
    text.includes("acting in official capacity") ||
    text.includes("under color of law")
  ) required.underColorOfLaw = true;

  if (
    text.includes("intentional") ||
    text.includes("willful") ||
    text.includes("knowingly")
  ) required.willful = true;

  if (
    text.includes("due process") ||
    text.includes("equal protection") ||
    text.includes("fourteenth amendment") ||
    text.includes("civil rights")
  ) required.constitutionalRight = true;

  if (
    text.includes("injury") ||
    text.includes("incarcerated") ||
    text.includes("loss") ||
    text.includes("harm")
  ) required.harm = true;

  const passed = Object.values(required).every(Boolean);

  return { passed, required };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, complaint } = req.body;

  if (!complaint || complaint.length < 50) {
    return res.status(400).json({
      status: "rejected",
      reason: "Complaint too short for legal review",
    });
  }

  const screening = screenUSC242(complaint);

  if (!screening.passed) {
    return res.status(200).json({
      status: "rejected",
      message:
        "Your complaint does not meet the elements of 18 U.S.C. § 242. You may consider contacting the ACLU, DOJ Civil Rights Division, or a civil rights attorney.",
      missingElements: screening.required,
    });
  }

  const caseNumber = generateCaseNumber();

  await kv.set(`complaint:${caseNumber}`, {
    caseNumber,
    name,
    email,
    complaint,
    status: "accepted",
    statute: "18 U.S.C. § 242",
    createdAt: new Date().toISOString(),
  });

  return res.status(200).json({
    status: "accepted",
    caseNumber,
    message:
      "Your complaint meets the threshold requirements of 18 U.S.C. § 242 and has been assigned a file number.",
  });
}
