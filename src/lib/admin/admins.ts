import { getAdmins, saveAdmins, hashPassword, type AdminRecord, type AdminRole } from "./auth";

export { getAdmins, saveAdmins, hashPassword };
export type { AdminRecord, AdminRole };

export function addAdmin(username: string, password: string, role: AdminRole): AdminRecord | null {
  const all = getAdmins();
  if (all.some((a) => a.username === username)) return null;
  const rec: AdminRecord = {
    id: String(Date.now()),
    username,
    passwordHash: hashPassword(password),
    role,
    createdAt: new Date().toISOString(),
  };
  all.push(rec);
  saveAdmins(all);
  return rec;
}

export function updateAdminPassword(username: string, password: string): boolean {
  const all = getAdmins();
  const idx = all.findIndex((a) => a.username === username);
  if (idx < 0) return false;
  all[idx].passwordHash = hashPassword(password);
  saveAdmins(all);
  return true;
}

export function deleteAdmin(username: string): boolean {
  const all = getAdmins();
  if (all.length <= 1) return false;
  const next = all.filter((a) => a.username !== username);
  if (next.length === all.length) return false;
  saveAdmins(next);
  return true;
}
