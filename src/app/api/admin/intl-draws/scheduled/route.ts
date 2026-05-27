import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import {
  readScheduledDraws,
  writeScheduledDraws,
  readScheduleSettings,
  writeScheduleSettings,
  type ScheduledDraw,
  type ScheduleSettings,
} from "@/lib/draw/scheduled-draws";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const draws = await readScheduledDraws();
    const settings = await readScheduleSettings();
    return NextResponse.json({ draws, settings });
  });
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const body = (await req.json()) as {
      action: "save_draws" | "save_settings";
      draws?: ScheduledDraw[];
      settings?: ScheduleSettings;
    };

    if (body.action === "save_draws" && body.draws) {
      const ok = await writeScheduledDraws(body.draws);
      if (!ok) return NextResponse.json({ error: "写入失败" }, { status: 503 });
      return NextResponse.json({ ok: true });
    }

    if (body.action === "save_settings" && body.settings) {
      const ok = await writeScheduleSettings(body.settings);
      if (!ok) return NextResponse.json({ error: "写入失败" }, { status: 503 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  });
}
