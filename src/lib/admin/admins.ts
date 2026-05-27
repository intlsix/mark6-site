import { getAdmins, saveAdmins, hashPassword, type AdminRecord, type AdminRole } from "./auth";

export { getAdmins, saveAdmins, hashPassword };
export type { AdminRecord, AdminRole };

export async function addAdmin(username: string, password: string, role: AdminRole): Promise<AdminRecord | null> {
  const all = await getAdmins();
  if (all.some((a) => a.username === username)) return null;
  const rec: AdminRecord = {
    id: String(Date.now()),
    username,
    passwordHash: hashPassword(password),
    role,
    createdAt: new Date().toISOString(),
  };
  all.push(rec);
  await saveAdmins(all);
  return rec;
}

export async function updateAdminPassword(username: string, password: string): Promise<boolean> {
  const all = await getAdmins();
  const idx = all.findIndex((a) => a.username === username);
  if (idx < 0) return false;
  all[idx].passwordHash = hashPassword(password);
  return saveAdmins(all);
}

export async function deleteAdmin(username: string): Promise<boolean> {
  const all = await getAdmins();
  if (all.length <= 1) return false;
  const next = all.filter((a) => a.username !== username);
  if (next.length === all.length) return false;
  return saveAdmins(next);
}
