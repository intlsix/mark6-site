import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/admin/backup";
import { addToken, cleanExpiredTokens } from "@/lib/quick-submit/token-store";
import crypto from "crypto";

// In-memory rate limit (cleared on server restart)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour lockout after 5 wrong attempts
const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cleanCounter = 0;

function maybeClean() {
  cleanCounter++;
  if (cleanCounter % 100 !== 0) return;
  cleanExpiredTokens();
  const now = Date.now();
  for (const [k, v] of rateLimit) if (v.resetAt < now) rateLimit.delete(k);
}

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "127.0.0.1";
}

export async function POST(req: NextRequest) {
  maybeClean();
  const ip = getIP(req);
  const now = Date.now();

  // Rate limit check
  const rl = rateLimit.get(ip);
  if (rl && rl.resetAt < now) rateLimit.delete(ip);
  if (rl && rl.count >= MAX_ATTEMPTS && rl.resetAt > now) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.code || typeof body.code !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const settings = await getSettings();
  const storedCode = settings.quickSubmitCode || "729184";

  if (body.code !== storedCode) {
    const current = rateLimit.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
    current.count++;
    rateLimit.set(ip, current);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Code correct — reset rate limit and issue token
  rateLimit.delete(ip);
  const token = crypto.randomUUID();
  addToken(token, TOKEN_TTL_MS);

  return NextResponse.json({ token });
}
