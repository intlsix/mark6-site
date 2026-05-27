import { FIXED_ZODIAC, ANIMAL_TO_NUMS, LIUHE_PAIRS, LIUCHONG_PAIRS, SANHE_GROUPS } from "./constants";
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
