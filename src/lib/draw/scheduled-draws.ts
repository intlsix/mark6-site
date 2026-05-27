import fs from "fs";
import path from "path";

export interface ScheduledDraw {
  date: string; // YYYY-MM-DD
  numbers: (number | null)[]; // 6 items
  special: number | null;
}

export interface ScheduleSettings {
  /** 下一期开奖的期号，如 001、056。为空则自动按日期生成 */
  nextPeriod?: string;
}

const SCHED_PATH = path.join(process.cwd(), "src/data/international/scheduled-draws.json");
const SETTINGS_PATH = path.join(process.cwd(), "src/data/international/schedule-settings.json");

function ensureDir() {
  const dir = path.dirname(SCHED_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function readScheduledDraws(): ScheduledDraw[] {
  try {
    return JSON.parse(fs.readFileSync(SCHED_PATH, "utf8"));
  } catch {
    return [];
  }
}

export function writeScheduledDraws(draws: ScheduledDraw[]): void {
  ensureDir();
  fs.writeFileSync(SCHED_PATH, JSON.stringify(draws, null, 2) + "\n", "utf8");
}

export function readScheduleSettings(): ScheduleSettings {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  } catch {
    return { nextPeriod: "" };
  }
}

export function writeScheduleSettings(s: ScheduleSettings): void {
  ensureDir();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(s, null, 2) + "\n", "utf8");
}

export function getTodaysScheduledDraw(): ScheduledDraw | null {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${d}`;
  const draws = readScheduledDraws();
  return draws.find((sd) => sd.date === dateStr) ?? null;
}
