import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getAdmins, addAdmin, updateAdminPassword, deleteAdmin } from "@/lib/admin/admins";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const admins = getAdmins().map(({ passwordHash: _, ...rest }) => rest);
    return NextResponse.json(admins);
  });
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const body = (await req.json()) as {
      action?: string;
      username?: string;
      password?: string;
      role?: "super" | "editor";
    };
    if (body.action === "password" && body.username && body.password) {
      updateAdminPassword(body.username, body.password);
      appendLog("admin_pwd", `${user.username} 修改 ${body.username} 密码`);
      return NextResponse.json({ ok: true });
    }
    if (body.username && body.password && body.role) {
      const rec = addAdmin(body.username, body.password, body.role);
      if (!rec) return NextResponse.json({ error: "用户名已存在" }, { status: 400 });
      appendLog("admin_add", `${user.username} 添加管理员 ${body.username}`);
      const { passwordHash: _, ...safe } = rec;
      return NextResponse.json(safe);
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  });
}

export async function DELETE(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const username = req.nextUrl.searchParams.get("username");
    if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });
    if (!deleteAdmin(username)) {
      return NextResponse.json({ error: "无法删除" }, { status: 400 });
    }
    appendLog("admin_delete", `${user.username} 删除管理员 ${username}`);
    return NextResponse.json({ ok: true });
  });
}
