import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = process.env.GHL_WEBHOOK_URL!;

export async function POST(req: NextRequest) {
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

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
