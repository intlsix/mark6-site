import fs from "fs";
import path from "path";

const root = "C:/Users/Win-Hermes/mark6-site/src";

function write(rel, content) {
  const fp = path.join(root, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, "utf8");
  return rel;
}

const files = [];

function w(rel, content) {
  write(rel, content);
  files.push(rel);
}

// ─── lib/mark6 ───────────────────────────────────────────────
w("lib/mark6/types.ts", `export type Animal =
  | "鼠" | "牛" | "虎" | "兔" | "龙" | "蛇"
  | "马" | "羊" | "猴" | "鸡" | "狗" | "猪";

export type Wave = "红波" | "蓝波" | "绿波";

export const ALL_ANIMALS: Animal[] = [
  "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪",
];

export interface HongKongDraw {
  period: string;
  date: string;
  numbers: number[];
  special: number;
}

export interface InternationalDraw {
  id: string;
  drawAt: string;
  numbers: number[];
  special: number;
  seedHash: string;
  seed?: string;
  status: "pending" | "drawn";
  source?: "auto" | "manual";
}

export interface SanheGroup {
  animals: [Animal, Animal, Animal];
  element: string;
}

export interface SuiShuFaMap {
  year: number;
  taiSui: Animal;
  remainderMap: Record<number, Animal>;
  animalToRemainder: Record<Animal, number>;
}

export interface ChongHeResult {
  from: Animal;
  to: Animal;
  type: "六冲" | "三合" | "六合" | "自身";
}

export interface CodeAnalysisResult {
  codes: { number: number; animalSui: Animal }[];
  chong: ChongHeResult[];
  sanhe: ChongHeResult[];
  liuhe: ChongHeResult[];
  targets: { animal: Animal; score: number; sources: string[] }[];
  topTargets: Animal[];
}

export interface IdiomDecodeResult {
  idiom: string;
  allMatches: Animal[];
  decodePath: { method: string; keyword: string; result: Animal }[];
}

export interface KnowledgeArticle {
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
}
`);

w("lib/mark6/constants.ts", `import type { Animal, SanheGroup, Wave } from "./types";

export const FIXED_ZODIAC: Record<number, Animal> = {
  1: "鼠", 2: "牛", 3: "虎", 4: "兔", 5: "龙", 6: "蛇", 7: "马", 8: "羊", 9: "猴", 10: "鸡", 11: "狗", 12: "猪",
  13: "鼠", 14: "牛", 15: "虎", 16: "兔", 17: "龙", 18: "蛇", 19: "马", 20: "羊", 21: "猴", 22: "鸡", 23: "狗", 24: "猪",
  25: "鼠", 26: "牛", 27: "虎", 28: "兔", 29: "龙", 30: "蛇", 31: "马", 32: "羊", 33: "猴", 34: "鸡", 35: "狗", 36: "猪",
  37: "鼠", 38: "牛", 39: "虎", 40: "兔", 41: "龙", 42: "蛇", 43: "马", 44: "羊", 45: "猴", 46: "鸡", 47: "狗", 48: "猪",
  49: "鼠",
};

export const ANIMAL_TO_NUMS: Record<Animal, number[]> = {
  鼠: [1, 13, 25, 37, 49], 牛: [2, 14, 26, 38], 虎: [3, 15, 27, 39],
  兔: [4, 16, 28, 40], 龙: [5, 17, 29, 41], 蛇: [6, 18, 30, 42],
  马: [7, 19, 31, 43], 羊: [8, 20, 32, 44], 猴: [9, 21, 33, 45],
  鸡: [10, 22, 34, 46], 狗: [11, 23, 35, 47], 猪: [12, 24, 36, 48],
};

const RED = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
const BLUE = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
const GREEN = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];

export const WAVE_COLORS: Record<number, Wave> = Object.fromEntries([
  ...RED.map((n) => [n, "红波"]),
  ...BLUE.map((n) => [n, "蓝波"]),
  ...GREEN.map((n) => [n, "绿波"]),
]) as Record<number, Wave>;

export const WAVE_HEX: Record<Wave, string> = {
  红波: "#e53935",
  蓝波: "#1e88e5",
  绿波: "#43a047",
};

export function getWaveColor(num: number): Wave {
  return WAVE_COLORS[num] ?? "红波";
}

export function getWaveHex(num: number): string {
  return WAVE_HEX[getWaveColor(num)];
}

export const SANHE_GROUPS: SanheGroup[] = [
  { animals: ["猴", "鼠", "龙"], element: "水局" },
  { animals: ["猪", "兔", "羊"], element: "木局" },
  { animals: ["虎", "马", "狗"], element: "火局" },
  { animals: ["蛇", "鸡", "牛"], element: "金局" },
];

export const LIUHE_PAIRS: [Animal, Animal][] = [
  ["鼠", "牛"], ["虎", "猪"], ["兔", "狗"], ["龙", "鸡"], ["蛇", "猴"], ["马", "羊"],
];

export const LIUCHONG_PAIRS: [Animal, Animal][] = [
  ["鼠", "马"], ["牛", "羊"], ["虎", "猴"], ["兔", "鸡"], ["龙", "狗"], ["蛇", "猪"],
];

export const LIUHE_MAP: Record<Animal, Animal> = {
  鼠: "牛", 牛: "鼠", 虎: "猪", 兔: "狗", 龙: "鸡", 蛇: "猴",
  马: "羊", 羊: "马", 猴: "蛇", 鸡: "龙", 狗: "兔", 猪: "虎",
};

export const LIUCHONG_MAP: Record<Animal, Animal> = {
  鼠: "马", 牛: "羊", 虎: "猴", 兔: "鸡", 龙: "狗", 蛇: "猪",
  马: "鼠", 羊: "牛", 猴: "虎", 鸡: "兔", 狗: "龙", 猪: "蛇",
};

export const TAI_SUI: Record<number, Animal> = {
  2020: "鼠", 2021: "牛", 2022: "虎", 2023: "兔", 2024: "龙",
  2025: "蛇", 2026: "马", 2027: "羊", 2028: "猴", 2029: "鸡",
  2030: "狗", 2031: "猪",
};
`);

w("lib/mark6/suishufa.ts", `import { ALL_ANIMALS, type Animal, type SuiShuFaMap } from "./types";
import { TAI_SUI } from "./constants";

/** BACKWARD: (tsIndex - i + 12) % 12 */
export function buildYearMap(year: number): SuiShuFaMap {
  const taiSui = TAI_SUI[year] ?? "马";
  const tsIndex = ALL_ANIMALS.indexOf(taiSui);
  const remainderMap: Record<number, Animal> = {};

  for (let i = 0; i < 12; i++) {
    const animalIndex = (tsIndex - i + 12) % 12;
    remainderMap[i + 1] = ALL_ANIMALS[animalIndex];
  }
  remainderMap[0] = remainderMap[12];

  const animalToRemainder = {} as Record<Animal, number>;
  for (const [rem, animal] of Object.entries(remainderMap)) {
    animalToRemainder[animal as Animal] = parseInt(rem, 10);
  }

  return { year, taiSui, remainderMap, animalToRemainder };
}

export function decodeBySuiShuFa(number: number, year = 2026): Animal {
  const remainder = number % 12 || 12;
  return buildYearMap(year).remainderMap[remainder];
}

export function getSuiShuFaNumbers(animal: Animal, year = 2026): number[] {
  const rem = buildYearMap(year).animalToRemainder[animal];
  const nums: number[] = [];
  for (let n = rem; n <= 48; n += 12) nums.push(n);
  return nums;
}
`);

w("lib/mark6/zodiac.ts", `import type { Animal } from "./types";
import { ANIMAL_TO_NUMS, FIXED_ZODIAC, LIUCHONG_MAP, LIUHE_MAP, SANHE_GROUPS } from "./constants";

export function numToAnimalStd(n: number): Animal {
  return FIXED_ZODIAC[n] ?? "鼠";
}

export function animalToNumbers(animal: Animal): number[] {
  return ANIMAL_TO_NUMS[animal] ?? [];
}

export function getChongPartner(animal: Animal): Animal {
  return LIUCHONG_MAP[animal];
}

export function getLiuhePartner(animal: Animal): Animal {
  return LIUHE_MAP[animal];
}

export function getSanhePartners(animal: Animal): Animal[] {
  const g = SANHE_GROUPS.find((x) => x.animals.includes(animal));
  return g ? g.animals.filter((a) => a !== animal) : [];
}
`);

w("lib/mark6/code-analyzer.ts", `import type { Animal, ChongHeResult, CodeAnalysisResult } from "./types";
import { decodeBySuiShuFa } from "./suishufa";
import { getChongPartner, getLiuhePartner, getSanhePartners } from "./zodiac";

export function analyzeCodes(codeNumbers: number[], year: number): CodeAnalysisResult {
  const codes = codeNumbers.map((number) => ({
    number,
    animalSui: decodeBySuiShuFa(number, year),
  }));

  const chong: ChongHeResult[] = [];
  const sanhe: ChongHeResult[] = [];
  const liuhe: ChongHeResult[] = [];
  const scoreMap = new Map<Animal, { score: number; sources: string[] }>();

  const add = (animal: Animal, pts: number, src: string) => {
    const e = scoreMap.get(animal) ?? { score: 0, sources: [] };
    e.score += pts;
    if (!e.sources.includes(src)) e.sources.push(src);
    scoreMap.set(animal, e);
  };

  for (const { number, animalSui } of codes) {
    add(animalSui, 1, \`\${number} self\`);
    const c = getChongPartner(animalSui);
    chong.push({ from: animalSui, to: c, type: "六冲" });
    add(c, 4, \`\${animalSui} clash\`);
    for (const t of getSanhePartners(animalSui)) {
      sanhe.push({ from: animalSui, to: t, type: "三合" });
      add(t, 3, \`\${animalSui} triad\`);
    }
    const l = getLiuhePartner(animalSui);
    liuhe.push({ from: animalSui, to: l, type: "六合" });
    add(l, 2, \`\${animalSui} pair\`);
  }

  const targets = Array.from(scoreMap.entries())
    .map(([animal, { score, sources }]) => ({ animal, score, sources }))
    .sort((a, b) => b.score - a.score);

  return { codes, chong, sanhe, liuhe, targets, topTargets: targets.slice(0, 3).map((t) => t.animal) };
}
`);

w("lib/mark6/idiom-decoder.ts", `import type { Animal, IdiomDecodeResult } from "./types";
import idiomLibrary from "@/data/idiom-library.json";

const ITEM: Record<string, Animal> = {
  牛: "牛", 马: "马", 虎: "虎", 龙: "龙", 蛇: "蛇", 羊: "羊",
  猪: "猪", 狗: "狗", 鸡: "鸡", 猴: "猴", 兔: "兔", 鼠: "鼠",
  卵: "鸡", 心猿: "猴", 豕: "猪",
};

export function decodeIdiom(text: string): IdiomDecodeResult {
  const idiom = text.trim();
  const decodePath: IdiomDecodeResult["decodePath"] = [];
  const matches = new Set<Animal>();

  const hit = idiomLibrary.entries.find(
    (e) => e.idiom === idiom || idiom.includes(e.idiom) || e.idiom.includes(idiom)
  );
  if (hit) {
    for (const a of hit.animals) {
      matches.add(a as Animal);
      decodePath.push({ method: "story", keyword: hit.keyword, result: a as Animal });
    }
  }

  for (const [kw, a] of Object.entries(ITEM)) {
    if (idiom.includes(kw)) {
      matches.add(a);
      decodePath.push({ method: "imagery", keyword: kw, result: a });
    }
  }

  return { idiom, allMatches: [...matches], decodePath };
}
`);

w("lib/mark6/trends.ts", `import type { Animal } from "./types";
import { numToAnimalStd } from "./zodiac";

export interface DrawLike {
  numbers: number[];
  special: number;
}

export function frequencyMap(draws: DrawLike[]): Record<number, number> {
  const freq: Record<number, number> = {};
  for (let n = 1; n <= 49; n++) freq[n] = 0;
  for (const d of draws) {
    for (const n of d.numbers) freq[n]++;
    freq[d.special]++;
  }
  return freq;
}

export function topNumbers(freq: Record<number, number>, limit = 20): { num: number; count: number }[] {
  return Object.entries(freq)
    .map(([num, count]) => ({ num: parseInt(num, 10), count }))
    .sort((a, b) => b.count - a.count || a.num - b.num)
    .slice(0, limit);
}

export function animalFrequency(draws: DrawLike[]): Record<Animal, number> {
  const out = {} as Record<Animal, number>;
  for (const d of draws) {
    for (const n of [...d.numbers, d.special]) {
      const a = numToAnimalStd(n);
      out[a] = (out[a] ?? 0) + 1;
    }
  }
  return out;
}
`);

w("lib/mark6/animal-assets.ts", `import type { Animal } from "./types";

export const ANIMAL_SLUG: Record<Animal, string> = {
  鼠: "rat", 牛: "ox", 虎: "tiger", 兔: "rabbit", 龙: "dragon", 蛇: "snake",
  马: "horse", 羊: "goat", 猴: "monkey", 鸡: "rooster", 狗: "dog", 猪: "pig",
};

export function animalImagePath(animal: Animal): string {
  return \`/animals/\${ANIMAL_SLUG[animal]}.svg\`;
}
`);

// ─── lib/draw ────────────────────────────────────────────────
w("lib/draw/verify.ts", `import { createHash } from "crypto";

export function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export function verifySeed(seed: string, seedHash: string): boolean {
  return sha256(seed) === seedHash;
}
`);

w("lib/draw/international-auto.ts", `import { createHash } from "crypto";
import type { InternationalDraw } from "@/lib/mark6/types";
import { sha256 } from "./verify";

export const EPOCH_MS = Date.parse("2026-05-09T12:00:00Z");
const DAY_MS = 86_400_000;

export function dayIndexFromDate(d: Date): number {
  const utcNoon = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0, 0);
  return Math.floor((utcNoon - EPOCH_MS) / DAY_MS);
}

export function periodFromDayIndex(dayIndex: number): string {
  return \`INT-\${String(dayIndex + 1).padStart(3, "0")}\`;
}

export function drawTimeForDayIndex(dayIndex: number): Date {
  return new Date(EPOCH_MS + dayIndex * DAY_MS);
}

export function seedForDayIndex(dayIndex: number): string {
  const dt = drawTimeForDayIndex(dayIndex);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return \`intl-auto-\${y}-\${m}-\${day}\`;
}

export function numbersFromSeed(seed: string): { numbers: number[]; special: number } {
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const picked: number[] = [];
  let round = 0;
  while (picked.length < 7) {
    const hash = createHash("sha256").update(\`\${seed}:\${round}\`).digest("hex");
    for (let i = 0; i < hash.length - 1 && picked.length < 7; i += 2) {
      const n = (parseInt(hash.slice(i, i + 2), 16) % 49) + 1;
      if (pool.includes(n)) {
        pool.splice(pool.indexOf(n), 1);
        picked.push(n);
      }
    }
    round++;
  }
  const numbers = picked.slice(0, 6).sort((a, b) => a - b);
  const special = picked[6];
  return { numbers, special };
}

export function buildAutoDraw(dayIndex: number): InternationalDraw {
  const id = periodFromDayIndex(dayIndex);
  const drawAt = drawTimeForDayIndex(dayIndex).toISOString();
  const seed = seedForDayIndex(dayIndex);
  const seedHash = sha256(seed);
  const { numbers, special } = numbersFromSeed(seed);
  return {
    id,
    drawAt,
    numbers,
    special,
    seedHash,
    seed,
    status: "drawn",
    source: "auto",
  };
}

export function listAutoDraws(now = new Date()): InternationalDraw[] {
  const maxIndex = dayIndexFromDate(now);
  const draws: InternationalDraw[] = [];
  for (let i = 0; i <= maxIndex; i++) {
    const drawTime = drawTimeForDayIndex(i);
    if (now.getTime() >= drawTime.getTime()) {
      draws.push(buildAutoDraw(i));
    }
  }
  return draws.reverse();
}

export function getTodaySchedule(now = new Date()) {
  const dayIndex = dayIndexFromDate(now);
  const drawTime = drawTimeForDayIndex(dayIndex);
  const id = periodFromDayIndex(dayIndex);
  const seed = seedForDayIndex(dayIndex);
  const seedHash = sha256(seed);

  if (now.getTime() < drawTime.getTime()) {
    return {
      phase: "pending" as const,
      id,
      drawAt: drawTime.toISOString(),
      seedHash,
    };
  }

  return { phase: "drawn" as const, draw: buildAutoDraw(dayIndex) };
}

export function getPendingDraw(now = new Date()): InternationalDraw | null {
  const schedule = getTodaySchedule(now);
  if (schedule.phase !== "pending") return null;
  return {
    id: schedule.id!,
    drawAt: schedule.drawAt!,
    numbers: [],
    special: 0,
    seedHash: schedule.seedHash!,
    status: "pending",
    source: "auto",
  };
}
`);

w("lib/draw/hongkong.ts", `import type { HongKongDraw } from "@/lib/mark6/types";
import manualDraws from "@/data/hongkong/draws.json";

const draws = manualDraws as HongKongDraw[];

export function getHongKongDraws(): HongKongDraw[] {
  return [...draws].sort((a, b) => b.period.localeCompare(a.period));
}

export function getHongKongDraw(period: string): HongKongDraw | undefined {
  return draws.find((d) => d.period === period);
}

export function getLatestHongKong(): HongKongDraw | null {
  const list = getHongKongDraws();
  return list[0] ?? null;
}
`);

w("lib/draw/international.ts", `import type { InternationalDraw } from "@/lib/mark6/types";
import persisted from "@/data/international/draws.json";
import { getPendingDraw, listAutoDraws } from "./international-auto";

const manual = persisted as InternationalDraw[];

export function getInternationalDraws(now = new Date()): InternationalDraw[] {
  const auto = listAutoDraws(now);
  const map = new Map<string, InternationalDraw>();
  for (const d of auto) map.set(d.id, d);
  for (const d of manual) map.set(d.id, { ...d, source: "manual" });
  const pending = getPendingDraw(now);
  if (pending) map.set(pending.id, pending);
  return [...map.values()].sort((a, b) => b.id.localeCompare(a.id));
}

export function getInternationalDraw(id: string, now = new Date()): InternationalDraw | undefined {
  return getInternationalDraws(now).find((d) => d.id === id);
}

export function getLatestInternational(now = new Date()): InternationalDraw | null {
  return getInternationalDraws(now)[0] ?? null;
}
`);

w("lib/data/knowledge.ts", `import type { KnowledgeArticle } from "@/lib/mark6/types";
import kb from "@/data/knowledge-base.json";

export function getArticles(): KnowledgeArticle[] {
  return kb.articles as KnowledgeArticle[];
}

export function getArticle(slug: string): KnowledgeArticle | undefined {
  return getArticles().find((a) => a.slug === slug);
}
`);

// ─── data ────────────────────────────────────────────────────
w("data/hongkong/draws.json", `[]\n`);

w("data/hongkong/README.md", `# Hong Kong Draw data

Manual entry only — verified HKJC results. Never auto-generated.
`);

w("data/international/draws.json", `[]\n`);

w("data/knowledge-base.json", JSON.stringify({
  articles: [
    { slug: "anma-chonghe", title: "暗码冲合：六合、三合与六冲", titleEn: "Dark codes: pairs, triads & clashes", excerpt: "暗码通过冲合关系推导目标生肖。", excerptEn: "Dark codes point via clash/combine rules.", content: "## 核心\\n\\n暗码用**岁数法**生肖做六冲、三合、六合推导。", category: "knowledge", tags: ["暗码"], publishedAt: "2026-01-15" },
    { slug: "suishufa-guide", title: "岁数法：号码÷12取余", titleEn: "Age method: number ÷ 12", excerpt: "2026马年：余1马、余2蛇…逆序排列。", excerptEn: "2026 Horse year backward mapping.", content: "## 2026\\n\\n余1=马 余2=蛇 余3=龙 余4=兔 余5=虎 余6=牛", category: "knowledge", tags: ["岁数法"], publishedAt: "2026-01-20" },
    { slug: "hongzi-decode", title: "红字解码", titleEn: "Idiom decoding", excerpt: "典故、意象、物品等多路径。", excerptEn: "Library, imagery, items.", content: "## 路线\\n\\n1. 典故库\\n2. 物品指代", category: "knowledge", tags: ["红字"], publishedAt: "2026-02-01" },
    { slug: "overseas-legal", title: "海外参与须知", titleEn: "Playing overseas", excerpt: "资讯与教育，非投注建议。", excerptEn: "Information only, not betting advice.", content: "## 说明\\n\\n请遵守当地法律。", category: "guide", tags: ["海外"], publishedAt: "2026-01-01" },
  ],
}, null, 2) + "\n");

w("data/idiom-library.json", JSON.stringify({
  entries: [
    { idiom: "兵不厌诈", keyword: "火牛阵", animals: ["牛"] },
    { idiom: "马齿徒增", keyword: "历齿", animals: ["马"] },
    { idiom: "众目睽睽", keyword: "红眼", animals: ["兔"] },
    { idiom: "去恶行善", keyword: "心猿", animals: ["猴"] },
    { idiom: "顺手牵羊", keyword: "牵猴", animals: ["猴"] },
    { idiom: "如山压卵", keyword: "卵", animals: ["鸡"] },
    { idiom: "老泪纵横", keyword: "龙王", animals: ["龙"] },
  ],
}, null, 2) + "\n");

w("data/analysis-samples.json", JSON.stringify({
  samples: [
    { issue: "2026-056", idiom: "虎虎生威", codes: "3 15 27 39", year: 2026 },
    { issue: "INT-001", idiom: "龙马精神", codes: "7 19 31 43", year: 2026 },
  ],
}, null, 2) + "\n");

// ─── i18n & middleware ───────────────────────────────────────
w("i18n/routing.ts", `import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
});
`);

w("i18n/request.ts", `import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "zh")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(\`../../messages/\${locale}.json\`)).default,
  };
});
`);

w("i18n/navigation.ts", `import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
`);

w("middleware.ts", `import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|zh)/:path*"],
};
`);

// ─── components ──────────────────────────────────────────────
w("components/shared/UsageGuide.tsx", `import { useTranslations } from "next-intl";

export default function UsageGuide({
  titleKey,
  whatKey,
  howKey,
}: {
  titleKey: string;
  whatKey: string;
  howKey: string;
}) {
  const t = useTranslations("usage");
  return (
    <aside className="mb-8 rounded-xl border border-surface-border bg-surface-card/80 p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">{t("label")}</p>
      <h2 className="mb-2 text-lg font-semibold text-text">{t(titleKey)}</h2>
      <p className="mb-1 text-sm text-text-muted">{t(whatKey)}</p>
      <p className="text-sm text-text-muted">{t(howKey)}</p>
    </aside>
  );
}
`);

w("components/shared/AnimalLabel.tsx", `"use client";

import { useTranslations } from "next-intl";
import type { Animal } from "@/lib/mark6/types";

export default function AnimalLabel({ animal }: { animal: Animal }) {
  const t = useTranslations("animals");
  return <span>{t(animal)}</span>;
}
`);

w("components/legal/LegalNotice.tsx", `import { useTranslations } from "next-intl";

export default function LegalNotice({ compact }: { compact?: boolean }) {
  const t = useTranslations("legal");
  const company = t("companyName");
  const jurisdiction = t("jurisdiction");
  const regNumber = t("regNumber");

  if (compact) {
    return (
      <p className="text-xs text-text-muted">
        {t("footerCopyright", { year: new Date().getFullYear(), company })}
      </p>
    );
  }

  return (
    <section className="rounded-xl border border-surface-border bg-surface-raised p-6 shadow-gold">
      <h2 className="mb-4 text-lg font-semibold text-gold">{t("noticeTitle")}</h2>
      <p className="mb-2 text-sm text-text">{t("operatorLine", { company })}</p>
      <p className="mb-4 text-sm text-text-muted">{t("registeredLine", { jurisdiction, regNumber })}</p>
      <p className="mb-2 text-sm font-medium text-text">{t("complianceTitle")}</p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-muted">
        <li>{t("law1")}</li>
        <li>{t("law2")}</li>
        <li>{t("law3")}</li>
      </ul>
      <p className="mb-2 text-sm font-medium text-text">{t("fairTitle")}</p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-muted">
        <li>{t("fair1")}</li>
        <li>{t("fair2")}</li>
        <li>{t("fair3")}</li>
      </ul>
      <p className="text-sm text-text-muted">{t("ageLimit")}</p>
      <p className="text-sm text-text-muted">{t("responsible")}</p>
    </section>
  );
}
`);

w("components/legal/SiteFooter.tsx", `import { useTranslations } from "next-intl";
import LegalNotice from "./LegalNotice";

export default function SiteFooter() {
  const t = useTranslations("legal");
  const tb = useTranslations("brand");
  const company = t("companyName");
  const jurisdiction = t("jurisdiction");
  const regNumber = t("regNumber");

  return (
    <footer className="mt-12 border-t border-surface-border bg-surface-raised px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-lg font-semibold text-gold">{tb("logoFull")}</p>
          <p className="text-sm text-text-muted">{tb("tagline")}</p>
        </div>
        <p className="mb-2 text-sm text-text-muted">
          {t("operatorLine", { company })} · {t("registeredLine", { jurisdiction, regNumber })}
        </p>
        <p className="mb-4 text-xs text-text-muted">{t("footerFair")}</p>
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-gold-dim">
          <span>{t("viewAbout")}</span>
          <span>{t("viewTerms")}</span>
          <span>{t("viewPrivacy")}</span>
          <span>{t("viewResponsible")}</span>
        </div>
        <LegalNotice compact />
        <p className="mt-2 text-xs text-text-muted">{t("footerReg", { jurisdiction, regNumber })}</p>
      </div>
    </footer>
  );
}
`);

w("components/layout/LangSwitcher.tsx", `"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "en" ? "zh" : "en";
  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className="rounded border border-surface-border px-2 py-1 text-xs text-gold hover:bg-surface-card"
    >
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
`);

w("components/layout/Header.tsx", `"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LangSwitcher from "./LangSwitcher";

const links = [
  { href: "/", key: "home" },
  { href: "/results/hongkong", key: "hongkong" },
  { href: "/results/international", key: "international" },
  { href: "/trends", key: "trends" },
  { href: "/zodiac", key: "zodiac" },
  { href: "/rules", key: "rules" },
  { href: "/knowledge", key: "knowledge" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tb = useTranslations("brand");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <span className="hidden font-bold text-gold sm:inline">{tb("logoFull")}</span>
          <span className="font-bold text-gold sm:hidden">{tb("logoShort")}</span>
        </Link>
        <nav className="hidden flex-wrap items-center gap-1 lg:flex">
          {links.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={\`rounded px-2 py-1 text-sm \${pathname === href || pathname.startsWith(href + "/") ? "bg-surface-card text-gold" : "text-text-muted hover:text-text"}\`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <LangSwitcher />
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-surface-border px-2 py-2 lg:hidden">
        {links.map(({ href, key }) => (
          <Link key={key} href={href} className="whitespace-nowrap rounded px-2 py-1 text-xs text-text-muted hover:text-gold">
            {t(key)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
`);

w("components/results/NumberBall.tsx", `import { getWaveColor, getWaveHex } from "@/lib/mark6/constants";
import type { Animal } from "@/lib/mark6/types";
import AnimalLabel from "@/components/shared/AnimalLabel";

export default function NumberBall({
  num,
  zodiac,
  size = "md",
  showZodiac = true,
}: {
  num: number;
  zodiac?: Animal;
  size?: "sm" | "md" | "lg";
  showZodiac?: boolean;
}) {
  const sz = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={\`inline-flex items-center justify-center rounded-full font-bold text-white shadow-md \${sz}\`}
        style={{ backgroundColor: getWaveHex(num) }}
        title={getWaveColor(num)}
      >
        {String(num).padStart(2, "0")}
      </span>
      {showZodiac && zodiac && (
        <span className="text-[10px] text-text-muted">
          <AnimalLabel animal={zodiac} />
        </span>
      )}
    </div>
  );
}
`);

w("components/results/DrawBalls.tsx", `import type { Animal } from "@/lib/mark6/types";
import { numToAnimalStd } from "@/lib/mark6/zodiac";
import NumberBall from "./NumberBall";

export default function DrawBalls({
  numbers,
  special,
  pending,
}: {
  numbers: number[];
  special?: number;
  pending?: boolean;
}) {
  if (pending) {
    return <p className="text-sm text-text-muted">—</p>;
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {numbers.map((n) => (
          <NumberBall key={n} num={n} zodiac={numToAnimalStd(n)} />
        ))}
      </div>
      {special !== undefined && (
        <div className="flex items-center gap-3">
          <NumberBall num={special} zodiac={numToAnimalStd(special)} size="lg" />
        </div>
      )}
    </div>
  );
}
`);

w("components/results/HongKongEmpty.tsx", `import { useTranslations } from "next-intl";

export default function HongKongEmpty() {
  const t = useTranslations("results");
  return (
    <div className="rounded-xl border border-dashed border-surface-border bg-surface-card/50 p-10 text-center">
      <h2 className="mb-3 text-lg font-semibold text-gold">{t("hkEmptyTitle")}</h2>
      <p className="mx-auto max-w-xl text-sm text-text-muted">{t("hkEmptyBody")}</p>
    </div>
  );
}
`);

w("components/results/IntlDrawCard.tsx", `import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { InternationalDraw } from "@/lib/mark6/types";
import DrawBalls from "./DrawBalls";

export default function IntlDrawCard({ draw }: { draw: InternationalDraw }) {
  const t = useTranslations("results");
  const pending = draw.status === "pending";

  return (
    <article className="rounded-xl border border-surface-border bg-surface-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-text">{draw.id}</h3>
          <p className="text-xs text-text-muted">{t("drawnAt")}: {new Date(draw.drawAt).toLocaleString()}</p>
        </div>
        {pending && (
          <span className="rounded bg-gold/20 px-2 py-1 text-xs text-gold">{t("intlPendingTitle")}</span>
        )}
      </div>
      {pending ? (
        <>
          <p className="mb-3 text-sm text-text-muted">{t("intlPendingBody")}</p>
          <p className="mb-1 text-xs text-text-muted">{t("seedHash")}</p>
          <code className="block break-all rounded bg-surface-raised p-2 text-xs text-gold">{draw.seedHash}</code>
        </>
      ) : (
        <DrawBalls numbers={draw.numbers} special={draw.special} />
      )}
      <Link href={\`/results/international/\${draw.id}\`} className="mt-4 inline-block text-sm text-gold hover:underline">
        {t("viewDetail")}
      </Link>
    </article>
  );
}
`);

w("components/results/HkDrawCard.tsx", `import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { HongKongDraw } from "@/lib/mark6/types";
import DrawBalls from "./DrawBalls";

export default function HkDrawCard({ draw }: { draw: HongKongDraw }) {
  const t = useTranslations("results");
  return (
    <article className="rounded-xl border border-surface-border bg-surface-card p-5">
      <h3 className="mb-1 font-semibold">{draw.period}</h3>
      <p className="mb-3 text-xs text-text-muted">{draw.date}</p>
      <DrawBalls numbers={draw.numbers} special={draw.special} />
      <Link href={\`/results/hongkong/\${draw.period}\`} className="mt-4 inline-block text-sm text-gold hover:underline">
        {t("viewDetail")}
      </Link>
    </article>
  );
}
`);

w("components/results/VerifyFairness.tsx", `"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { verifySeed } from "@/lib/draw/verify";

export default function VerifyFairness({ seedHash, seed }: { seedHash: string; seed?: string }) {
  const t = useTranslations("results");
  const [input, setInput] = useState(seed ?? "");
  const [result, setResult] = useState<"idle" | "ok" | "fail">("idle");

  const check = () => {
    setResult(verifySeed(input.trim(), seedHash) ? "ok" : "fail");
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5">
      <h3 className="mb-3 font-semibold text-gold">{t("fairness")}</h3>
      <p className="mb-1 text-xs text-text-muted">{t("seedHash")}</p>
      <code className="mb-3 block break-all rounded bg-surface-raised p-2 text-xs">{seedHash}</code>
      {seed && (
        <>
          <p className="mb-1 text-xs text-text-muted">{t("seed")}</p>
          <code className="mb-3 block break-all rounded bg-surface-raised p-2 text-xs">{seed}</code>
        </>
      )}
      {!seed && (
        <>
          <label className="mb-1 block text-xs text-text-muted">{t("seed")}</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-2 w-full rounded border border-surface-border bg-surface-raised px-3 py-2 text-sm"
          />
          <button type="button" onClick={check} className="rounded bg-gold px-4 py-2 text-sm font-medium text-surface">
            Verify
          </button>
        </>
      )}
      {seed && verifySeed(seed, seedHash) && <p className="mt-2 text-sm text-ball-green">{t("verified")}</p>}
      {result === "ok" && <p className="mt-2 text-sm text-ball-green">{t("verified")}</p>}
      {result === "fail" && <p className="mt-2 text-sm text-ball-red">{t("failed")}</p>}
    </div>
  );
}
`);

w("components/zodiac/AnimalSvg.tsx", `import Image from "next/image";
import type { Animal } from "@/lib/mark6/types";
import { animalImagePath } from "@/lib/mark6/animal-assets";

export default function AnimalSvg({ animal, size = 64 }: { animal: Animal; size?: number }) {
  return (
    <Image
      src={animalImagePath(animal)}
      alt={animal}
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}
`);

w("components/zodiac/FixedZodiacGrid.tsx", `import { ALL_ANIMALS } from "@/lib/mark6/types";
import { animalToNumbers } from "@/lib/mark6/zodiac";
import AnimalSvg from "./AnimalSvg";
import NumberBall from "@/components/results/NumberBall";
import AnimalLabel from "@/components/shared/AnimalLabel";

export default function FixedZodiacGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {ALL_ANIMALS.map((animal) => (
        <div key={animal} className="rounded-xl border border-surface-border bg-surface-card p-4 text-center">
          <AnimalSvg animal={animal} size={72} />
          <p className="mt-2 font-medium"><AnimalLabel animal={animal} /></p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {animalToNumbers(animal).map((n) => (
              <NumberBall key={n} num={n} size="sm" showZodiac={false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
`);

w("components/zodiac/SuiShuFaTable.tsx", `import { useTranslations } from "next-intl";
import { buildYearMap } from "@/lib/mark6/suishufa";
import { getSuiShuFaNumbers } from "@/lib/mark6/suishufa";
import { ALL_ANIMALS } from "@/lib/mark6/types";
import NumberBall from "@/components/results/NumberBall";
import AnimalLabel from "@/components/shared/AnimalLabel";

export default function SuiShuFaTable({ year = 2026 }: { year?: number }) {
  const t = useTranslations("zodiac");
  const map = buildYearMap(year);
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">{t("ageNote")}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_ANIMALS.map((animal) => {
          const rem = map.animalToRemainder[animal];
          return (
            <div key={animal} className="rounded-lg border border-surface-border p-3">
              <p className="mb-2 text-sm font-medium">
                {t("remLabel", { rem })} = <AnimalLabel animal={animal} />
              </p>
              <div className="flex flex-wrap gap-1">
                {getSuiShuFaNumbers(animal, year).map((n) => (
                  <NumberBall key={n} num={n} size="sm" showZodiac={false} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
`);

w("components/zodiac/SanheTriangle.tsx", `"use client";

import { useTranslations } from "next-intl";
import { SANHE_GROUPS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "@/components/shared/AnimalLabel";

const ELEMENT_KEYS: Record<string, string> = {
  水局: "water", 木局: "wood", 火局: "fire", 金局: "metal",
};

export default function SanheTriangle() {
  const t = useTranslations("zodiac");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {SANHE_GROUPS.map((g) => (
        <div key={g.element} className="rounded-xl border border-surface-border bg-surface-card p-4">
          <p className="mb-4 text-center text-sm font-semibold text-gold">
            {t(ELEMENT_KEYS[g.element] ?? "water")}
          </p>
          <svg viewBox="0 0 240 200" className="mx-auto w-full max-w-xs">
            <polygon points="120,20 40,160 200,160" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.5" />
            {g.animals.map((animal, i) => {
              const pos = [
                { x: 120, y: 30 },
                { x: 50, y: 150 },
                { x: 190, y: 150 },
              ][i];
              return (
                <foreignObject key={animal} x={pos.x - 36} y={pos.y - 36} width={72} height={88}>
                  <div className="flex flex-col items-center">
                    <AnimalSvg animal={animal} size={56} />
                    <span className="text-[10px] text-text"><AnimalLabel animal={animal} /></span>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>
      ))}
    </div>
  );
}
`);

w("components/zodiac/LiuhePairs.tsx", `"use client";

import { useTranslations } from "next-intl";
import { LIUHE_PAIRS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "@/components/shared/AnimalLabel";

export default function LiuhePairs() {
  const t = useTranslations("zodiac");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LIUHE_PAIRS.map(([a, b]) => (
        <div key={\`\${a}-\${b}\`} className="flex items-center justify-center gap-3 rounded-xl border border-ball-green/30 bg-surface-card p-4">
          <div className="text-center">
            <AnimalSvg animal={a} size={48} />
            <p className="text-xs"><AnimalLabel animal={a} /></p>
          </div>
          <span className="text-ball-green">↔</span>
          <div className="text-center">
            <AnimalSvg animal={b} size={48} />
            <p className="text-xs"><AnimalLabel animal={b} /></p>
          </div>
          <span className="rounded bg-ball-green/20 px-2 py-0.5 text-[10px] text-ball-green">{t("liuheBadge")}</span>
        </div>
      ))}
    </div>
  );
}
`);

w("components/zodiac/LiuchongPairs.tsx", `"use client";

import { useTranslations } from "next-intl";
import { LIUCHONG_PAIRS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "@/components/shared/AnimalLabel";

export default function LiuchongPairs() {
  const t = useTranslations("zodiac");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LIUCHONG_PAIRS.map(([a, b]) => (
        <div key={\`\${a}-\${b}\`} className="flex items-center justify-center gap-3 rounded-xl border border-ball-red/30 bg-surface-card p-4">
          <div className="text-center">
            <AnimalSvg animal={a} size={48} />
            <p className="text-xs"><AnimalLabel animal={a} /></p>
          </div>
          <span className="text-ball-red">⇄</span>
          <div className="text-center">
            <AnimalSvg animal={b} size={48} />
            <p className="text-xs"><AnimalLabel animal={b} /></p>
          </div>
          <span className="rounded bg-ball-red/20 px-2 py-0.5 text-[10px] text-ball-red">{t("liuchongBadge")}</span>
        </div>
      ))}
    </div>
  );
}
`);

w("components/zodiac/ZodiacLookup.tsx", `"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ALL_ANIMALS, type Animal } from "@/lib/mark6/types";
import { decodeBySuiShuFa } from "@/lib/mark6/suishufa";
import { numToAnimalStd, animalToNumbers } from "@/lib/mark6/zodiac";
import NumberBall from "@/components/results/NumberBall";
import AnimalLabel from "@/components/shared/AnimalLabel";
import AnimalSvg from "./AnimalSvg";

export default function ZodiacLookup() {
  const t = useTranslations("lookup");
  const [num, setNum] = useState("");
  const [selected, setSelected] = useState<Animal | null>(null);
  const year = 2026;
  const n = parseInt(num, 10);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-surface-border bg-surface-card p-5">
        <h3 className="mb-3 font-semibold">{t("byNumber")}</h3>
        <input
          type="number"
          min={1}
          max={49}
          value={num}
          onChange={(e) => setNum(e.target.value)}
          placeholder={t("inputNumber")}
          className="mb-4 w-full rounded border border-surface-border bg-surface-raised px-3 py-2"
        />
        {n >= 1 && n <= 49 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <NumberBall num={n} size="lg" showZodiac={false} />
              <div>
                <p className="text-sm">{t("fixed")}: <AnimalLabel animal={numToAnimalStd(n)} /></p>
                <p className="text-sm">{t("ageMethod", { year })}: <AnimalLabel animal={decodeBySuiShuFa(n, year)} /></p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-xl border border-surface-border bg-surface-card p-5">
        <h3 className="mb-3 font-semibold">{t("byAnimal")}</h3>
        <div className="mb-4 grid grid-cols-4 gap-2">
          {ALL_ANIMALS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setSelected(a)}
              className={\`rounded border p-1 \${selected === a ? "border-gold bg-gold/10" : "border-surface-border"}\`}
            >
              <AnimalSvg animal={a} size={40} />
            </button>
          ))}
        </div>
        {selected && (
          <div className="flex flex-wrap gap-2">
            {animalToNumbers(selected).map((x) => (
              <NumberBall key={x} num={x} zodiac={selected} size="sm" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`);

w("components/trends/FrequencyChart.tsx", `"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getWaveHex } from "@/lib/mark6/constants";

export default function FrequencyChart({ data }: { data: { num: number; count: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="num" tick={{ fill: "#9898a8", fontSize: 10 }} />
          <YAxis tick={{ fill: "#9898a8", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#1a1a24", border: "1px solid #2a2a38" }} />
          <Bar dataKey="count">
            {data.map((d) => (
              <Cell key={d.num} fill={getWaveHex(d.num)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
`);

w("components/trends/HotColdGrid.tsx", `"use client";

import { getWaveHex } from "@/lib/mark6/constants";

export default function HotColdGrid({ freq }: { freq: Record<number, number> }) {
  const max = Math.max(...Object.values(freq), 1);
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 49 }, (_, i) => i + 1).map((n) => {
        const c = freq[n] ?? 0;
        const opacity = 0.2 + (c / max) * 0.8;
        return (
          <div
            key={n}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: getWaveHex(n), opacity }}
            title={String(c)}
          >
            {String(n).padStart(2, "0")}
          </div>
        );
      })}
    </div>
  );
}
`);

w("components/trends/TrackTabs.tsx", `"use client";

import { useTranslations } from "next-intl";

export default function TrackTabs({
  track,
  onChange,
}: {
  track: "hk" | "intl";
  onChange: (t: "hk" | "intl") => void;
}) {
  const t = useTranslations("trends");
  return (
    <div className="mb-6 flex gap-2">
      {(["hk", "intl"] as const).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={\`rounded-lg px-4 py-2 text-sm \${track === key ? "bg-gold text-surface" : "border border-surface-border text-text-muted"}\`}
        >
          {key === "hk" ? t("trackHk") : t("trackIntl")}
        </button>
      ))}
    </div>
  );
}
`);

w("components/trends/TrendsPanel.tsx", `"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { HongKongDraw, InternationalDraw } from "@/lib/mark6/types";
import { frequencyMap, topNumbers } from "@/lib/mark6/trends";
import TrackTabs from "./TrackTabs";
import FrequencyChart from "./FrequencyChart";
import HotColdGrid from "./HotColdGrid";

export default function TrendsPanel({
  hkDraws,
  intlDraws,
}: {
  hkDraws: HongKongDraw[];
  intlDraws: InternationalDraw[];
}) {
  const t = useTranslations("trends");
  const [track, setTrack] = useState<"hk" | "intl">("hk");
  const draws = track === "hk" ? hkDraws : intlDraws.filter((d) => d.status !== "pending");
  const freq = useMemo(() => frequencyMap(draws), [draws]);
  const top = useMemo(() => topNumbers(freq), [freq]);

  return (
    <>
      <TrackTabs track={track} onChange={setTrack} />
      <p className="mb-4 text-sm text-text-muted">{t("draws", { count: draws.length })}</p>
      <h3 className="mb-2 font-semibold">{t("freqChart")}</h3>
      <FrequencyChart data={top} />
      <h3 className="mb-2 mt-8 font-semibold">{t("hotCold")}</h3>
      <p className="mb-3 text-xs text-text-muted">{t("hotColdHint")}</p>
      <HotColdGrid freq={freq} />
    </>
  );
}
`);

w("components/analysis/IdiomWorkbench.tsx", `"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { decodeIdiom } from "@/lib/mark6/idiom-decoder";
import AnimalSvg from "@/components/zodiac/AnimalSvg";
import AnimalLabel from "@/components/shared/AnimalLabel";

export default function IdiomWorkbench() {
  const t = useTranslations("idiom");
  const tp = useTranslations("idiomPaths");
  const [input, setInput] = useState("");
  const result = input.trim() ? decodeIdiom(input) : null;

  return (
    <div className="space-y-4">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("input")}
        className="w-full rounded border border-surface-border bg-surface-raised px-3 py-2"
      />
      <button type="button" className="rounded bg-gold px-4 py-2 text-sm text-surface">{t("decode")}</button>
      {result && result.allMatches.length === 0 && <p className="text-sm text-text-muted">{t("noResult")}</p>}
      {result && result.allMatches.length > 0 && (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">{t("pointing")}</p>
            <div className="flex flex-wrap gap-4">
              {result.allMatches.map((a) => (
                <div key={a} className="text-center">
                  <AnimalSvg animal={a} size={56} />
                  <p className="text-xs"><AnimalLabel animal={a} /></p>
                </div>
              ))}
            </div>
          </div>
          {result.decodePath.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">{t("path")}</p>
              <ul className="space-y-1 text-sm text-text-muted">
                {result.decodePath.map((p, i) => (
                  <li key={i}>{tp(p.method as "story")}: {p.keyword} → <AnimalLabel animal={p.result} /></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
`);

w("components/analysis/CodesWorkbench.tsx", `"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { analyzeCodes } from "@/lib/mark6/code-analyzer";
import { getSuiShuFaNumbers } from "@/lib/mark6/suishufa";
import type { Animal } from "@/lib/mark6/types";
import NumberBall from "@/components/results/NumberBall";
import AnimalSvg from "@/components/zodiac/AnimalSvg";
import AnimalLabel from "@/components/shared/AnimalLabel";

function parseCodes(s: string): number[] {
  return s.split(/[\\s,，、]+/).map((x) => parseInt(x.trim(), 10)).filter((n) => n >= 1 && n <= 49);
}

export default function CodesWorkbench() {
  const t = useTranslations("codes");
  const tr = useTranslations("relations");
  const [codes, setCodes] = useState("");
  const [year, setYear] = useState(2026);
  const result = parseCodes(codes).length >= 1 ? analyzeCodes(parseCodes(codes), year) : null;
  const top = result?.targets[0]?.animal;

  return (
    <div className="space-y-4">
      <input
        value={codes}
        onChange={(e) => setCodes(e.target.value)}
        placeholder={t("input")}
        className="w-full rounded border border-surface-border bg-surface-raised px-3 py-2"
      />
      <label className="flex items-center gap-2 text-sm">
        {t("year")}
        <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))} className="w-24 rounded border border-surface-border bg-surface-raised px-2 py-1" />
      </label>
      {result && (
        <>
          <div>
            <p className="mb-2 font-medium">{t("mapping")}</p>
            <div className="flex flex-wrap gap-3">
              {result.codes.map((c) => (
                <NumberBall key={c.number} num={c.number} zodiac={c.animalSui} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-medium">{t("ranking")}</p>
            <ul className="space-y-2">
              {result.targets.slice(0, 6).map((x) => (
                <li key={x.animal} className="flex items-center gap-2 text-sm">
                  <AnimalSvg animal={x.animal} size={32} />
                  <AnimalLabel animal={x.animal} /> — {x.score}
                </li>
              ))}
            </ul>
          </div>
          {top && (
            <div>
              <p className="mb-2 font-medium">{t("topPick")}: <AnimalLabel animal={top as Animal} /></p>
              <p className="mb-2 text-sm">{t("numbers")}</p>
              <div className="flex flex-wrap gap-2">
                {getSuiShuFaNumbers(top, year).map((n) => (
                  <NumberBall key={n} num={n} size="sm" showZodiac={false} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
`);

w("components/rules/RulesSection.tsx", `import { useTranslations } from "next-intl";
import NumberBall from "@/components/results/NumberBall";
import { ALL_ANIMALS } from "@/lib/mark6/types";
import { animalToNumbers } from "@/lib/mark6/zodiac";
import { WAVE_HEX } from "@/lib/mark6/constants";
import AnimalLabel from "@/components/shared/AnimalLabel";

export function BasicRules({ track }: { track: "hk" | "intl" }) {
  const t = useTranslations("rules");
  const tl = useTranslations("legal");
  const company = tl("companyName");
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-gold">{t("basicTitle")}</h2>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="text-text-muted">{t("rangeLabel")}</dt><dd>{t("rangeValue")}</dd></div>
        <div><dt className="text-text-muted">{t("drawFormat")}</dt><dd>{t("drawFormatValue")}</dd></div>
        <div><dt className="text-text-muted">{t("scheduleLabel")}</dt><dd>{track === "hk" ? t("hkSchedule") : t("intlSchedule")}</dd></div>
        <div><dt className="text-text-muted">{t("sourceLabel")}</dt><dd>{track === "hk" ? t("hkSource") : t("intlSource", { company })}</dd></div>
      </dl>
    </section>
  );
}

export function BetTable({ rows }: { rows: [string, string][] }) {
  const t = useTranslations("rules");
  return (
    <table className="mb-8 w-full text-left text-sm">
      <thead><tr className="border-b border-surface-border text-gold"><th className="py-2">{t("betType")}</th><th>{t("betDesc")}</th></tr></thead>
      <tbody>
        {rows.map(([k, d]) => (
          <tr key={k} className="border-b border-surface-border/50"><td className="py-2 pr-4">{t(k)}</td><td className="text-text-muted">{t(d)}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

export function ZodiacWaveReference() {
  const t = useTranslations("rules");
  return (
    <>
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold text-gold">{t("zodiacTitle")}</h2>
        <p className="mb-4 text-sm text-text-muted">{t("zodiacNote")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ALL_ANIMALS.map((a) => (
            <div key={a} className="flex flex-wrap items-center gap-2 rounded border border-surface-border p-2">
              <AnimalLabel animal={a} />:
              {animalToNumbers(a).map((n) => <NumberBall key={n} num={n} size="sm" showZodiac={false} />)}
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gold">{t("waveTitle")}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          {(["红波", "蓝波", "绿波"] as const).map((w) => (
            <span key={w} className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: WAVE_HEX[w] }} />
              {t(w === "红波" ? "waveRed" : w === "蓝波" ? "waveBlue" : "waveGreen")}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
`);

// ─── app ─────────────────────────────────────────────────────
w("app/globals.css", `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  @apply bg-surface text-text antialiased;
}
`);

w("app/layout.tsx", `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Hong Kong International Mark Six",
  description: "Hong Kong Draw and International Draw",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
`);

w("app/page.tsx", `import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
}
`);

w("app/not-found.tsx", `export default function NotFound() {
  return <div className="flex min-h-screen items-center justify-center bg-surface text-text">404</div>;
}
`);

w("app/[locale]/layout.tsx", `import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import SiteFooter from "@/components/legal/SiteFooter";
import LegalNotice from "@/components/legal/LegalNotice";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as "en" | "zh")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
          <div className="mt-10">
            <LegalNotice />
          </div>
        </main>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}
`);

w("app/[locale]/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import HkDrawCard from "@/components/results/HkDrawCard";
import IntlDrawCard from "@/components/results/IntlDrawCard";
import { getLatestHongKong } from "@/lib/draw/hongkong";
import { getLatestInternational } from "@/lib/draw/international";
import { getArticles } from "@/lib/data/knowledge";

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("home");
  const tn = useTranslations("nav");
  const tk = useTranslations("knowledge");
  const hk = getLatestHongKong();
  const intl = getLatestInternational();
  const articles = getArticles().slice(0, 3);
  const en = locale === "en";

  return (
    <>
      <UsageGuide titleKey="homeTitle" whatKey="homeWhat" howKey="homeHow" />
      <h1 className="mb-2 text-3xl font-bold text-gold">{t("title")}</h1>
      <p className="mb-8 text-text-muted">{t("subtitle")}</p>
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-surface-border bg-surface-card p-5">
          <h2 className="mb-1 font-semibold text-gold">{t("hkCard")}</h2>
          <p className="mb-4 text-sm text-text-muted">{t("hkDesc")}</p>
          {hk ? <HkDrawCard draw={hk} /> : <p className="text-sm text-text-muted">{t("latestHk")}: —</p>}
          <Link href="/results/hongkong" className="mt-3 inline-block text-sm text-gold">{t("viewAll")}</Link>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-card p-5">
          <h2 className="mb-1 font-semibold text-gold">{t("intlCard")}</h2>
          <p className="mb-4 text-sm text-text-muted">{t("intlDesc")}</p>
          {intl && <IntlDrawCard draw={intl} />}
          <Link href="/results/international" className="mt-3 inline-block text-sm text-gold">{t("viewAll")}</Link>
        </div>
      </div>
      <h2 className="mb-4 font-semibold">{t("quickNav")}</h2>
      <div className="mb-10 flex flex-wrap gap-2">
        {(["hongkong", "international", "zodiac", "trends", "rules"] as const).map((k) => (
          <Link key={k} href={k === "hongkong" ? "/results/hongkong" : k === "international" ? "/results/international" : \`/\${k}\`} className="rounded-lg border border-surface-border px-4 py-2 text-sm hover:border-gold">
            {tn(k)}
          </Link>
        ))}
      </div>
      <h2 className="mb-4 font-semibold">{t("featured")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.slug} href={\`/knowledge/\${a.slug}\`} className="rounded-xl border border-surface-border bg-surface-card p-4 hover:border-gold">
            <h3 className="font-medium">{en ? a.titleEn : a.title}</h3>
            <p className="mt-1 text-xs text-text-muted">{en ? a.excerptEn : a.excerpt}</p>
            <span className="mt-2 inline-block text-xs text-gold">{tk("read")}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
`);

w("app/[locale]/results/hongkong/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import UsageGuide from "@/components/shared/UsageGuide";
import HongKongEmpty from "@/components/results/HongKongEmpty";
import HkDrawCard from "@/components/results/HkDrawCard";
import { getHongKongDraws } from "@/lib/draw/hongkong";

export default function HongKongListPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("results");
  const draws = getHongKongDraws();

  return (
    <>
      <UsageGuide titleKey="hkListTitle" whatKey="hkListWhat" howKey="hkListHow" />
      <h1 className="mb-2 text-2xl font-bold text-gold">{t("hkTitle")}</h1>
      <p className="mb-6 text-sm text-text-muted">{t("count", { count: draws.length })}</p>
      {draws.length === 0 ? (
        <HongKongEmpty />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">{draws.map((d) => <HkDrawCard key={d.period} draw={d} />)}</div>
      )}
    </>
  );
}
`);

w("app/[locale]/results/hongkong/[period]/page.tsx", `import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import DrawBalls from "@/components/results/DrawBalls";
import { getHongKongDraw } from "@/lib/draw/hongkong";
import { getWaveColor } from "@/lib/mark6/constants";
import { numToAnimalStd } from "@/lib/mark6/zodiac";
import AnimalLabel from "@/components/shared/AnimalLabel";

export default function HongKongDetailPage({ params: { locale, period } }: { params: { locale: string; period: string } }) {
  setRequestLocale(locale);
  const draw = getHongKongDraw(period);
  if (!draw) notFound();
  const t = useTranslations("results");
  const tw = useTranslations("waves");

  return (
    <>
      <UsageGuide titleKey="hkDetailTitle" whatKey="hkDetailWhat" howKey="hkDetailHow" />
      <Link href="/results/hongkong" className="mb-4 inline-block text-sm text-gold">{t("backHk")}</Link>
      <h1 className="mb-1 text-2xl font-bold">{draw.period}</h1>
      <p className="mb-6 text-sm text-text-muted">{draw.date}</p>
      <h2 className="mb-2 font-semibold">{t("drawNumbers")}</h2>
      <DrawBalls numbers={draw.numbers} />
      <h2 className="mb-2 mt-6 font-semibold">{t("specialNumber")}</h2>
      <DrawBalls numbers={[]} special={draw.special} />
      <p className="mt-2 text-sm text-text-muted">
        {tw(getWaveColor(draw.special))} · <AnimalLabel animal={numToAnimalStd(draw.special)} />
      </p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/analysis/idiom" className="text-gold">{t("toIdiom")}</Link>
        <Link href="/analysis/codes" className="text-gold">{t("toCodes")}</Link>
        <Link href="/trends" className="text-gold">{t("toTrends")}</Link>
      </div>
    </>
  );
}
`);

w("app/[locale]/results/international/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import UsageGuide from "@/components/shared/UsageGuide";
import IntlDrawCard from "@/components/results/IntlDrawCard";
import { getInternationalDraws } from "@/lib/draw/international";

export const dynamic = "force-dynamic";

export default function InternationalListPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("results");
  const draws = getInternationalDraws(new Date());

  return (
    <>
      <UsageGuide titleKey="intlListTitle" whatKey="intlListWhat" howKey="intlListHow" />
      <h1 className="mb-2 text-2xl font-bold text-gold">{t("intlTitle")}</h1>
      <p className="mb-2 text-sm text-text-muted">{t("intlAutoLabel")}</p>
      <p className="mb-6 text-sm text-text-muted">{t("count", { count: draws.length })}</p>
      <div className="grid gap-4 md:grid-cols-2">{draws.map((d) => <IntlDrawCard key={d.id} draw={d} />)}</div>
    </>
  );
}
`);

w("app/[locale]/results/international/[id]/page.tsx", `import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import DrawBalls from "@/components/results/DrawBalls";
import VerifyFairness from "@/components/results/VerifyFairness";
import { getInternationalDraw } from "@/lib/draw/international";
import { getWaveColor } from "@/lib/mark6/constants";
import { numToAnimalStd } from "@/lib/mark6/zodiac";
import AnimalLabel from "@/components/shared/AnimalLabel";

export const dynamic = "force-dynamic";

export default function InternationalDetailPage({ params: { locale, id } }: { params: { locale: string; id: string } }) {
  setRequestLocale(locale);
  const draw = getInternationalDraw(id, new Date());
  if (!draw) notFound();
  const t = useTranslations("results");
  const tw = useTranslations("waves");
  const pending = draw.status === "pending";

  return (
    <>
      <UsageGuide titleKey="intlDetailTitle" whatKey="intlDetailWhat" howKey="intlDetailHow" />
      <Link href="/results/international" className="mb-4 inline-block text-sm text-gold">{t("backIntl")}</Link>
      <h1 className="mb-1 text-2xl font-bold">{draw.id}</h1>
      <p className="mb-6 text-sm text-text-muted">{new Date(draw.drawAt).toLocaleString()}</p>
      {pending ? (
        <>
          <h2 className="mb-2 text-lg text-gold">{t("intlPendingTitle")}</h2>
          <p className="mb-4 text-sm text-text-muted">{t("intlPendingBody")}</p>
          <VerifyFairness seedHash={draw.seedHash} />
        </>
      ) : (
        <>
          <h2 className="mb-2 font-semibold">{t("drawNumbers")}</h2>
          <DrawBalls numbers={draw.numbers} special={draw.special} />
          <p className="mt-2 text-sm text-text-muted">
            {tw(getWaveColor(draw.special))} · <AnimalLabel animal={numToAnimalStd(draw.special)} />
          </p>
          <div className="mt-6"><VerifyFairness seedHash={draw.seedHash} seed={draw.seed} /></div>
        </>
      )}
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/analysis/idiom" className="text-gold">{t("toIdiom")}</Link>
        <Link href="/analysis/codes" className="text-gold">{t("toCodes")}</Link>
        <Link href="/trends" className="text-gold">{t("toTrends")}</Link>
      </div>
    </>
  );
}
`);

w("app/[locale]/zodiac/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import FixedZodiacGrid from "@/components/zodiac/FixedZodiacGrid";
import SuiShuFaTable from "@/components/zodiac/SuiShuFaTable";
import SanheTriangle from "@/components/zodiac/SanheTriangle";
import LiuhePairs from "@/components/zodiac/LiuhePairs";
import LiuchongPairs from "@/components/zodiac/LiuchongPairs";

export default function ZodiacPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("zodiac");

  return (
    <>
      <UsageGuide titleKey="zodiacTitle" whatKey="zodiacWhat" howKey="zodiacHow" />
      <h1 className="mb-8 text-2xl font-bold text-gold">{t("title")}</h1>
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("fixedSection")}</h2>
        <FixedZodiacGrid />
      </section>
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("sanheTitle")}</h2>
        <SanheTriangle />
      </section>
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("liuheTitle")}</h2>
        <LiuhePairs />
      </section>
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("liuchongTitle")}</h2>
        <LiuchongPairs />
      </section>
      <section className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">{t("ageSection", { year: 2026 })}</h2>
        <SuiShuFaTable year={2026} />
      </section>
      <Link href="/zodiac/lookup" className="text-gold">{t("openLookup")}</Link>
    </>
  );
}
`);

w("app/[locale]/zodiac/lookup/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import UsageGuide from "@/components/shared/UsageGuide";
import ZodiacLookup from "@/components/zodiac/ZodiacLookup";

export default function LookupPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("lookup");
  return (
    <>
      <UsageGuide titleKey="lookupTitle" whatKey="lookupWhat" howKey="lookupHow" />
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("title")}</h1>
      <ZodiacLookup />
    </>
  );
}
`);

w("app/[locale]/rules/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";

export default function RulesHubPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("rules");
  return (
    <>
      <UsageGuide titleKey="rulesTitle" whatKey="rulesWhat" howKey="rulesHow" />
      <h1 className="mb-2 text-2xl font-bold text-gold">{t("hubTitle")}</h1>
      <p className="mb-8 text-text-muted">{t("hubIntro")}</p>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/rules/hongkong" className="rounded-xl border border-surface-border bg-surface-card p-6 hover:border-gold">
          <h2 className="font-semibold text-gold">{t("hkCard")}</h2>
          <p className="mt-2 text-sm text-text-muted">{t("hkCardDesc")}</p>
        </Link>
        <Link href="/rules/international" className="rounded-xl border border-surface-border bg-surface-card p-6 hover:border-gold">
          <h2 className="font-semibold text-gold">{t("intlCard")}</h2>
          <p className="mt-2 text-sm text-text-muted">{t("intlCardDesc")}</p>
        </Link>
      </div>
    </>
  );
}
`);

w("app/[locale]/rules/hongkong/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import { BasicRules, BetTable, ZodiacWaveReference } from "@/components/rules/RulesSection";

const HK_BETS: [string, string][] = [
  ["tema", "temaDesc"], ["temaZodiac", "temaZodiacDesc"], ["main", "mainDesc"],
  ["twoAll", "twoAllDesc"], ["threeAll", "threeAllDesc"], ["twoSp", "twoSpDesc"],
  ["combo", "comboDesc"], ["wave", "waveDesc"], ["oddEven", "oddEvenDesc"], ["bigSmall", "bigSmallDesc"],
];

export default function RulesHkPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("rules");
  return (
    <>
      <UsageGuide titleKey="rulesHkTitle" whatKey="rulesHkWhat" howKey="rulesHkHow" />
      <Link href="/rules" className="mb-4 inline-block text-sm text-gold">← {t("hubTitle")}</Link>
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("hkCard")}</h1>
      <BasicRules track="hk" />
      <h2 className="mb-4 text-xl font-semibold">{t("betsTitle")}</h2>
      <BetTable rows={HK_BETS} />
      <ZodiacWaveReference />
      <p className="text-sm text-text-muted">{t("disclaimer")}</p>
    </>
  );
}
`);

w("app/[locale]/rules/international/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import LegalNotice from "@/components/legal/LegalNotice";
import { BasicRules, BetTable, ZodiacWaveReference } from "@/components/rules/RulesSection";

const STD_BETS: [string, string][] = [
  ["tema", "temaDesc"], ["temaZodiac", "temaZodiacDesc"], ["main", "mainDesc"],
  ["twoAll", "twoAllDesc"], ["threeAll", "threeAllDesc"], ["wave", "waveDesc"],
];
const FOLK_BETS: [string, string][] = [
  ["sumOddEven", "sumOddEvenDesc"], ["head", "headDesc"], ["tail", "tailDesc"],
  ["threeWave", "threeWaveDesc"], ["fiveElements", "fiveElementsDesc"], ["oddEven", "oddEvenDesc"], ["bigSmall", "bigSmallDesc"],
];

export default function RulesIntlPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("rules");
  return (
    <>
      <UsageGuide titleKey="rulesIntlTitle" whatKey="rulesIntlWhat" howKey="rulesIntlHow" />
      <Link href="/rules" className="mb-4 inline-block text-sm text-gold">← {t("hubTitle")}</Link>
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("intlCard")}</h1>
      <BasicRules track="intl" />
      <h2 className="mb-4 text-xl font-semibold">{t("betsTitle")}</h2>
      <BetTable rows={STD_BETS} />
      <h2 className="mb-4 text-xl font-semibold">{t("folkTitle")}</h2>
      <BetTable rows={FOLK_BETS} />
      <ZodiacWaveReference />
      <h2 className="mb-4 mt-8 text-xl font-semibold text-gold">{t("legalBlockTitle")}</h2>
      <LegalNotice />
      <p className="mt-4 text-sm text-text-muted">{t("disclaimer")}</p>
    </>
  );
}
`);

w("app/[locale]/trends/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import UsageGuide from "@/components/shared/UsageGuide";
import TrendsPanel from "@/components/trends/TrendsPanel";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";

export default function TrendsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("trends");
  return (
    <>
      <UsageGuide titleKey="trendsTitle" whatKey="trendsWhat" howKey="trendsHow" />
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("title")}</h1>
      <TrendsPanel hkDraws={getHongKongDraws()} intlDraws={getInternationalDraws(new Date())} />
    </>
  );
}
`);

w("app/[locale]/knowledge/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import { getArticles } from "@/lib/data/knowledge";

export default function KnowledgePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("knowledge");
  const en = locale === "en";
  const articles = getArticles();
  return (
    <>
      <UsageGuide titleKey="knowledgeTitle" whatKey="knowledgeWhat" howKey="knowledgeHow" />
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("title")}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((a) => (
          <Link key={a.slug} href={\`/knowledge/\${a.slug}\`} className="rounded-xl border border-surface-border bg-surface-card p-5 hover:border-gold">
            <h2 className="font-semibold">{en ? a.titleEn : a.title}</h2>
            <p className="mt-2 text-sm text-text-muted">{en ? a.excerptEn : a.excerpt}</p>
            <span className="mt-3 inline-block text-sm text-gold">{t("read")}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
`);

w("app/[locale]/knowledge/[slug]/page.tsx", `import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import { getArticle, getArticles } from "@/lib/data/knowledge";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export default function KnowledgeArticlePage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  setRequestLocale(locale);
  const article = getArticle(slug);
  if (!article) notFound();
  const en = locale === "en";
  return (
    <>
      <UsageGuide titleKey="knowledgeTitle" whatKey="knowledgeWhat" howKey="knowledgeHow" />
      <Link href="/knowledge" className="mb-4 inline-block text-sm text-gold">←</Link>
      <h1 className="mb-4 text-2xl font-bold text-gold">{en ? article.titleEn : article.title}</h1>
      <article className="prose prose-invert max-w-none whitespace-pre-wrap text-sm text-text-muted">
        {article.content}
      </article>
    </>
  );
}
`);

w("app/[locale]/analysis/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/shared/UsageGuide";
import samples from "@/data/analysis-samples.json";

export default function AnalysisHubPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("analysis");
  return (
    <>
      <UsageGuide titleKey="analysisHubTitle" whatKey="analysisHubWhat" howKey="analysisHubHow" />
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("hubTitle")}</h1>
      <div className="mb-10 grid gap-4 md:grid-cols-2">
        <Link href="/analysis/idiom" className="rounded-xl border border-surface-border bg-surface-card p-6 hover:border-gold">
          <h2 className="font-semibold">{t("idiomCard")}</h2>
          <p className="text-sm text-text-muted">{t("idiomCardDesc")}</p>
        </Link>
        <Link href="/analysis/codes" className="rounded-xl border border-surface-border bg-surface-card p-6 hover:border-gold">
          <h2 className="font-semibold">{t("codesCard")}</h2>
          <p className="text-sm text-text-muted">{t("codesCardDesc")}</p>
        </Link>
      </div>
      <h2 className="mb-4 font-semibold">{t("samples")}</h2>
      <ul className="space-y-2 text-sm text-text-muted">
        {samples.samples.map((s) => (
          <li key={s.issue}>{s.issue}: {s.idiom} / {s.codes}</li>
        ))}
      </ul>
    </>
  );
}
`);

w("app/[locale]/analysis/idiom/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import UsageGuide from "@/components/shared/UsageGuide";
import IdiomWorkbench from "@/components/analysis/IdiomWorkbench";

export default function IdiomPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("idiom");
  return (
    <>
      <UsageGuide titleKey="idiomTitle" whatKey="idiomWhat" howKey="idiomHow" />
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("pageTitle")}</h1>
      <IdiomWorkbench />
    </>
  );
}
`);

w("app/[locale]/analysis/codes/page.tsx", `import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import UsageGuide from "@/components/shared/UsageGuide";
import CodesWorkbench from "@/components/analysis/CodesWorkbench";

export default function CodesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("codes");
  return (
    <>
      <UsageGuide titleKey="codesTitle" whatKey="codesWhat" howKey="codesHow" />
      <h1 className="mb-6 text-2xl font-bold text-gold">{t("pageTitle")}</h1>
      <CodesWorkbench />
    </>
  );
}
`);

w("app/api/cron/international-draw/route.ts", `import { NextResponse } from "next/server";
import { getTodaySchedule, listAutoDraws } from "@/lib/draw/international-auto";

export async function GET() {
  const now = new Date();
  const schedule = getTodaySchedule(now);
  const recent = listAutoDraws(now).slice(0, 5);
  return NextResponse.json({
    ok: true,
    at: now.toISOString(),
    schedule,
    recent,
  });
}
`);

console.log("Total:", files.length, "files");
fs.writeFileSync("C:/Users/Win-Hermes/mark6-site/_rebuild-v5-files.json", JSON.stringify(files, null, 2));
