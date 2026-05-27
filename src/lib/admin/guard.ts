import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE, verifyAccessToken, verifyRefreshToken } from "./auth";

export async function requireAdmin() {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const payload = await verifyAccessToken(access);
  if (payload) return { username: payload.sub, role: payload.role };

  const jti = store.get(REFRESH_COOKIE)?.value;
  if (verifyRefreshToken(jti)) return { username: "admin", role: "super" as const };

  redirect("/admin/login");
}
