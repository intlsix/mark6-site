import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getSettings } from "@/lib/admin/backup";
import { readJson, writeJson } from "@/lib/storage/json-store";

const HK_DRAWS_KEY = "hongkong/draws.json";

interface HkDraw {
  id: string;
  drawAt: string;
  numbers: number[];
  special: number;
  source: string;
}

/** Fetch and parse HK draw data from the configured scrape URL.
 *  Reads from settings.json → hkScrapeUrl.
 *  Parses HTML for draw numbers and merges into hongkong/draws.json.
 */
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const settings = await getSettings();
    if (!settings.hkScrapeUrl) {
      return NextResponse.json({ ok: false, message: "未配置采集源 URL" });
    }

    const url = settings.hkScrapeUrl;
    try {
      // Fetch the page
      const resp = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(30000),
      });
      if (!resp.ok) {
        return NextResponse.json({ ok: false, message: `采集源返回 ${resp.status}` });
      }

      const html = await resp.text();

      // Parse: find issue IDs (YYYY-NNN) and numbers (1-49)
      const issueIds = [...html.matchAll(/(\d{4}-\d{3})/g)].map((m) => m[1]);
      const allNums = [...html.matchAll(/\b([1-9]|[1-4]\d|49)\b/g)].map((m) => parseInt(m[1]));

      // Group numbers into sets of 7 per issue
      const newDraws: HkDraw[] = [];
      for (let i = 0; i < issueIds.length; i++) {
        const start = i * 7;
        if (start + 7 > allNums.length) break;
        newDraws.push({
          id: issueIds[i],
          drawAt: `${issueIds[i].slice(0, 4)}-01-01`, // placeholder date
          numbers: allNums.slice(start, start + 6),
          special: allNums[start + 6],
          source: "auto",
        });
      }

      if (newDraws.length === 0) {
        return NextResponse.json({ ok: false, message: "未从页面解析到开奖数据，请检查采集源格式" });
      }

      // Merge with existing
      const existing = await readJson<HkDraw[]>(HK_DRAWS_KEY, []);
      const existingIds = new Set(existing.map((d) => d.id));
      let added = 0;
      for (const d of newDraws) {
        if (!existingIds.has(d.id)) {
          existing.push(d);
          added++;
        }
      }

      if (added === 0) {
        return NextResponse.json({ ok: true, message: "数据已是最新，无需更新", count: 0 });
      }

      // Sort by ID descending
      existing.sort((a, b) => b.id.localeCompare(a.id));
      await writeJson(HK_DRAWS_KEY, existing);

      await appendLog("hk_scrape", `${user.username} 手动采集: +${added} 期（源: ${url}）`);
      return NextResponse.json({ ok: true, message: `采集成功`, count: added });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await appendLog("hk_scrape", `${user.username} 采集失败: ${msg}`);
      return NextResponse.json({ ok: false, message: `采集失败: ${msg}` });
    }
  });
}
