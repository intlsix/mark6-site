import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { readLiveDraw, writeLiveDraw, resetLiveDraw } from "@/lib/draw/live-draw";
import { addManualInternationalDraw } from "@/lib/draw/international";
import { appendLog } from "@/lib/admin/logs";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const state = await readLiveDraw();
    return NextResponse.json(state);
  });
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const body = (await req.json()) as {
      action: "set" | "reset" | "publish";
      numbers?: (number | null)[];
      special?: number | null;
    };
    if (body.action === "reset") {
      await resetLiveDraw();
      return NextResponse.json({ ok: true });
    }
    if (body.action === "set") {
      const state = await readLiveDraw();
      if (body.numbers !== undefined) state.numbers = body.numbers;
      if (body.special !== undefined) state.special = body.special;
      state.broadcasting = true;
      await writeLiveDraw(state);
      return NextResponse.json(state);
    }
    if (body.action === "publish") {
      const state = await readLiveDraw();
      const validNums = state.numbers.filter((n): n is number => n !== null);
      if (validNums.length === 0 || state.special === null) {
        return NextResponse.json({ error: "号码不完整" }, { status: 400 });
      }
      const draw = await addManualInternationalDraw({
        drawAt: new Date().toISOString(),
        numbers: validNums,
        special: state.special,
        source: "manual",
      });
      await appendLog("intl_live_publish", `${user.username} 现场开奖发布 ${draw.id}`);
      await resetLiveDraw();
      return NextResponse.json({ ok: true, draw });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  });
}
