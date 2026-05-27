import fs from "fs";
import path from "path";

const root = "C:/Users/Win-Hermes/mark6-site/src";

function write(rel, content) {
  const fp = path.join(root, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, "utf8");
}

// lib files written in part 1 - will add all in this script
write("lib/mark6/zodiac.ts", `import type { Animal } from "./types";
import { ANIMAL_TO_NUMS, LIUCHONG_MAP, LIUHE_MAP, SANHE_GROUPS, STD_ZODIAC } from "./constants";

export function numToAnimalStd(n: number): Animal {
  return STD_ZODIAC[n] ?? "鼠";
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

console.log("part1 ok");
