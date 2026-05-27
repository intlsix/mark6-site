import { sha256, generateSeed, drawNumbersFromSeed } from "@/lib/mark6/fairness";
import type { DrawRecord } from "@/lib/mark6/types";
import { readScheduleSettings, writeScheduleSettings } from "./scheduled-draws";

export const INTL_DRAW_HOUR_UTC = 13;
export const INTL_DRAW_MINUTE_UTC = 30;

export async function nextIntlDrawId(existing: DrawRecord[], forDate: Date): Promise<string> {
  const year = forDate.getFullYear();
  const settings = await readScheduleSettings();

  if (settings.nextPeriod && settings.nextPeriod.trim()) {
    let baseNum = parseInt(settings.nextPeriod.trim(), 10);
    if (isNaN(baseNum)) baseNum = 1;

    const maxExisting = existing
      .filter((d) => d.id.startsWith(`${year}-`))
      .map((d) => {
        const m = d.id.match(/^(\d{4})-(\d+)$/);
        return m ? parseInt(m[2], 10) : 0;
      })
      .reduce((a, b) => Math.max(a, b), 0);
    baseNum = Math.max(baseNum, maxExisting + 1);

    const nextVal = String(baseNum + 1).padStart(3, "0");
    await writeScheduleSettings({ ...settings, nextPeriod: nextVal });

    return `${year}-${String(baseNum).padStart(3, "0")}`;
  }

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
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), INTL_DRAW_HOUR_UTC, INTL_DRAW_MINUTE_UTC, 0),
  );
}

export function shouldAutoDrawNow(now = new Date()): boolean {
  const drawTime = utcDrawTimeForDate(now);
  return now >= drawTime;
}

export async function generateAutoDraw(existing: DrawRecord[], forDate = new Date()): Promise<DrawRecord> {
  const seed = generateSeed();
  const { numbers, special } = drawNumbersFromSeed(seed);
  const drawAt = utcDrawTimeForDate(forDate).toISOString();
  return {
    id: await nextIntlDrawId(existing, forDate),
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

export async function generateAutoDrawsInRange(
  existing: DrawRecord[],
  start: Date,
  end: Date,
): Promise<DrawRecord[]> {
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
      const draw = await generateAutoDraw(result, cur);
      result.push(draw);
      byDay.set(day, draw);
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return result.sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}
