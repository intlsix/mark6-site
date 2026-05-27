import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  uploadedAt: string;
}

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const META_PATH = path.join(process.cwd(), "src/data/admin/media.json");

function readMeta(): MediaItem[] {
  try {
    return JSON.parse(fs.readFileSync(META_PATH, "utf8")) as MediaItem[];
  } catch {
    return [];
  }
}

function writeMeta(items: MediaItem[]): void {
  const dir = path.dirname(META_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(META_PATH, JSON.stringify(items, null, 2) + "\n", "utf8");
}

export function getMediaItems(): MediaItem[] {
  return readMeta().sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export function saveUpload(file: Buffer, originalName: string): MediaItem {
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
  const all = readMeta();
  all.unshift(item);
  writeMeta(all);
  return item;
}

export function deleteMedia(id: string): boolean {
  const all = readMeta();
  const item = all.find((m) => m.id === id);
  if (!item) return false;
  const full = path.join(UPLOAD_DIR, item.filename);
  if (fs.existsSync(full)) fs.unlinkSync(full);
  writeMeta(all.filter((m) => m.id !== id));
  return true;
}
