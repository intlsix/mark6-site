import { createHash } from "crypto";

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
