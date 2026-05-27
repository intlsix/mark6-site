import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getSettings, saveSettings, type SiteSettings } from "@/lib/admin/backup";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => NextResponse.json(await getSettings()));
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const settings = (await req.json()) as SiteSettings;
    const ok = await saveSettings(settings);
    if (!ok) return NextResponse.json({ error: "写入失败" }, { status: 503 });
    await appendLog("settings", `${user.username} 更新系统设置`);
    return NextResponse.json({ ok: true });
  });
}
