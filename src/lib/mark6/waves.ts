import { WAVE_MAP } from "./constants";
import type { Wave } from "./types";

export function numToWave(n: number): Wave {
  return WAVE_MAP[n] ?? "红波";
}

export function waveColorClass(wave: Wave): string {
  if (wave === "红波") return "bg-ball-red";
  if (wave === "蓝波") return "bg-ball-blue";
  return "bg-ball-green";
}
