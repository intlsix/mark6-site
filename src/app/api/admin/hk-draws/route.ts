import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getHongKongDraws, saveHongKongDraws } from "@/lib/draw/hongkong";
import type { DrawRecord } from "@/lib/mark6/types";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => NextResponse.json(getHongKongDraws()));
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const body = (await req.json()) as DrawRecord | { action: string };
    // 清空全部
    if ("action" in body && body.action === "clear_all") {
      saveHongKongDraws([]);
      appendLog("hk_clear_all", `${user.username} 清空香港开奖全部记录`);
      return NextResponse.json({ ok: true });
    }
    const record = body as DrawRecord;
    const draws = getHongKongDraws();
    if (draws.some((d) => d.id === record.id)) {
      return NextResponse.json({ error: "期号已存在" }, { status: 400 });
    }
    draws.push(record);
    saveHongKongDraws(draws);
    appendLog("hk_create", `${user.username} 录入 ${record.id}`);
    return NextResponse.json(record);
  });
}

export async function PUT(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const body = (await req.json()) as DrawRecord;
    const draws = getHongKongDraws();
    const idx = draws.findIndex((d) => d.id === body.id);
    if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    draws[idx] = body;
    saveHongKongDraws(draws);
    appendLog("hk_update", `${user.username} 更新 ${body.id}`);
    return NextResponse.json(body);
  });
}

export async function DELETE(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    saveHongKongDraws(getHongKongDraws().filter((d) => d.id !== id));
    appendLog("hk_delete", `${user.username} 删除 ${id}`);
    return NextResponse.json({ ok: true });
  });
}
