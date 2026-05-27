import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { AdminLogEntry } from "@/lib/mark6/types";

const LOG_PATH = path.join(process.cwd(), "src/data/admin/logs.json");

function readLogs(): AdminLogEntry[] {
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, "utf8")) as AdminLogEntry[];
  } catch {
    return [];
  }
}

function safeWrite(data: string): boolean {
  try {
    fs.writeFileSync(LOG_PATH, data, "utf8");
    return true;
  } catch (err) {
    // Netlify / read-only filesystem — silently skip
    console.warn("appendLog: cannot write to logs.json (read-only FS)");
    return false;
  }
}

export function appendLog(action: string, detail: string, ip?: string): AdminLogEntry {
  const entry: AdminLogEntry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    action,
    detail,
    ip,
  };
  const logs = readLogs();
  logs.unshift(entry);
  safeWrite(JSON.stringify(logs.slice(0, 500), null, 2) + "\n");
  return entry;
}

export function getLogs(): AdminLogEntry[] {
  return readLogs();
}
