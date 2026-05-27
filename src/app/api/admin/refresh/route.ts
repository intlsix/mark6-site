import { NextRequest, NextResponse } from "next/server";
import {
  REFRESH_COOKIE,
  verifyRefreshToken,
  touchRefreshToken,
  userFromRefresh,
  signAccessToken,
  ACCESS_COOKIE,
  cookieOptions,
  accessCookieMaxAge,
} from "@/lib/admin/auth";

export async function POST(req: NextRequest) {
  const jti = req.cookies.get(REFRESH_COOKIE)?.value;
  const rec = verifyRefreshToken(jti);
  if (!rec) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
  touchRefreshToken(jti!);
  const user = userFromRefresh(rec);
  const access = await signAccessToken(user, Date.now());
  const res = NextResponse.json({
    ok: true,
    accessToken: access,
    expiresIn: 8 * 60 * 60,
    user: { username: user.username, role: user.role },
  });
  res.cookies.set(ACCESS_COOKIE, access, { ...cookieOptions, maxAge: accessCookieMaxAge() });
  return res;
}
