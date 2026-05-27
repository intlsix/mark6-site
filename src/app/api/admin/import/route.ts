import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { parseJsonImport, parseTxtLines, mergeDraws } from "@/lib/admin/import";
import { getHongKongDraws, saveHongKongDraws } from "@/lib/draw/hongkong";
import fs from "fs";
import path from "path";
import type { DrawRecord } from "@/lib/mark6/types";

const INTL_PATH = path.join(process.cwd(), "src/data/international/draws.json");

function getIntlManual(): DrawRecord[] {
  try {
    return JSON.parse(fs.readFileSync(INTL_PATH, "utf8")) as DrawRecord[];
  } catch {
    return [];
  }
}

function saveIntlManual(draws: DrawRecord[]) {
  try { fs.writeFileSync(INTL_PATH, JSON.stringify(draws, null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
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
      const existing = track === "hongkong" ? getHongKongDraws() : getIntlManual();
      const { newCount, skipCount } = mergeDraws(existing, preview.records);
      return NextResponse.json({ ...preview, newCount, skipCount });
    }
    if (track === "hongkong") {
      const { merged, newCount, skipCount } = mergeDraws(getHongKongDraws(), preview.records);
      saveHongKongDraws(merged);
      appendLog("import_hk", `${user.username} 导入香港 ${newCount} 条，跳过 ${skipCount}`);
      return NextResponse.json({ ok: true, newCount, skipCount });
    }
    const { merged, newCount, skipCount } = mergeDraws(getIntlManual(), preview.records);
    saveIntlManual(merged);
    appendLog("import_intl", `${user.username} 导入国际 ${newCount} 条，跳过 ${skipCount}`);
    return NextResponse.json({ ok: true, newCount, skipCount });
  });
}
