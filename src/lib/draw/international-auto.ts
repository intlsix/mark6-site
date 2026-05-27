import { sha256, generateSeed, drawNumbersFromSeed } from "@/lib/mark6/fairness";
import type { DrawRecord } from "@/lib/mark6/types";
import { readScheduleSettings, writeScheduleSettings } from "./scheduled-draws";

export const INTL_DRAW_HOUR_UTC = 13;
export const INTL_DRAW_MINUTE_UTC = 30;

/**
 * 生成期号：
 * - 如果 settings.nextPeriod 有值（如"001"），用该值并自动递增保存
 * - 否则按日期生成 INT-20260526（每天一期不会重复）
 */
export function nextIntlDrawId(existing: DrawRecord[], forDate: Date): string {
  const settings = readScheduleSettings();

  let baseNum: number;

  if (settings.nextPeriod && settings.nextPeriod.trim()) {
    // 手动模式：使用设置的期号
    baseNum = parseInt(settings.nextPeriod.trim(), 10);
    if (isNaN(baseNum)) baseNum = 0;

    // 确保不跟已有记录冲突
    const maxExisting = existing
      .map((d) => {
        const m = d.id.match(/^INT-(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .reduce((a, b) => Math.max(a, b), 0);
    baseNum = Math.max(baseNum, maxExisting + 1);

    // 自动递增下一期
    const nextVal = String(baseNum + 1).padStart(3, "0");
    writeScheduleSettings({ ...settings, nextPeriod: nextVal });
  } else {
    // 自动模式：按日期生成
    const y = forDate.getFullYear();
    const m = String(forDate.getMonth() + 1).padStart(2, "0");
    const d = String(forDate.getDate()).padStart(2, "0");
    baseNum = parseInt(`${y}${m}${d}`, 10);
  }

  return `INT-${String(baseNum).padStart(3, "0")}`;
}

export function utcDrawTimeForDate(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), INTL_DRAW_HOUR_UTC, INTL_DRAW_MINUTE_UTC, 0));
  return d;
}

export function shouldAutoDrawNow(now = new Date()): boolean {
  const drawTime = utcDrawTimeForDate(now);
  return now >= drawTime;
}

export function generateAutoDraw(existing: DrawRecord[], forDate = new Date()): DrawRecord {
  const seed = generateSeed();
  const { numbers, special } = drawNumbersFromSeed(seed);
  const drawAt = utcDrawTimeForDate(forDate).toISOString();
  return {
    id: nextIntlDrawId(existing, forDate),
    drawAt,
    numbers,
    special,
    seed,
    seedHash: sha256(seed),
    source: "auto",
  };
}

export function getPendingDraw(forDate = new Date()): Partial<DrawRecord> {
  const seed = generateSeed();
  const drawAt = utcDrawTimeForDate(forDate).toISOString();
  return {
    drawAt,
    seedHash: sha256(seed),
    seed: undefined,
  };
}

/** Generate auto draws for each UTC day from start to end if missing */
export function generateAutoDrawsInRange(
  existing: DrawRecord[],
  start: Date,
  end: Date,
): DrawRecord[] {
  const byDay = new Map<string, DrawRecord>();
  for (const d of existing) {
    const day = d.drawAt.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, d);
  }

  const result = [...existing];
  const cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const endDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

  while (cur <= endDay) {
    const day = cur.toISOString().slice(0, 10);
    const drawTime = utcDrawTimeForDate(cur);
    if (drawTime <= end && !byDay.has(day)) {
      const draw = generateAutoDraw(result, cur);
      result.push(draw);
      byDay.set(day, draw);
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return result.sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}
