import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { readJson, writeJson, useBlobStorage } from "@/lib/storage/json-store";

export interface BackupRecord {
  id: string;
  filename: string;
  sizeBytes: number;
  at: string;
}

const BACKUP_DIR = path.join(process.cwd(), "src/data/admin/backups");
const SETTINGS_KEY = "admin/settings.json";
const BACKUP_PREFIX = "admin/backups/";

const DATA_KEYS = [
  "hongkong/draws.json",
  "international/draws.json",
  "knowledge-base.json",
  "admin/pages.json",
  "admin/seo.json",
  "admin/settings.json",
] as const;

export interface SiteSettings {
  siteNameZh: string;
  siteNameEn: string;
  company: string;
  jurisdiction: string;
  regNumber: string;
  contactEmail: string;
  autoBackupEnabled: boolean;
  hkScrapeEnabled: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteNameZh: "香港国际六合彩",
  siteNameEn: "Hong Kong Intl Mark Six",
  company: "香港国际六合彩有限公司",
  jurisdiction: "马恩岛",
  regNumber: "IMO-128456",
  contactEmail: "support@example.com",
  autoBackupEnabled: true,
  hkScrapeEnabled: false,
};

export async function getSettings(): Promise<SiteSettings> {
  const s = await readJson<Partial<SiteSettings>>(SETTINGS_KEY, {});
  return { ...DEFAULT_SETTINGS, ...s };
}

export async function saveSettings(s: SiteSettings): Promise<boolean> {
  return writeJson(SETTINGS_KEY, s);
}

async function listBackupsLocal(): Promise<BackupRecord[]> {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((filename) => {
      const full = path.join(BACKUP_DIR, filename);
      const stat = fs.statSync(full);
      return {
        id: filename.replace(".json", ""),
        filename,
        sizeBytes: stat.size,
        at: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.at.localeCompare(a.at));
}

async function listBackupsBlob(): Promise<BackupRecord[]> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name: "mark6-data", consistency: "strong" });
    const { blobs } = await store.list({ prefix: BACKUP_PREFIX });
    return blobs
      .map((b) => {
        const filename = b.key.replace(BACKUP_PREFIX, "");
        const id = filename.replace(".json", "");
        return {
          id,
          filename,
          sizeBytes: 0,
          at: new Date().toISOString(),
        };
      })
      .sort((a, b) => b.at.localeCompare(a.at));
  } catch {
    return [];
  }
}

export async function getBackupList(): Promise<BackupRecord[]> {
  return useBlobStorage() ? listBackupsBlob() : listBackupsLocal();
}

async function gatherBundle(): Promise<Record<string, unknown>> {
  const bundle: Record<string, unknown> = { createdAt: new Date().toISOString() };
  for (const key of DATA_KEYS) {
    bundle[key] = await readJson(key, null);
  }
  return bundle;
}

export async function createBackup(): Promise<BackupRecord> {
  const id = `backup_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${randomUUID().slice(0, 6)}`;
  const filename = `${id}.json`;
  const bundle = await gatherBundle();
  const content = JSON.stringify(bundle, null, 2);
  const blobKey = `${BACKUP_PREFIX}${filename}`;

  if (useBlobStorage()) {
    await writeJson(blobKey, bundle);
  } else {
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    fs.writeFileSync(path.join(BACKUP_DIR, filename), content, "utf8");
  }

  return {
    id,
    filename,
    sizeBytes: Buffer.byteLength(content, "utf8"),
    at: new Date().toISOString(),
  };
}

export async function restoreBackup(id: string): Promise<boolean> {
  let bundle: Record<string, unknown>;
  if (useBlobStorage()) {
    bundle = await readJson(`${BACKUP_PREFIX}${id}.json`, {});
    if (!bundle || Object.keys(bundle).length <= 1) return false;
  } else {
    const full = path.join(BACKUP_DIR, `${id}.json`);
    if (!fs.existsSync(full)) return false;
    bundle = JSON.parse(fs.readFileSync(full, "utf8")) as Record<string, unknown>;
  }

  for (const [key, data] of Object.entries(bundle)) {
    if (key === "createdAt" || typeof data !== "object" || data === null) continue;
    if (!(DATA_KEYS as readonly string[]).includes(key)) continue;
    await writeJson(key, data);
  }
  return true;
}

export async function readBackupFile(id: string): Promise<Buffer | null> {
  if (useBlobStorage()) {
    const bundle = await readJson<Record<string, unknown>>(`${BACKUP_PREFIX}${id}.json`, {});
    if (!bundle || Object.keys(bundle).length === 0) return null;
    return Buffer.from(JSON.stringify(bundle, null, 2), "utf8");
  }
  const full = path.join(BACKUP_DIR, `${id}.json`);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full);
}
