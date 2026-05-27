import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { getLogs } from "@/lib/admin/logs";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const action = req.nextUrl.searchParams.get("action");
    const admin = req.nextUrl.searchParams.get("admin");
    const day = req.nextUrl.searchParams.get("day");
    let logs = getLogs();
    if (action && action !== "all") {
      logs = logs.filter((l) => l.action.includes(action));
    }
    if (admin && admin !== "all") {
      logs = logs.filter((l) => l.detail.includes(admin));
    }
    if (day === "today") {
      const t = new Date().toISOString().slice(0, 10);
      logs = logs.filter((l) => l.at.startsWith(t));
    }
    return NextResponse.json(logs);
  });
}
