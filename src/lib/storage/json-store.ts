import fs from "fs";
import path from "path";

const BLOB_STORE = "mark6-data";

/** Netlify production / dev with blobs */
export function useBlobStorage(): boolean {
  return process.env.NETLIFY === "true" || process.env.NETLIFY_DEV === "true";
}

function filePath(key: string): string {
  return path.join(process.cwd(), "src/data", key);
}

/** Build-time & local dev: read committed JSON from disk only */
export function readJsonSync<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath(key), "utf8")) as T;
  } catch {
    return fallback;
  }
}

/** Runtime: blob first (admin writes), then disk fallback */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (useBlobStorage()) {
    try {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore({ name: BLOB_STORE, consistency: "strong" });
      const text = await store.get(key, { type: "text" });
      if (text) return JSON.parse(text) as T;
    } catch (e) {
      console.error("[readJson blob]", key, e);
    }
  }
  return readJsonSync(key, fallback);
}

export async function writeJson<T>(key: string, data: T): Promise<boolean> {
  const text = JSON.stringify(data, null, 2) + "\n";
  if (useBlobStorage()) {
    try {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore({ name: BLOB_STORE, consistency: "strong" });
      await store.set(key, text);
      return true;
    } catch (e) {
      console.error("[writeJson blob]", key, e);
      return false;
    }
  }
  try {
    const p = filePath(key);
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, text, "utf8");
    return true;
  } catch (e) {
    console.error("[writeJson fs]", key, e);
    return false;
  }
}
