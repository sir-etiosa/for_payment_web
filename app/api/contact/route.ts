import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = body.firstName?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!firstName || !email || !message) {
    return NextResponse.json(
      { error: "First name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const submission = {
    firstName,
    lastName: body.lastName?.trim() || null,
    email,
    company: body.company?.trim() || null,
    message,
    submittedAt: new Date().toISOString(),
  };

  // TODO: persist + notify
  console.log("[contact] new message", submission);

  return NextResponse.json({ ok: true }, { status: 200 });
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
