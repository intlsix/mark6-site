import type { Animal } from "./types";

export function animalImagePath(animal: Animal): string {
  return `/animals/${animal}.jpg`;
}
