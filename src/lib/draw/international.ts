import fs from "fs";
import path from "path";
import type { DrawRecord } from "@/lib/mark6/types";
import {
  generateAutoDrawsInRange,
  shouldAutoDrawNow,
  utcDrawTimeForDate,
  nextIntlDrawId,
  generateAutoDraw,
} from "./international-auto";
import { generateSeed, drawNumbersFromSeed, sha256 } from "@/lib/mark6/fairness";

const DATA_PATH = path.join(process.cwd(), "src/data/international/draws.json");

function readManual(): DrawRecord[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw) as DrawRecord[];
  } catch {
    return [];
  }
}

function writeManual(draws: DrawRecord[]): void {
  try { fs.writeFileSync(DATA_PATH, JSON.stringify(draws, null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
}

function mergeDraws(stored: DrawRecord[]): DrawRecord[] {
  // 只返回已保存的记录，不再自动生成
  // 自动生成仅由 cron 在 21:30 触发
  return stored.sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}

export function getInternationalDraws(): DrawRecord[] {
  return mergeDraws(readManual());
}

export function getInternationalDraw(id: string): DrawRecord | undefined {
  return getInternationalDraws().find((d) => d.id === id);
}

export function getManualInternationalDraws(): DrawRecord[] {
  return readManual().sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}

export function addManualInternationalDraw(draw: Omit<DrawRecord, "id"> & { id?: string }): DrawRecord {
  const manual = readManual();
  const record: DrawRecord = {
    ...draw,
    id: draw.id ?? nextIntlDrawId([...manual, ...getInternationalDraws()], new Date()),
    source: "manual",
  };
  manual.push(record);
  writeManual(manual);
  return record;
}

export function updateManualInternationalDraw(id: string, patch: Partial<DrawRecord>): DrawRecord | null {
  const manual = readManual();
  const idx = manual.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  manual[idx] = { ...manual[idx], ...patch, id };
  writeManual(manual);
  return manual[idx];
}

export function deleteManualInternationalDraw(id: string): boolean {
  const manual = readManual();
  const next = manual.filter((d) => d.id !== id);
  if (next.length === manual.length) return false;
  writeManual(next);
  return true;
}

export function triggerManualDraw(): DrawRecord {
  const seed = generateSeed();
  const { numbers, special } = drawNumbersFromSeed(seed);
  return addManualInternationalDraw({
    drawAt: new Date().toISOString(),
    numbers,
    special,
    seed,
    seedHash: sha256(seed),
    source: "manual",
  });
}

export function runCronInternationalDraw(): DrawRecord | null {
  const now = new Date();
  if (!shouldAutoDrawNow(now)) return null;
  const manual = readManual();
  const day = now.toISOString().slice(0, 10);
  if (manual.some((d) => d.drawAt.startsWith(day))) return null;
  const draw = generateAutoDraw(manual, now);
  manual.push(draw);
  writeManual(manual);
  return draw;
}

/** 清空所有国际开奖记录 */
export function clearInternationalDraws(): void {
  writeManual([]);
}
