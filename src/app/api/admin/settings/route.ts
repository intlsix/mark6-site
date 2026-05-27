import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getSettings, saveSettings, type SiteSettings } from "@/lib/admin/backup";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => NextResponse.json(getSettings()));
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const settings = (await req.json()) as SiteSettings;
    saveSettings(settings);
    appendLog("settings", `${user.username} 更新系统设置`);
    return NextResponse.json(settings);
  });
}
