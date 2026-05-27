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
    const draws = readScheduledDraws();
    const settings = readScheduleSettings();
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
      writeScheduledDraws(body.draws);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "save_settings" && body.settings) {
      writeScheduleSettings(body.settings);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  });
}
