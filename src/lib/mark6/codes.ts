import type { Animal } from "./types";
import { decodeBySuiShuFa } from "./suishufa";
import { TAI_SUI } from "./constants";
import { getChongPartner, getLiuhePartner, getSanhePartners } from "./zodiac";
import { getSuiShuFaNumbers } from "./suishufa";

export function analyzeHiddenCodes(codes: number[], year: number) {
  const taiSui = TAI_SUI[year] ?? "马";
  const mapped = codes.map((n) => ({ n, animal: decodeBySuiShuFa(n, year) }));

  const scores: Record<Animal, number> = {} as Record<Animal, number>;
  for (const { animal } of mapped) {
    scores[animal] = (scores[animal] ?? 0) + 1;
    const chong = getChongPartner(animal);
    scores[chong] = (scores[chong] ?? 0) - 0.5;
    const liuhe = getLiuhePartner(animal);
    scores[liuhe] = (scores[liuhe] ?? 0) + 0.5;
    for (const p of getSanhePartners(animal)) {
      scores[p] = (scores[p] ?? 0) + 0.3;
    }
  }

  const ranking = Object.entries(scores)
    .map(([animal, score]) => ({ animal: animal as Animal, score }))
    .sort((a, b) => b.score - a.score);

  const topPick = ranking[0]?.animal ?? "鼠";
  const numbers = getSuiShuFaNumbers(topPick, year);

  return { taiSui, mapped, ranking, topPick, numbers };
}
