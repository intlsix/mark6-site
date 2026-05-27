import type { DrawRecord } from "./types";
import { numToAnimalStd } from "./zodiac";
import { decodeBySuiShuFa } from "./suishufa";

export function frequencyMap(draws: DrawRecord[]): Record<number, number> {
  const freq: Record<number, number> = {};
  for (let n = 1; n <= 49; n++) freq[n] = 0;
  for (const d of draws) {
    for (const n of d.numbers) freq[n]++;
    freq[d.special]++;
  }
  return freq;
}

export function topNumbers(freq: Record<number, number>, limit = 20) {
  return Object.entries(freq)
    .map(([num, count]) => ({ num: parseInt(num, 10), count }))
    .sort((a, b) => b.count - a.count || a.num - b.num)
    .slice(0, limit);
}

export function animalFrequency(
  draws: DrawRecord[],
  mode: "fixed" | "age",
  year = new Date().getFullYear(),
): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const d of draws) {
    const all = [...d.numbers, d.special];
    const y = new Date(d.drawAt).getFullYear();
    for (const n of all) {
      const animal = mode === "fixed" ? numToAnimalStd(n) : decodeBySuiShuFa(n, y);
      freq[animal] = (freq[animal] ?? 0) + 1;
    }
  }
  return freq;
}
