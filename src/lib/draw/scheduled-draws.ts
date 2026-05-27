import { readJson, writeJson } from "@/lib/storage/json-store";

export interface ScheduledDraw {
  date: string;
  numbers: (number | null)[];
  special: number | null;
}

export interface ScheduleSettings {
  nextPeriod?: string;
}

const SCHED_KEY = "international/scheduled-draws.json";
const SETTINGS_KEY = "international/schedule-settings.json";

export async function readScheduledDraws(): Promise<ScheduledDraw[]> {
  return readJson<ScheduledDraw[]>(SCHED_KEY, []);
}

export async function writeScheduledDraws(draws: ScheduledDraw[]): Promise<boolean> {
  return writeJson(SCHED_KEY, draws);
}

export async function readScheduleSettings(): Promise<ScheduleSettings> {
  return readJson<ScheduleSettings>(SETTINGS_KEY, { nextPeriod: "" });
}

export async function writeScheduleSettings(s: ScheduleSettings): Promise<boolean> {
  return writeJson(SETTINGS_KEY, s);
}

export async function getTodaysScheduledDraw(): Promise<ScheduledDraw | null> {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${d}`;
  const draws = await readScheduledDraws();
  return draws.find((sd) => sd.date === dateStr) ?? null;
}
