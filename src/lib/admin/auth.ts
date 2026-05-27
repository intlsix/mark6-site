import { createHash, randomUUID } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import fs from "fs";
import path from "path";

export const ACCESS_COOKIE = "mark6_access";
export const REFRESH_COOKIE = "mark6_refresh";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "mark6-dev-secret-change-in-production"
);
const ACCESS_TTL_SEC = 8 * 60 * 60;
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60;
export const IDLE_MS = 30 * 60 * 1000;

const REFRESH_STORE = path.join(process.cwd(), "src/data/admin/refresh-tokens.json");
const ADMINS_PATH = path.join(process.cwd(), "src/data/admin/admins.json");

export type AdminRole = "super" | "editor";

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
}

export interface AdminRecord extends AdminUser {
  passwordHash: string;
  createdAt: string;
}

export interface AccessPayload {
  sub: string;
  role: AdminRole;
  lastAct: number;
}

interface RefreshRecord {
  username: string;
  role: AdminRole;
  exp: number;
  lastAct: number;
}

function readRefreshStore(): Record<string, RefreshRecord> {
  try {
    return JSON.parse(fs.readFileSync(REFRESH_STORE, "utf8")) as Record<string, RefreshRecord>;
  } catch {
    return {};
  }
}

function writeRefreshStore(store: Record<string, RefreshRecord>): void {
  const dir = path.dirname(REFRESH_STORE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REFRESH_STORE, JSON.stringify(store, null, 2) + "\n", "utf8");
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function ensureAdminsFile(): AdminRecord[] {
  const dir = path.dirname(ADMINS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ADMINS_PATH)) {
    const defaultAdmins: AdminRecord[] = [
      {
        id: "1",
        username: "admin",
        passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "changeme"),
        role: "super",
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(ADMINS_PATH, JSON.stringify(defaultAdmins, null, 2) + "\n", "utf8");
    return defaultAdmins;
  }
  return JSON.parse(fs.readFileSync(ADMINS_PATH, "utf8")) as AdminRecord[];
}

export function getAdmins(): AdminRecord[] {
  return ensureAdminsFile();
}

export function saveAdmins(admins: AdminRecord[]): void {
  fs.writeFileSync(ADMINS_PATH, JSON.stringify(admins, null, 2) + "\n", "utf8");
}

export function verifyCredentials(username: string, password: string): AdminUser | null {
  const admin = getAdmins().find((a) => a.username === username);
  if (!admin || admin.passwordHash !== hashPassword(password)) return null;
  return { id: admin.id, username: admin.username, role: admin.role };
}

export async function signAccessToken(user: AdminUser, lastAct = Date.now()): Promise<string> {
  return new SignJWT({ role: user.role, lastAct })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SEC}s`)
    .sign(SECRET);
}

export async function verifyAccessToken(token: string | undefined): Promise<AccessPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const lastAct = (payload.lastAct as number) ?? 0;
    if (Date.now() - lastAct > IDLE_MS) return null;
    return {
      sub: payload.sub as string,
      role: payload.role as AdminRole,
      lastAct,
    };
  } catch {
    return null;
  }
}

export function createRefreshToken(user: AdminUser): string {
  const jti = randomUUID();
  const now = Date.now();
  const store = readRefreshStore();
  store[jti] = {
    username: user.username,
    role: user.role,
    exp: now + REFRESH_TTL_SEC * 1000,
    lastAct: now,
  };
  const cutoff = now - REFRESH_TTL_SEC * 1000;
  for (const [k, v] of Object.entries(store)) {
    if (v.exp < cutoff) delete store[k];
  }
  writeRefreshStore(store);
  return jti;
}

export function verifyRefreshToken(jti: string | undefined): RefreshRecord | null {
  if (!jti) return null;
  const store = readRefreshStore();
  const rec = store[jti];
  if (!rec || rec.exp < Date.now()) {
    if (rec) {
      delete store[jti];
      writeRefreshStore(store);
    }
    return null;
  }
  if (Date.now() - rec.lastAct > IDLE_MS) {
    delete store[jti];
    writeRefreshStore(store);
    return null;
  }
  return rec;
}

export function touchRefreshToken(jti: string): void {
  const store = readRefreshStore();
  const rec = store[jti];
  if (rec) {
    rec.lastAct = Date.now();
    writeRefreshStore(store);
  }
}

export function revokeRefreshToken(jti: string | undefined): void {
  if (!jti) return;
  const store = readRefreshStore();
  delete store[jti];
  writeRefreshStore(store);
}

export function userFromRefresh(rec: RefreshRecord): AdminUser {
  const admin = getAdmins().find((a) => a.username === rec.username);
  return {
    id: admin?.id ?? "0",
    username: rec.username,
    role: rec.role,
  };
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export function accessCookieMaxAge() {
  return ACCESS_TTL_SEC;
}

export function refreshCookieMaxAge() {
  return REFRESH_TTL_SEC;
}
