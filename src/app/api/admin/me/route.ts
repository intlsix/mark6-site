import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    return NextResponse.json({ user });
  });
}
