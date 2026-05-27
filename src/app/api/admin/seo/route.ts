import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getSeoEntries, saveSeoEntries, generateSitemapXml, robotsTxt, type SeoEntry } from "@/lib/admin/seo";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const action = req.nextUrl.searchParams.get("action");
    if (action === "sitemap") {
      const base = process.env.SITE_URL ?? "https://example.com";
      return new NextResponse(await generateSitemapXml(base), {
        headers: { "Content-Type": "application/xml" },
      });
    }
    if (action === "robots") {
      return new NextResponse(robotsTxt(), { headers: { "Content-Type": "text/plain" } });
    }
    return NextResponse.json(await getSeoEntries());
  });
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const entries = (await req.json()) as SeoEntry[];
    const ok = await saveSeoEntries(entries);
    if (!ok) return NextResponse.json({ error: "写入失败" }, { status: 503 });
    await appendLog("seo_save", `${user.username} 更新 SEO`);
    return NextResponse.json({ ok: true });
  });
}
