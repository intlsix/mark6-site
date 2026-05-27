import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { getLogs } from "@/lib/admin/logs";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => NextResponse.json(await getLogs()));
}
