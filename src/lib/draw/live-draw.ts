import { readJson, writeJson } from "@/lib/storage/json-store";

export interface LiveDrawState {
  numbers: (number | null)[];
  special: number | null;
  updatedAt: string;
  broadcasting: boolean;
}

const KEY = "international/live-draw.json";

const EMPTY: LiveDrawState = {
  numbers: [null, null, null, null, null, null],
  special: null,
  updatedAt: "",
  broadcasting: false,
};

export async function readLiveDraw(): Promise<LiveDrawState> {
  return readJson<LiveDrawState>(KEY, { ...EMPTY });
}

export async function writeLiveDraw(state: LiveDrawState): Promise<boolean> {
  state.updatedAt = new Date().toISOString();
  return writeJson(KEY, state);
}

export async function resetLiveDraw(): Promise<boolean> {
  return writeLiveDraw({ ...EMPTY });
}
