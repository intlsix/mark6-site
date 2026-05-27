import { NextRequest, NextResponse } from "next/server";
import { trackPageView, getAnalyticsSummary } from "@/lib/admin/analytics";

// POST: track a page view (public, called by client-side component)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, locale } = body;
    
    // Try to get country from Cloudflare/Vercel geo headers
    const country = req.headers.get("x-vercel-ip-country") ||
                    req.headers.get("cf-ipcountry") ||
                    req.headers.get("x-geo-country") ||
                    "Unknown";

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

// GET: get analytics summary (public - will be restricted in admin page)
export async function GET() {
  return NextResponse.json(getAnalyticsSummary());
}
