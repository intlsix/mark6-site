import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  signAccessToken,
  touchRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  userFromRefresh,
  cookieOptions,
  accessCookieMaxAge,
  type AdminUser,
} from "./auth";

export async function getUserFromRequest(req: NextRequest): Promise<AdminUser | null> {
  const bearer = req.headers.get("authorization");
  const token =
    bearer?.startsWith("Bearer ") ? bearer.slice(7) : req.cookies.get(ACCESS_COOKIE)?.value;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;
  return { id: "0", username: payload.sub, role: payload.role };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function requireAdminApi(
  req: NextRequest
): Promise<{ user: AdminUser; renewed: boolean } | NextResponse> {
  let user = await getUserFromRequest(req);
  if (user) return { user, renewed: false };

  const jti = req.cookies.get(REFRESH_COOKIE)?.value;
  const rec = verifyRefreshToken(jti);
  if (!rec) return unauthorized();

  touchRefreshToken(jti!);
  user = userFromRefresh(rec);
  return { user, renewed: true };
}

export async function withAdminAuth(
  req: NextRequest,
  handler: (user: AdminUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const auth = await requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const res = await handler(auth.user);
  return attachAccessCookie(res, auth.user, Date.now());
}

export async function attachAccessCookie(
  res: NextResponse,
  user: AdminUser,
  lastAct = Date.now()
): Promise<NextResponse> {
  const access = await signAccessToken(user, lastAct);
  res.cookies.set(ACCESS_COOKIE, access, { ...cookieOptions, maxAge: accessCookieMaxAge() });
  return res;
}
