import { randomUUID } from "crypto";
import type { DrawRecord } from "@/lib/mark6/types";
import { readJson, writeJson } from "@/lib/storage/json-store";

const KEY = "admin/export-history.json";

export interface ExportRecord {
  id: string;
  filename: string;
  track: "hongkong" | "international";
  year?: number;
  sizeBytes: number;
  at: string;
}

export async function getExportHistory(): Promise<ExportRecord[]> {
  return readJson<ExportRecord[]>(KEY, []);
}

export async function recordExport(
  track: "hongkong" | "international",
  data: DrawRecord[],
  year?: number,
): Promise<ExportRecord> {
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
  const hist = await getExportHistory();
  hist.unshift(rec);
  await writeJson(KEY, hist.slice(0, 50));
  return rec;
}

export function filterDraws(draws: DrawRecord[], opts: { year?: number; track?: string }): DrawRecord[] {
  let out = draws;
  if (opts.year) {
    out = out.filter((d) => d.drawAt.startsWith(String(opts.year)));
  }
  return out;
}
