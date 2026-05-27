import type { DrawRecord } from "@/lib/mark6/types";
import { readJson, writeJson } from "@/lib/storage/json-store";

const KEY = "hongkong/draws.json";

function sortDraws(draws: DrawRecord[]): DrawRecord[] {
  return [...draws].sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}

export async function getHongKongDraws(): Promise<DrawRecord[]> {
  const raw = await readJson<DrawRecord[]>(KEY, []);
  return sortDraws(raw);
}

export async function getHongKongDraw(id: string): Promise<DrawRecord | undefined> {
  const draws = await getHongKongDraws();
  return draws.find((d) => d.id === id);
}

export async function saveHongKongDraws(draws: DrawRecord[]): Promise<boolean> {
  return writeJson(KEY, draws);
}
