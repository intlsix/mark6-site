import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { parseJsonImport, parseTxtLines, mergeDraws } from "@/lib/admin/import";
import { getHongKongDraws, saveHongKongDraws } from "@/lib/draw/hongkong";
import { readJson, writeJson } from "@/lib/storage/json-store";
import type { DrawRecord } from "@/lib/mark6/types";

const INTL_KEY = "international/draws.json";

async function getIntlManual(): Promise<DrawRecord[]> {
  return readJson<DrawRecord[]>(INTL_KEY, []);
}

async function saveIntlManual(draws: DrawRecord[]): Promise<boolean> {
  return writeJson(INTL_KEY, draws);
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const { track, format, text, confirm } = (await req.json()) as {
      track?: "hongkong" | "international";
      format?: "json" | "txt";
      text?: string;
      confirm?: boolean;
    };
    if (!track || !text) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }
    const preview = format === "json" ? parseJsonImport(text) : parseTxtLines(text);
    if (!confirm) {
      const existing = track === "hongkong" ? await getHongKongDraws() : await getIntlManual();
      const { newCount, skipCount } = mergeDraws(existing, preview.records);
      return NextResponse.json({ ...preview, newCount, skipCount });
    }
    if (track === "hongkong") {
      const { merged, newCount, skipCount } = mergeDraws(await getHongKongDraws(), preview.records);
      const ok = await saveHongKongDraws(merged);
      if (!ok) return NextResponse.json({ error: "写入失败" }, { status: 503 });
      await appendLog("import_hk", `${user.username} 导入香港 ${newCount} 条，跳过 ${skipCount}`);
      return NextResponse.json({ ok: true, newCount, skipCount });
    }
    const { merged, newCount, skipCount } = mergeDraws(await getIntlManual(), preview.records);
    const ok = await saveIntlManual(merged);
    if (!ok) return NextResponse.json({ error: "写入失败" }, { status: 503 });
    await appendLog("import_intl", `${user.username} 导入国际 ${newCount} 条，跳过 ${skipCount}`);
    return NextResponse.json({ ok: true, newCount, skipCount });
  });
}
