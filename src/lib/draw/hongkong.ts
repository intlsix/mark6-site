import fs from "fs";
import path from "path";
import type { DrawRecord } from "@/lib/mark6/types";

const DATA_PATH = path.join(process.cwd(), "src/data/hongkong/draws.json");

function readRaw(): DrawRecord[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw) as DrawRecord[];
  } catch {
    return [];
  }
}

export function getHongKongDraws(): DrawRecord[] {
  return readRaw().sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}

export function getHongKongDraw(id: string): DrawRecord | undefined {
  return getHongKongDraws().find((d) => d.id === id);
}

export function saveHongKongDraws(draws: DrawRecord[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(draws, null, 2) + "\n", "utf8");
}
