import fs from "fs";
import path from "path";

const ROOT = path.join("C:\\Users\\Win-Hermes\\mark6-site\\src");

function w(rel, content) {
  const fp = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content.replace(/\r?\n/g, "\n"), "utf8");
}

const files = {};

// ========== DATA ==========
files["data/hongkong/draws.json"] = "[]\n";
files["data/international/draws.json"] = "[]\n";
files["data/admin/logs.json"] = "[]\n";
files["data/knowledge-base.json"] = JSON.stringify([
  {
    id: "welcome",
    category: "guide",
    titleZh: "欢迎使用知识库",
    titleEn: "Welcome to the knowledge base",
    excerptZh: "规则与文化文章将在此发布。",
    excerptEn: "Articles on rules and culture will appear here.",
    contentZh: "## 知识库\n\n本站提供六合彩规则与文化说明，仅供资讯参考。",
    contentEn: "## Knowledge base\n\nRule and culture articles for reference only.",
    published: true,
    updatedAt: "2026-05-26T00:00:00.000Z",
  },
], null, 2) + "\n";

// ========== LIB MARK6 ==========
files["lib/mark6/types.ts"] = `export type Animal =
  | "鼠" | "牛" | "虎" | "兔" | "龙" | "蛇"
  | "马" | "羊" | "猴" | "鸡" | "狗" | "猪";

export type Wave = "红波" | "蓝波" | "绿波";

export const ALL_ANIMALS: Animal[] = [
  "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪",
];

export interface DrawRecord {
  id: string;
  drawAt: string;
  numbers: number[];
  special: number;
  seedHash?: string;
  seed?: string;
  source?: "auto" | "manual";
}

export interface KnowledgeArticle {
  id: string;
  category: string;
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  published: boolean;
  updatedAt: string;
}

export interface AdminLogEntry {
  id: string;
  at: string;
  action: string;
  detail: string;
  ip?: string;
}
`;

files["lib/mark6/constants.ts"] = `import type { Animal, Wave } from "./types";

export const FIXED_ZODIAC: Record<number, Animal> = {
  1: "鼠", 13: "鼠", 25: "鼠", 37: "鼠", 49: "鼠",
  2: "牛", 14: "牛", 26: "牛", 38: "牛",
  3: "虎", 15: "虎", 27: "虎", 39: "虎",
  4: "兔", 16: "兔", 28: "兔", 40: "兔",
  5: "龙", 17: "龙", 29: "龙", 41: "龙",
  6: "蛇", 18: "蛇", 30: "蛇", 42: "蛇",
  7: "马", 19: "马", 31: "马", 43: "马",
  8: "羊", 20: "羊", 32: "羊", 44: "羊",
  9: "猴", 21: "猴", 33: "猴", 45: "猴",
  10: "鸡", 22: "鸡", 34: "鸡", 46: "鸡",
  11: "狗", 23: "狗", 35: "狗", 47: "狗",
  12: "猪", 24: "猪", 36: "猪", 48: "猪",
};

export const ANIMAL_TO_NUMS: Record<Animal, number[]> = {
  鼠: [1, 13, 25, 37, 49],
  牛: [2, 14, 26, 38],
  虎: [3, 15, 27, 39],
  兔: [4, 16, 28, 40],
  龙: [5, 17, 29, 41],
  蛇: [6, 18, 30, 42],
  马: [7, 19, 31, 43],
  羊: [8, 20, 32, 44],
  猴: [9, 21, 33, 45],
  鸡: [10, 22, 34, 46],
  狗: [11, 23, 35, 47],
  猪: [12, 24, 36, 48],
};

const RED = new Set([1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]);
const BLUE = new Set([3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]);
const GREEN = new Set([5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]);

export const WAVE_MAP: Record<number, Wave> = {};
for (let n = 1; n <= 49; n++) {
  if (RED.has(n)) WAVE_MAP[n] = "红波";
  else if (BLUE.has(n)) WAVE_MAP[n] = "蓝波";
  else WAVE_MAP[n] = "绿波";
}

export const TAI_SUI: Record<number, Animal> = {
  2020: "鼠", 2021: "牛", 2022: "虎", 2023: "兔", 2024: "龙", 2025: "蛇",
  2026: "马", 2027: "羊", 2028: "猴", 2029: "鸡", 2030: "狗", 2031: "猪",
};

export const SANHE_GROUPS: { label: string; animals: [Animal, Animal, Animal] }[] = [
  { label: "water", animals: ["猴", "鼠", "龙"] },
  { label: "wood", animals: ["猪", "兔", "羊"] },
  { label: "fire", animals: ["虎", "马", "狗"] },
  { label: "metal", animals: ["蛇", "鸡", "牛"] },
];

export const LIUHE_PAIRS: [Animal, Animal][] = [
  ["鼠", "牛"], ["虎", "猪"], ["兔", "狗"], ["龙", "鸡"], ["蛇", "猴"], ["马", "羊"],
];

export const LIUCHONG_PAIRS: [Animal, Animal][] = [
  ["鼠", "马"], ["牛", "羊"], ["虎", "猴"], ["兔", "鸡"], ["龙", "狗"], ["蛇", "猪"],
];
`;

files["lib/mark6/zodiac.ts"] = `import { FIXED_ZODIAC, ANIMAL_TO_NUMS, LIUHE_PAIRS, LIUCHONG_PAIRS, SANHE_GROUPS } from "./constants";
import type { Animal } from "./types";

export function numToAnimalStd(n: number): Animal {
  return FIXED_ZODIAC[n] ?? "鼠";
}

export function animalToNumbers(animal: Animal): number[] {
  return ANIMAL_TO_NUMS[animal] ?? [];
}

export function getChongPartner(animal: Animal): Animal {
  const pair = LIUCHONG_PAIRS.find(([a, b]) => a === animal || b === animal);
  if (!pair) return animal;
  return pair[0] === animal ? pair[1] : pair[0];
}

export function getLiuhePartner(animal: Animal): Animal {
  const pair = LIUHE_PAIRS.find(([a, b]) => a === animal || b === animal);
  if (!pair) return animal;
  return pair[0] === animal ? pair[1] : pair[0];
}

export function getSanhePartners(animal: Animal): Animal[] {
  const group = SANHE_GROUPS.find((g) => g.animals.includes(animal));
  if (!group) return [];
  return group.animals.filter((a) => a !== animal);
}
`;

files["lib/mark6/suishufa.ts"] = `import { ALL_ANIMALS, type Animal } from "./types";
import { TAI_SUI } from "./constants";

/** BACKWARD: (tsIndex - i + 12) % 12 */
export function buildYearMap(year: number): Record<number, Animal> {
  const taiSui = TAI_SUI[year] ?? "马";
  const tsIndex = ALL_ANIMALS.indexOf(taiSui);
  const remainderMap: Record<number, Animal> = {};
  for (let i = 1; i <= 12; i++) {
    const animalIndex = (tsIndex - i + 12) % 12;
    remainderMap[i] = ALL_ANIMALS[animalIndex];
  }
  return remainderMap;
}

export function decodeBySuiShuFa(n: number, year: number): Animal {
  const rem = ((n - 1) % 12) + 1;
  const map = buildYearMap(year);
  return map[rem] ?? "鼠";
}

export function getSuiShuFaNumbers(animal: Animal, year: number): number[] {
  const map = buildYearMap(year);
  const nums: number[] = [];
  for (let n = 1; n <= 49; n++) {
    if (map[((n - 1) % 12) + 1] === animal) nums.push(n);
  }
  return nums;
}
`;

files["lib/mark6/waves.ts"] = `import { WAVE_MAP } from "./constants";
import type { Wave } from "./types";

export function numToWave(n: number): Wave {
  return WAVE_MAP[n] ?? "红波";
}

export function waveColorClass(wave: Wave): string {
  if (wave === "红波") return "bg-ball-red";
  if (wave === "蓝波") return "bg-ball-blue";
  return "bg-ball-green";
}
`;

files["lib/mark6/animal-assets.ts"] = `import type { Animal } from "./types";

export function animalImagePath(animal: Animal): string {
  return \`/animals/\${animal}.jpg\`;
}
`;

files["lib/mark6/trends.ts"] = `import type { DrawRecord } from "./types";
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
`;

files["lib/mark6/idiom.ts"] = `import type { Animal } from "./types";

const IDIOM_MAP: Record<string, { path: string; animals: Animal[] }> = {
  龙马精神: { path: "direct", animals: ["龙", "马"] },
  虎虎生威: { path: "imagery", animals: ["虎"] },
  守株待兔: { path: "story", animals: ["兔"] },
  亡羊补牢: { path: "story", animals: ["羊"] },
  画蛇添足: { path: "story", animals: ["蛇"] },
  鸡犬不宁: { path: "keyword", animals: ["鸡", "狗"] },
};

export function decodeIdiom(input: string) {
  const trimmed = input.trim();
  const hit = IDIOM_MAP[trimmed];
  if (!hit) return null;
  return hit;
}
`;

files["lib/mark6/codes.ts"] = `import type { Animal } from "./types";
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
`;

files["lib/mark6/fairness.ts"] = `import { createHash } from "crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function verifySeed(seed: string, hash: string): boolean {
  return sha256(seed) === hash;
}

export function generateSeed(): string {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function drawNumbersFromSeed(seed: string): { numbers: number[]; special: number } {
  const hash = sha256(seed);
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const picked: number[] = [];
  let offset = 0;
  while (picked.length < 7 && offset < hash.length) {
    const slice = hash.slice(offset, offset + 4);
    offset += 4;
    const val = parseInt(slice, 16);
    if (Number.isNaN(val)) continue;
    const idx = val % pool.length;
    picked.push(pool.splice(idx, 1)[0]);
  }
  while (picked.length < 7) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return { numbers: picked.slice(0, 6).sort((a, b) => a - b), special: picked[6] };
}
`;

// ========== DRAW LIB ==========
files["lib/draw/hongkong.ts"] = `import fs from "fs";
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
  fs.writeFileSync(DATA_PATH, JSON.stringify(draws, null, 2) + "\\n", "utf8");
}
`;

files["lib/draw/international-auto.ts"] = `import { sha256, generateSeed, drawNumbersFromSeed } from "@/lib/mark6/fairness";
import type { DrawRecord } from "@/lib/mark6/types";

export const INTL_DRAW_HOUR_UTC = 12;

export function nextIntlDrawId(existing: DrawRecord[]): string {
  const nums = existing
    .map((d) => parseInt(d.id.replace(/^INT-/, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return \`INT-\${String(next).padStart(3, "0")}\`;
}

export function utcDrawTimeForDate(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), INTL_DRAW_HOUR_UTC, 0, 0));
  return d;
}

export function shouldAutoDrawNow(now = new Date()): boolean {
  const drawTime = utcDrawTimeForDate(now);
  return now >= drawTime;
}

export function generateAutoDraw(existing: DrawRecord[], forDate = new Date()): DrawRecord {
  const seed = generateSeed();
  const { numbers, special } = drawNumbersFromSeed(seed);
  const drawAt = utcDrawTimeForDate(forDate).toISOString();
  return {
    id: nextIntlDrawId(existing),
    drawAt,
    numbers,
    special,
    seed,
    seedHash: sha256(seed),
    source: "auto",
  };
}

export function getPendingDraw(forDate = new Date()): Partial<DrawRecord> {
  const seed = generateSeed();
  const drawAt = utcDrawTimeForDate(forDate).toISOString();
  return {
    drawAt,
    seedHash: sha256(seed),
    seed: undefined,
  };
}

/** Generate auto draws for each UTC day from start to end if missing */
export function generateAutoDrawsInRange(
  existing: DrawRecord[],
  start: Date,
  end: Date,
): DrawRecord[] {
  const byDay = new Map<string, DrawRecord>();
  for (const d of existing) {
    if (d.source === "auto") {
      const day = d.drawAt.slice(0, 10);
      byDay.set(day, d);
    }
  }

  const result = [...existing];
  const cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const endDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

  while (cur <= endDay) {
    const day = cur.toISOString().slice(0, 10);
    const drawTime = utcDrawTimeForDate(cur);
    if (drawTime <= end && !byDay.has(day)) {
      const draw = generateAutoDraw(result, cur);
      result.push(draw);
      byDay.set(day, draw);
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return result.sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}
`;

files["lib/draw/international.ts"] = `import fs from "fs";
import path from "path";
import type { DrawRecord } from "@/lib/mark6/types";
import {
  generateAutoDrawsInRange,
  shouldAutoDrawNow,
  utcDrawTimeForDate,
  nextIntlDrawId,
} from "./international-auto";
import { generateSeed, drawNumbersFromSeed, sha256 } from "@/lib/mark6/fairness";

const DATA_PATH = path.join(process.cwd(), "src/data/international/draws.json");

function readManual(): DrawRecord[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw) as DrawRecord[];
  } catch {
    return [];
  }
}

function writeManual(draws: DrawRecord[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(draws, null, 2) + "\\n", "utf8");
}

function mergeDraws(manual: DrawRecord[]): DrawRecord[] {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 90);
  const autoEnd = shouldAutoDrawNow(now) ? now : new Date(utcDrawTimeForDate(now).getTime() - 86400000);
  const merged = generateAutoDrawsInRange(manual, start, autoEnd);
  const manualOnly = manual.filter((m) => !merged.some((a) => a.id === m.id));
  return [...merged, ...manualOnly].sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}

export function getInternationalDraws(): DrawRecord[] {
  return mergeDraws(readManual());
}

export function getInternationalDraw(id: string): DrawRecord | undefined {
  return getInternationalDraws().find((d) => d.id === id);
}

export function getManualInternationalDraws(): DrawRecord[] {
  return readManual().sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}

export function addManualInternationalDraw(draw: Omit<DrawRecord, "id"> & { id?: string }): DrawRecord {
  const manual = readManual();
  const record: DrawRecord = {
    ...draw,
    id: draw.id ?? nextIntlDrawId([...manual, ...getInternationalDraws()]),
    source: "manual",
  };
  manual.push(record);
  writeManual(manual);
  return record;
}

export function updateManualInternationalDraw(id: string, patch: Partial<DrawRecord>): DrawRecord | null {
  const manual = readManual();
  const idx = manual.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  manual[idx] = { ...manual[idx], ...patch, id };
  writeManual(manual);
  return manual[idx];
}

export function deleteManualInternationalDraw(id: string): boolean {
  const manual = readManual();
  const next = manual.filter((d) => d.id !== id);
  if (next.length === manual.length) return false;
  writeManual(next);
  return true;
}

export function triggerManualDraw(): DrawRecord {
  const seed = generateSeed();
  const { numbers, special } = drawNumbersFromSeed(seed);
  return addManualInternationalDraw({
    drawAt: new Date().toISOString(),
    numbers,
    special,
    seed,
    seedHash: sha256(seed),
    source: "manual",
  });
}

export function runCronInternationalDraw(): DrawRecord | null {
  const now = new Date();
  if (!shouldAutoDrawNow(now)) return null;
  const all = getInternationalDraws();
  const day = now.toISOString().slice(0, 10);
  if (all.some((d) => d.drawAt.startsWith(day) && d.source === "auto")) return null;
  const manual = readManual();
  const { generateAutoDraw } = require("./international-auto") as typeof import("./international-auto");
  const draw = generateAutoDraw([...all, ...manual], now);
  manual.push(draw);
  writeManual(draw);
  return draw;
}
`;

// Fix runCron - use import instead of require
files["lib/draw/international.ts"] = files["lib/draw/international.ts"].replace(
  `  const { generateAutoDraw } = require("./international-auto") as typeof import("./international-auto");
  const draw = generateAutoDraw([...all, ...manual], now);
  manual.push(draw);
  writeManual(draw);
  return draw;`,
  `  const { generateAutoDraw } = await import("./international-auto");
  const draw = generateAutoDraw([...all, ...manual], now);
  manual.push(draw);
  writeManual(draw);
  return draw;`,
);

files["lib/draw/international.ts"] = files["lib/draw/international.ts"].replace(
  "export function runCronInternationalDraw(): DrawRecord | null {",
  "export async function runCronInternationalDraw(): Promise<DrawRecord | null> {",
);

// ========== ADMIN LIB ==========
files["lib/admin/auth.ts"] = `import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

export const SESSION_COOKIE = "mark6_admin_session";
const SESSIONS = new Map<string, number>();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "changeme";
}

export function verifyPassword(password: string): boolean {
  return password === getPassword();
}

export function createSession(): string {
  const token = randomBytes(32).toString("hex");
  SESSIONS.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

export function destroySession(token: string): void {
  SESSIONS.delete(token);
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const exp = SESSIONS.get(token);
  if (!exp) return false;
  if Date.now() > exp) {
    SESSIONS.delete(token);
    return false;
  }
  return true;
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  return isValidSession(token);
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}
`;

// Fix typo in auth.ts
files["lib/admin/auth.ts"] = files["lib/admin/auth.ts"].replace(
  "  if Date.now() > exp) {",
  "  if (Date.now() > exp) {",
);

files["lib/admin/logs.ts"] = `import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { AdminLogEntry } from "@/lib/mark6/types";

const LOG_PATH = path.join(process.cwd(), "src/data/admin/logs.json");

function readLogs(): AdminLogEntry[] {
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, "utf8")) as AdminLogEntry[];
  } catch {
    return [];
  }
}

export function appendLog(action: string, detail: string, ip?: string): AdminLogEntry {
  const entry: AdminLogEntry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    action,
    detail,
    ip,
  };
  const logs = readLogs();
  logs.unshift(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs.slice(0, 500), null, 2) + "\\n", "utf8");
  return entry;
}

export function getLogs(): AdminLogEntry[] {
  return readLogs();
}
`;

files["lib/admin/articles.ts"] = `import fs from "fs";
import path from "path";
import type { KnowledgeArticle } from "@/lib/mark6/types";

const DATA_PATH = path.join(process.cwd(), "src/data/knowledge-base.json");

export function getArticles(): KnowledgeArticle[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as KnowledgeArticle[];
  } catch {
    return [];
  }
}

export function getPublishedArticles(): KnowledgeArticle[] {
  return getArticles().filter((a) => a.published);
}

export function saveArticles(articles: KnowledgeArticle[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2) + "\\n", "utf8");
}

export function upsertArticle(article: KnowledgeArticle): void {
  const all = getArticles();
  const idx = all.findIndex((a) => a.id === article.id);
  if (idx >= 0) all[idx] = article;
  else all.push(article);
  saveArticles(all);
}

export function deleteArticle(id: string): boolean {
  const all = getArticles();
  const next = all.filter((a) => a.id !== id);
  if (next.length === all.length) return false;
  saveArticles(next);
  return true;
}
`;

files["lib/admin/draws.ts"] = `export {
  getHongKongDraws,
  getHongKongDraw,
  saveHongKongDraws,
} from "@/lib/draw/hongkong";

export {
  getInternationalDraws,
  getInternationalDraw,
  getManualInternationalDraws,
  addManualInternationalDraw,
  updateManualInternationalDraw,
  deleteManualInternationalDraw,
  triggerManualDraw,
  runCronInternationalDraw,
} from "@/lib/draw/international";
`;

files["lib/settings.ts"] = `export interface SiteSettings {
  companyName: string;
  jurisdiction: string;
  regNumber: string;
  intlAutoEnabled: boolean;
}

export const defaultSettings: SiteSettings = {
  companyName: "HK Intl Mark Six Ltd",
  jurisdiction: "Isle of Man",
  regNumber: "IMO-128456",
  intlAutoEnabled: true,
};
`;

// ========== I18N ==========
files["i18n/routing.ts"] = `import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "zh",
});
`;

files["i18n/request.ts"] = `import { getRequestConfig } from "next-intl/server";
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
`;

files["i18n/navigation.ts"] = `import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
`;

// Write all files so far
for (const [rel, content] of Object.entries(files)) {
  w(rel, content);
}

console.log(`Wrote ${Object.keys(files).length} core files`);
