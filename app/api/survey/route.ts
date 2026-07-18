import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const { name, email, phone, projectType, budget, notes } = await req.json();

  const [firstName, ...rest] = (name ?? "").trim().split(" ");
  const lastName = rest.join(" ");

  const payload = {
    firstName,
    lastName,
    email,
    phone,
    projectType,
    budget,
    notes,
    // custom field keys from GHL
    "contact.project_type": projectType,
    "contact.budget": budget,
    "contact.project_notes": notes,
  };

  console.log("Sending to GHL webhook:", WEBHOOK_URL);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("GHL response:", res.status, text);

    if (!res.ok) {
      return NextResponse.json({ error: text }, { status: res.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
