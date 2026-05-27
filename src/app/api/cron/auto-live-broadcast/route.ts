import { generateSeed, drawNumbersFromSeed } from "@/lib/mark6/fairness";
import { NextRequest, NextResponse } from "next/server";
import { getTodaysScheduledDraw } from "@/lib/draw/scheduled-draws";
import { readLiveDraw, writeLiveDraw } from "@/lib/draw/live-draw";
import { addManualInternationalDraw } from "@/lib/draw/international";
import { appendLog } from "@/lib/admin/logs";

/** Auto-publish after broadcast animation completes (~90s) */
function scheduleAutoPublish() {
  setTimeout(() => {
    try {
      const live = readLiveDraw();
      if (!live.broadcasting) return;
      const validNums = live.numbers.filter((n): n is number => n !== null);
      if (validNums.length < 6 || live.special === null) return;
      const draw = addManualInternationalDraw({
        drawAt: new Date().toISOString(),
        numbers: validNums,
        special: live.special,
        source: "manual",
      });
      writeLiveDraw({
        numbers: [null, null, null, null, null, null],
        special: null,
        updatedAt: new Date().toISOString(),
        broadcasting: false,
      });
      appendLog("auto_live_publish", `自动广播发布 ${draw.id}`);
    } catch (e) {
      appendLog("auto_live_publish_err", `自动发布失败: ${(e as Error).message}`);
    }
  }, 90000); // 90s — enough for 6 nums × 700ms + special × 800ms + buffer
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Always run at 21:30 — no toggle needed
  // Guard: if already broadcasting, clean up (shouldn't normally happen)
  const live = readLiveDraw();
  if (live.broadcasting) {
    const validNums = live.numbers.filter((n): n is number => n !== null);
    if (validNums.length === 6 && live.special !== null) {
      const draw = addManualInternationalDraw({
        drawAt: new Date().toISOString(),
        numbers: validNums,
        special: live.special,
        source: "manual",
      });
      writeLiveDraw({
        numbers: [null, null, null, null, null, null],
        special: null,
        updatedAt: new Date().toISOString(),
        broadcasting: false,
      });
      appendLog("auto_live_publish", `自动广播发布 ${draw.id}`);
      return NextResponse.json({ ok: true, published: draw.id });
    }
    return NextResponse.json({ ok: true, skipped: true, reason: "broadcasting_incomplete" });
  }

  // Start new broadcast
  let numbers: (number | null)[];
  let special: number | null;
  let sourceLabel = "";

  const scheduled = getTodaysScheduledDraw();
  if (scheduled) {
    const validNums = scheduled.numbers.filter((n): n is number => n !== null);
    if (validNums.length >= 6 && scheduled.special !== null) {
      numbers = scheduled.numbers;
      special = scheduled.special;
      sourceLabel = `预置 ${scheduled.date}`;
    } else {
      return NextResponse.json({ ok: true, skipped: true, reason: "incomplete_numbers" });
    }
  } else {
    // 自动接管：无预置号码时自动随机生成
    const seed = generateSeed();
    const result = drawNumbersFromSeed(seed);
    numbers = result.numbers.map((n) => n as number | null);
    special = result.special;
    sourceLabel = "随机生成（自动接管）";
  }

  // Start live broadcast
  writeLiveDraw({
    numbers,
    special,
    updatedAt: new Date().toISOString(),
    broadcasting: true,
  });
  appendLog("auto_live_start", `自动广播开始 ${sourceLabel}`);

  // Schedule auto-publish after animation
  scheduleAutoPublish();

  return NextResponse.json({ ok: true, broadcasting: true, source: sourceLabel });
}
