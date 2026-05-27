import { createHash } from "crypto";
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

// Netlify Functions run on read-only filesystem, so refresh tokens
// are self-contained JWTs instead of a server-side store.
export interface RefreshPayload {
  sub: string;
  role: AdminRole;
  exp: number;
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

// ── Refresh token: self-contained JWT (no filesystem writes) ──

export function createRefreshToken(user: AdminUser): string {
  return new SignJWT({ role: user.role } as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SEC}s`)
    .sign(SECRET);
}

export async function verifyRefreshToken(jti: string | undefined): Promise<RefreshPayload | null> {
  if (!jti) return null;
  try {
    const { payload } = await jwtVerify(jti, SECRET);
    return {
      sub: payload.sub as string,
      role: payload.role as AdminRole,
      exp: (payload.exp as number) ?? 0,
    };
  } catch {
    return null;
  }
}

// No-op on Netlify (JWT is self-contained, no server-side store)
export function touchRefreshToken(_jti: string): void {}

// No-op on Netlify (JWT expires naturally, no server-side store)
export function revokeRefreshToken(_jti: string | undefined): void {}

export function userFromRefresh(rec: RefreshPayload): AdminUser {
  const admin = getAdmins().find((a) => a.username === rec.sub);
  return {
    id: admin?.id ?? "0",
    username: rec.sub,
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
