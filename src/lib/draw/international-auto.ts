import { sha256, generateSeed, drawNumbersFromSeed } from "@/lib/mark6/fairness";
import type { DrawRecord } from "@/lib/mark6/types";
import { readScheduleSettings, writeScheduleSettings } from "./scheduled-draws";

export const INTL_DRAW_HOUR_UTC = 13;
export const INTL_DRAW_MINUTE_UTC = 30;

/**
 * 生成期号：年号-期号，如 2026-001
 * - 如果 settings.nextPeriod 有值，用该值并自动递增
 * - 否则按年自动编号（每年从 001 开始）
 */
export function nextIntlDrawId(existing: DrawRecord[], forDate: Date): string {
  const year = forDate.getFullYear();
  const settings = readScheduleSettings();

  if (settings.nextPeriod && settings.nextPeriod.trim()) {
    // 手动模式：使用设置的期号
    let baseNum = parseInt(settings.nextPeriod.trim(), 10);
    if (isNaN(baseNum)) baseNum = 1;

    // 确保不跟已有记录冲突
    const maxExisting = existing
      .filter((d) => d.id.startsWith(`${year}-`))
      .map((d) => {
        const m = d.id.match(/^(\d{4})-(\d+)$/);
        return m ? parseInt(m[2], 10) : 0;
      })
      .reduce((a, b) => Math.max(a, b), 0);
    baseNum = Math.max(baseNum, maxExisting + 1);

    // 自动递增下一期
    const nextVal = String(baseNum + 1).padStart(3, "0");
    try { writeScheduleSettings({ ...settings, nextPeriod: nextVal }); } catch { /* read-only FS */ }

    return `${year}-${String(baseNum).padStart(3, "0")}`;
  }

  // 自动模式：按年编号
  const yearDraws = existing.filter((d) => d.id.startsWith(`${year}-`));
  const maxNum = yearDraws
    .map((d) => {
      const m = d.id.match(/^(\d{4})-(\d+)$/);
      return m ? parseInt(m[2], 10) : 0;
    })
    .reduce((a, b) => Math.max(a, b), 0);

  const nextNum = maxNum + 1;
  return `${year}-${String(nextNum).padStart(3, "0")}`;
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
