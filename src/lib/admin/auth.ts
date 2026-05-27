import { createHash } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { readJson, writeJson } from "@/lib/storage/json-store";

export const ACCESS_COOKIE = "mark6_access";
export const REFRESH_COOKIE = "mark6_refresh";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "mark6-dev-secret-change-in-production",
);
const ACCESS_TTL_SEC = 8 * 60 * 60;
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60;
export const IDLE_MS = 30 * 60 * 1000;

const ADMINS_KEY = "admin/admins.json";

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

export interface RefreshPayload {
  sub: string;
  role: AdminRole;
  exp: number;
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

const DEFAULT_ADMINS: AdminRecord[] = [
  {
    id: "1",
    username: "admin",
    passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "changeme"),
    role: "super",
    createdAt: new Date().toISOString(),
  },
];

export async function getAdmins(): Promise<AdminRecord[]> {
  const admins = await readJson<AdminRecord[]>(ADMINS_KEY, []);
  if (admins.length === 0) {
    await writeJson(ADMINS_KEY, DEFAULT_ADMINS);
    return DEFAULT_ADMINS;
  }
  return admins;
}

export async function saveAdmins(admins: AdminRecord[]): Promise<boolean> {
  return writeJson(ADMINS_KEY, admins);
}

export async function verifyCredentials(username: string, password: string): Promise<AdminUser | null> {
  const admin = (await getAdmins()).find((a) => a.username === username);
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

export async function signRefreshToken(user: AdminUser): Promise<string> {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SEC}s`)
    .sign(SECRET);
}

export async function verifyRefreshToken(token: string | undefined): Promise<RefreshPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      sub: payload.sub as string,
      role: payload.role as AdminRole,
      exp: (payload.exp as number) ?? 0,
    };
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function accessCookieMaxAge(): number {
  return ACCESS_TTL_SEC;
}

export function refreshCookieMaxAge(): number {
  return REFRESH_TTL_SEC;
}

export async function createRefreshToken(user: AdminUser): Promise<string> {
  return signRefreshToken(user);
}

export function userFromRefresh(rec: RefreshPayload): AdminUser {
  return { id: "0", username: rec.sub, role: rec.role };
}

export function touchRefreshToken(_token: string): void {
  /* self-contained JWT — no server-side store */
}

export async function revokeRefreshToken(_token: string): Promise<void> {
  /* self-contained JWT — no server store */
}
