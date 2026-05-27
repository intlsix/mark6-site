import type { DrawRecord } from "@/lib/mark6/types";

export interface ImportPreview {
  total: number;
  newCount: number;
  skipCount: number;
  records: DrawRecord[];
  errors: string[];
}

function parseNumbers(parts: string[]): { numbers: number[]; special: number } | null {
  const nums = parts.map((p) => parseInt(p, 10)).filter((n) => n >= 1 && n <= 49);
  if (nums.length < 7) return null;
  return { numbers: nums.slice(0, 6), special: nums[6] };
}

export function parseTxtLines(text: string): ImportPreview {
  const errors: string[] = [];
  const records: DrawRecord[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const m = line.match(/^(\S+)\s+([\d\s+]+)$/);
    if (!m) {
      errors.push(`无法解析: ${line}`);
      continue;
    }
    const id = m[1];
    const numPart = m[2].replace(/\+/g, " ").trim();
    const parsed = parseNumbers(numPart.split(/\s+/));
    if (!parsed) {
      errors.push(`号码无效: ${line}`);
      continue;
    }
    records.push({
      id,
      drawAt: new Date().toISOString().slice(0, 10),
      numbers: parsed.numbers,
      special: parsed.special,
      source: "manual",
    });
  }
  return { total: lines.length, newCount: records.length, skipCount: 0, records, errors };
}

export function parseJsonImport(text: string): ImportPreview {
  const errors: string[] = [];
  try {
    const data = JSON.parse(text) as unknown;
    const arr = Array.isArray(data) ? data : [data];
    const records: DrawRecord[] = [];
    for (const item of arr) {
      const o = item as Record<string, unknown>;
      const id = String(o.id ?? o.period ?? "");
      const numbers = (o.numbers as number[]) ?? [];
      const special = Number(o.special);
      if (!id || numbers.length !== 6 || !special) {
        errors.push(`无效记录: ${JSON.stringify(item)}`);
        continue;
      }
      records.push({
        id,
        drawAt: String(o.drawAt ?? o.date ?? new Date().toISOString().slice(0, 10)),
        numbers,
        special,
        source: "manual",
      });
    }
    return { total: arr.length, newCount: records.length, skipCount: 0, records, errors };
  } catch (e) {
    return { total: 0, newCount: 0, skipCount: 0, records: [], errors: [(e as Error).message] };
  }
}

export function mergeDraws(existing: DrawRecord[], incoming: DrawRecord[]): {
  merged: DrawRecord[];
  newCount: number;
  skipCount: number;
} {
  const ids = new Set(existing.map((d) => d.id));
  let newCount = 0;
  let skipCount = 0;
  const merged = [...existing];
  for (const d of incoming) {
    if (ids.has(d.id)) {
      skipCount++;
      continue;
    }
    ids.add(d.id);
    merged.push(d);
    newCount++;
  }
  return { merged, newCount, skipCount };
}
