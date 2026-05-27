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
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs.slice(0, 500), null, 2) + "\n", "utf8");
  return entry;
}

export function getLogs(): AdminLogEntry[] {
  return readLogs();
}
