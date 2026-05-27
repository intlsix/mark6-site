import type { Animal } from "./types";

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
