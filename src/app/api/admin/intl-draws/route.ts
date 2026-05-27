import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import {
  getInternationalDraws,
  getManualInternationalDraws,
  triggerManualDraw,
  addManualInternationalDraw,
  deleteManualInternationalDraw,
  updateManualInternationalDraw,
  clearInternationalDraws,
} from "@/lib/draw/international";
import { generateSeed, drawNumbersFromSeed, sha256 } from "@/lib/mark6/fairness";
import type { DrawRecord } from "@/lib/mark6/types";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () =>
    NextResponse.json({
      draws: await getInternationalDraws(),
      manual: await getManualInternationalDraws(),
    }),
  );
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const body = (await req.json()) as { action?: string; draw?: DrawRecord };
    if (body.action === "trigger") {
      const draw = await triggerManualDraw();
      await appendLog("intl_trigger", `${user.username} 立即开奖 ${draw.id}`);
      return NextResponse.json(draw);
    }
    if (body.action === "manual") {
      const seed = generateSeed();
      const { numbers, special } = drawNumbersFromSeed(seed);
      const draw = await addManualInternationalDraw({
        drawAt: new Date().toISOString(),
        numbers,
        special,
        seed,
        seedHash: sha256(seed),
      });
      await appendLog("intl_manual", `${user.username} 手动摇奖 ${draw.id}`);
      return NextResponse.json(draw);
    }
    if (body.draw) {
      const draw = await addManualInternationalDraw(body.draw);
      await appendLog("intl_add", `${user.username} 添加 ${draw.id}`);
      return NextResponse.json(draw);
    }
    if (body.action === "clear_all") {
      await clearInternationalDraws();
      await appendLog("intl_clear_all", `${user.username} 清空所有国际开奖记录`);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  });
}

export async function PUT(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const body = (await req.json()) as DrawRecord;
    const updated = await updateManualInternationalDraw(body.id, body);
    if (!updated) return NextResponse.json({ error: "仅可编辑手动记录" }, { status: 404 });
    await appendLog("intl_update", `${user.username} 更新 ${body.id}`);
    return NextResponse.json(updated);
  });
}

export async function DELETE(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    if (!(await deleteManualInternationalDraw(id))) {
      return NextResponse.json({ error: "仅可删除手动记录" }, { status: 404 });
    }
    await appendLog("intl_delete", `${user.username} 删除 ${id}`);
    return NextResponse.json({ ok: true });
  });
}
