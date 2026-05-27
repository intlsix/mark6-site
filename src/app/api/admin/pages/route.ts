import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getPages, upsertPage, type StaticPage } from "@/lib/admin/pages";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => NextResponse.json(getPages()));
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const page = (await req.json()) as StaticPage;
    upsertPage(page);
    appendLog("page_save", `${user.username} 保存页面 ${page.slug}`);
    return NextResponse.json(page);
  });
}
