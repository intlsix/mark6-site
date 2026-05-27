import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export interface BackupRecord {
  id: string;
  filename: string;
  sizeBytes: number;
  at: string;
}

const BACKUP_DIR = path.join(process.cwd(), "src/data/admin/backups");
const SETTINGS_PATH = path.join(process.cwd(), "src/data/admin/settings.json");

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

export function getSettings(): SiteSettings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8")) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: SiteSettings): void {
  const dir = path.dirname(SETTINGS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  try { fs.writeFileSync(SETTINGS_PATH, JSON.stringify(s, null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
}

function listBackups(): BackupRecord[] {
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

export function getBackupList(): BackupRecord[] {
  return listBackups();
}

export function createBackup(): BackupRecord {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const id = `backup_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${randomUUID().slice(0, 6)}`;
  const filename = `${id}.json`;
  const srcFiles = [
    "src/data/hongkong/draws.json",
    "src/data/international/draws.json",
    "src/data/knowledge-base.json",
    "src/data/admin/pages.json",
    "src/data/admin/seo.json",
    "src/data/admin/settings.json",
  ];
  const bundle: Record<string, unknown> = { createdAt: new Date().toISOString() };
  for (const rel of srcFiles) {
    const full = path.join(process.cwd(), rel);
    if (fs.existsSync(full)) {
      bundle[rel] = JSON.parse(fs.readFileSync(full, "utf8"));
    }
  }
  const content = JSON.stringify(bundle, null, 2);
  try { fs.writeFileSync(path.join(BACKUP_DIR, filename), content, "utf8"); } catch { /* read-only FS */ }
  return {
    id,
    filename,
    sizeBytes: Buffer.byteLength(content, "utf8"),
    at: new Date().toISOString(),
  };
}

export function restoreBackup(id: string): boolean {
  const full = path.join(BACKUP_DIR, `${id}.json`);
  if (!fs.existsSync(full)) return false;
  const bundle = JSON.parse(fs.readFileSync(full, "utf8")) as Record<string, unknown>;
  for (const [rel, data] of Object.entries(bundle)) {
    if (rel === "createdAt" || typeof data !== "object") continue;
    const target = path.join(process.cwd(), rel);
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try { fs.writeFileSync(target, JSON.stringify(data, null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
  }
  return true;
}

export function readBackupFile(id: string): Buffer | null {
  const full = path.join(BACKUP_DIR, `${id}.json`);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full);
}
