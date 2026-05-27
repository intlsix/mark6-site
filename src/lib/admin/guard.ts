import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE, verifyAccessToken, verifyRefreshToken } from "./auth";

export async function requireAdmin() {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const payload = await verifyAccessToken(access);
  if (payload) return { username: payload.sub, role: payload.role };

  const jti = store.get(REFRESH_COOKIE)?.value;
  const refreshPayload = await verifyRefreshToken(jti);
  if (refreshPayload) return { username: refreshPayload.sub, role: refreshPayload.role };

  redirect("/admin/login");
}
