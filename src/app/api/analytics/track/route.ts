import { NextRequest, NextResponse } from "next/server";
import { trackPageView, getAnalyticsSummary } from "@/lib/admin/analytics";
import { getUserFromRequest } from "@/lib/admin/api-auth";

async function resolveCountry(ip: string): Promise<string> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("172.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return "Local";
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return "Unknown";
    const data = await res.json();
    return data.countryCode || "Unknown";
  } catch {
    return "Unknown";
  }
}

// POST: track a page view (public, called by client-side component)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, locale } = body;

    // Try Cloudflare/Vercel headers first, then resolve by IP
    let country = req.headers.get("x-vercel-ip-country") ||
                  req.headers.get("cf-ipcountry") ||
                  req.headers.get("x-geo-country") ||
                  null;

    if (!country) {
      const ip = req.headers.get("x-real-ip") ||
                 req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                 "Unknown";
      country = await resolveCountry(ip);
    }

    trackPageView({
      path: path || "/",
      locale: locale || "zh",
      country,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

// GET: analytics summary (admin only)
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAnalyticsSummary());
}
