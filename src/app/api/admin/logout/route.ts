import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, revokeRefreshToken, cookieOptions } from "@/lib/admin/auth";
import { appendLog } from "@/lib/admin/logs";

export async function POST(req: NextRequest) {
  const jti = req.cookies.get(REFRESH_COOKIE)?.value;
  revokeRefreshToken(jti);
  appendLog("logout", "管理员退出");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
