import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  contactName?: string;
  company?: string;
  email?: string;
  website?: string;
  volume?: string;
  channels?: string[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const contactName = body.contactName?.trim();
  const company = body.company?.trim();
  const email = body.email?.trim();

  if (!contactName || !company || !email) {
    return NextResponse.json(
      { error: "Name, business name, and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const application = {
    contactName,
    company,
    email,
    website: body.website?.trim() || null,
    volume: body.volume || null,
    channels: Array.isArray(body.channels) ? body.channels : [],
    submittedAt: new Date().toISOString(),
  };

  console.log("[merchant-onboarding] new application", application);

  return NextResponse.json(
    { ok: true, message: "Application received." },
    { status: 201 }
  );
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
