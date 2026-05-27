import { NextRequest, NextResponse } from "next/server";
import {
  verifyCredentials,
  createRefreshToken,
  signAccessToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
  accessCookieMaxAge,
  refreshCookieMaxAge,
} from "@/lib/admin/auth";
import { appendLog } from "@/lib/admin/logs";

export async function POST(req: NextRequest) {
  const { username, password, remember } = (await req.json()) as {
    username?: string;
    password?: string;
    remember?: boolean;
  };
  if (!username || !password) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
  }
  const user = verifyCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  const access = await signAccessToken(user);
  const refresh = createRefreshToken(user);
  appendLog("login", `${user.username} 登录`, req.headers.get("x-forwarded-for") ?? undefined);

  const res = NextResponse.json({
    ok: true,
    accessToken: access,
    expiresIn: 8 * 60 * 60,
    user: { username: user.username, role: user.role },
  });
  res.cookies.set(ACCESS_COOKIE, access, { ...cookieOptions, maxAge: accessCookieMaxAge() });
  res.cookies.set(REFRESH_COOKIE, refresh, {
    ...cookieOptions,
    maxAge: remember ? refreshCookieMaxAge() : refreshCookieMaxAge(),
  });
  return res;
}
