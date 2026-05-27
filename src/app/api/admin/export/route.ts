import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { filterDraws, recordExport, getExportHistory } from "@/lib/admin/export";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const track = req.nextUrl.searchParams.get("track") as "hongkong" | "international" | null;
    const year = req.nextUrl.searchParams.get("year");
    if (!track) {
      return NextResponse.json({ history: await getExportHistory() });
    }
    const draws =
      track === "hongkong" ? await getHongKongDraws() : await getInternationalDraws();
    const filtered = filterDraws(draws, { year: year ? parseInt(year, 10) : undefined });
    const rec = await recordExport(track, filtered, year ? parseInt(year, 10) : undefined);
    return new NextResponse(JSON.stringify(filtered, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${rec.filename}"`,
      },
    });
  });
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const { track, year } = (await req.json()) as {
      track: "hongkong" | "international";
      year?: number;
    };
    const draws = track === "hongkong" ? await getHongKongDraws() : await getInternationalDraws();
    const filtered = filterDraws(draws, { year });
    const rec = await recordExport(track, filtered, year);
    await appendLog("export", `${user.username} 导出 ${rec.filename}`);
    return NextResponse.json({ ok: true, record: rec, count: filtered.length });
  });
}
