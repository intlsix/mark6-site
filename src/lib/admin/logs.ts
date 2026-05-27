import { randomUUID } from "crypto";
import type { AdminLogEntry } from "@/lib/mark6/types";
import { readJson, writeJson } from "@/lib/storage/json-store";

const KEY = "admin/logs.json";

export async function appendLog(action: string, detail: string, ip?: string): Promise<AdminLogEntry> {
  const entry: AdminLogEntry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    action,
    detail,
    ip,
  };
  const logs = await readJson<AdminLogEntry[]>(KEY, []);
  logs.unshift(entry);
  await writeJson(KEY, logs.slice(0, 500));
  return entry;
}

export async function getLogs(): Promise<AdminLogEntry[]> {
  return readJson<AdminLogEntry[]>(KEY, []);
}
