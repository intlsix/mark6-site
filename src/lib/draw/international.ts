import type { DrawRecord } from "@/lib/mark6/types";
import { readJson, writeJson } from "@/lib/storage/json-store";
import {
  shouldAutoDrawNow,
  nextIntlDrawId,
  generateAutoDraw,
} from "./international-auto";
import { generateSeed, drawNumbersFromSeed, sha256 } from "@/lib/mark6/fairness";

const KEY = "international/draws.json";

async function readManual(): Promise<DrawRecord[]> {
  return readJson<DrawRecord[]>(KEY, []);
}

async function writeManual(draws: DrawRecord[]): Promise<boolean> {
  return writeJson(KEY, draws);
}

function sortDraws(draws: DrawRecord[]): DrawRecord[] {
  return [...draws].sort((a, b) => b.drawAt.localeCompare(a.drawAt));
}

export async function getInternationalDraws(): Promise<DrawRecord[]> {
  return sortDraws(await readManual());
}

export async function getInternationalDraw(id: string): Promise<DrawRecord | undefined> {
  const draws = await getInternationalDraws();
  return draws.find((d) => d.id === id);
}

export async function getManualInternationalDraws(): Promise<DrawRecord[]> {
  return sortDraws(await readManual());
}

export async function addManualInternationalDraw(
  draw: Omit<DrawRecord, "id"> & { id?: string },
): Promise<DrawRecord> {
  const manual = await readManual();
  const all = await getInternationalDraws();
  const record: DrawRecord = {
    ...draw,
    id: draw.id ?? (await nextIntlDrawId([...manual, ...all], new Date())),
    source: "manual",
  };
  manual.push(record);
  await writeManual(manual);
  return record;
}

export async function updateManualInternationalDraw(
  id: string,
  patch: Partial<DrawRecord>,
): Promise<DrawRecord | null> {
  const manual = await readManual();
  const idx = manual.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  manual[idx] = { ...manual[idx], ...patch, id };
  await writeManual(manual);
  return manual[idx];
}

export async function deleteManualInternationalDraw(id: string): Promise<boolean> {
  const manual = await readManual();
  const next = manual.filter((d) => d.id !== id);
  if (next.length === manual.length) return false;
  await writeManual(next);
  return true;
}

export async function triggerManualDraw(): Promise<DrawRecord> {
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

export async function runCronInternationalDraw(): Promise<DrawRecord | null> {
  const now = new Date();
  if (!shouldAutoDrawNow(now)) return null;
  const manual = await readManual();
  const day = now.toISOString().slice(0, 10);
  if (manual.some((d) => d.drawAt.startsWith(day))) return null;
  const draw = await generateAutoDraw(manual, now);
  manual.push(draw);
  await writeManual(manual);
  return draw;
}

export async function clearInternationalDraws(): Promise<boolean> {
  return writeManual([]);
}
