"use client";

const IDLE_MS = 30 * 60 * 1000;
let lastActivity = Date.now();
let refreshTimer: ReturnType<typeof setInterval> | null = null;

export function touchActivity() {
  lastActivity = Date.now();
}

export function startAdminSession() {
  touchActivity();
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(async () => {
    if (Date.now() - lastActivity > IDLE_MS) {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
      window.location.href = "/admin/login?reason=idle";
      return;
    }
    await fetch("/api/admin/refresh", { method: "POST", credentials: "include" });
  }, 5 * 60 * 1000);

  if (typeof window !== "undefined") {
    const onAct = () => touchActivity();
    window.addEventListener("mousedown", onAct);
    window.addEventListener("keydown", onAct);
    window.addEventListener("scroll", onAct);
  }
}

export function stopAdminSession() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = null;
}

export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  touchActivity();
  const opts: RequestInit = { ...init, credentials: "include" };
  let res = await fetch(input, opts);
  if (res.status === 401) {
    const refreshed = await fetch("/api/admin/refresh", { method: "POST", credentials: "include" });
    if (refreshed.ok) {
      res = await fetch(input, opts);
    } else {
      stopAdminSession();
      window.location.href = "/admin/login?reason=expired";
      throw new Error("Session expired");
    }
  }
  return res;
}

export async function adminJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await adminFetch(input, init);
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}
