import fs from "fs";
import path from "path";

export interface LiveDrawState {
  numbers: (number | null)[];
  special: number | null;
  updatedAt: string;
  broadcasting: boolean;
}

const LIVE_PATH = path.join(process.cwd(), "src/data/international/live-draw.json");

const EMPTY: LiveDrawState = {
  numbers: [null, null, null, null, null, null],
  special: null,
  updatedAt: "",
  broadcasting: false,
};

export function readLiveDraw(): LiveDrawState {
  try {
    return JSON.parse(fs.readFileSync(LIVE_PATH, "utf8"));
  } catch {
    return { ...EMPTY };
  }
}

export function writeLiveDraw(state: LiveDrawState): void {
  const dir = path.dirname(LIVE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(LIVE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
}

export function resetLiveDraw(): void {
  writeLiveDraw({ ...EMPTY });
}
