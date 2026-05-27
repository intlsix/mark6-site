import { NextRequest, NextResponse } from "next/server";
import { runCronInternationalDraw } from "@/lib/draw/international";
import { appendLog } from "@/lib/admin/logs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const draw = await runCronInternationalDraw();
  if (draw) {
    await appendLog("cron_intl", `Auto draw ${draw.id}`);
    return NextResponse.json({ ok: true, draw });
  }
  return NextResponse.json({ ok: true, skipped: true });
}
