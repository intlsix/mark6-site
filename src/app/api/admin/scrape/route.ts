import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";

/** HKJC 自动采集占位 — 需配置采集源后实现 */
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    await appendLog("hk_scrape", `${user.username} 触发采集（占位）`);
    return NextResponse.json({
      ok: false,
      message: "采集模块待接入 HKJC 数据源，请暂时使用手动录入或批量导入",
    });
  });
}
