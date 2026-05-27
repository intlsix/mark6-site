import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { readJson, writeJson, useBlobStorage } from "@/lib/storage/json-store";

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  uploadedAt: string;
}

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const META_KEY = "admin/media.json";

export async function getMediaItems(): Promise<MediaItem[]> {
  const items = await readJson<MediaItem[]>(META_KEY, []);
  return items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

async function writeMeta(items: MediaItem[]): Promise<boolean> {
  return writeJson(META_KEY, items);
}

/** Binary files still use public/uploads locally; on Netlify only metadata is persisted. */
export async function saveUpload(file: Buffer, originalName: string): Promise<MediaItem | null> {
  if (useBlobStorage()) {
    console.warn("saveUpload: binary upload not supported on Netlify read-only FS");
    return null;
  }
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const safe = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  const full = path.join(UPLOAD_DIR, safe);
  fs.writeFileSync(full, file);
  const item: MediaItem = {
    id: randomUUID(),
    filename: safe,
    url: `/uploads/${safe}`,
    sizeBytes: file.length,
    uploadedAt: new Date().toISOString(),
  };
  const all = await getMediaItems();
  all.unshift(item);
  await writeMeta(all);
  return item;
}

export async function deleteMedia(id: string): Promise<boolean> {
  const all = await getMediaItems();
  const item = all.find((m) => m.id === id);
  if (!item) return false;
  if (!useBlobStorage()) {
    const full = path.join(UPLOAD_DIR, item.filename);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  }
  return writeMeta(all.filter((m) => m.id !== id));
}
