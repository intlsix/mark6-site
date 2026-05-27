import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { DrawRecord } from "@/lib/mark6/types";

const HISTORY_PATH = path.join(process.cwd(), "src/data/admin/export-history.json");

export interface ExportRecord {
  id: string;
  filename: string;
  track: "hongkong" | "international";
  year?: number;
  sizeBytes: number;
  at: string;
}

function readHistory(): ExportRecord[] {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8")) as ExportRecord[];
  } catch {
    return [];
  }
}

function writeHistory(records: ExportRecord[]): void {
  const dir = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  try { fs.writeFileSync(HISTORY_PATH, JSON.stringify(records.slice(0, 50), null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
}

export function getExportHistory(): ExportRecord[] {
  return readHistory();
}

export function recordExport(
  track: "hongkong" | "international",
  data: DrawRecord[],
  year?: number
): ExportRecord {
  const json = JSON.stringify(data, null, 2);
  const filename = year
    ? `${track}_${year}.json`
    : `${track}_all_${new Date().toISOString().slice(0, 10)}.json`;
  const rec: ExportRecord = {
    id: randomUUID(),
    filename,
    track,
    year,
    sizeBytes: Buffer.byteLength(json, "utf8"),
    at: new Date().toISOString(),
  };
  const hist = readHistory();
  hist.unshift(rec);
  writeHistory(hist);
  return rec;
}

export function filterDraws(
  draws: DrawRecord[],
  opts: { year?: number; track?: string }
): DrawRecord[] {
  let out = draws;
  if (opts.year) {
    out = out.filter((d) => d.drawAt.startsWith(String(opts.year)));
  }
  return out;
}
