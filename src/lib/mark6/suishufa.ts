import { ALL_ANIMALS, type Animal } from "./types";
import { TAI_SUI } from "./constants";

/** BACKWARD: (tsIndex - i + 12) % 12 */
export function buildYearMap(year: number): Record<number, Animal> {
  const taiSui = TAI_SUI[year] ?? "马";
  const tsIndex = ALL_ANIMALS.indexOf(taiSui);
  const remainderMap: Record<number, Animal> = {};
  for (let i = 0; i < 12; i++) {
    const rem = i + 1;
    const animalIndex = (tsIndex - i + 12) % 12;
    remainderMap[rem] = ALL_ANIMALS[animalIndex];
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
