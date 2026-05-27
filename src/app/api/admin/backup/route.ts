import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import {
  getBackupList,
  createBackup,
  restoreBackup,
  readBackupFile,
} from "@/lib/admin/backup";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const id = req.nextUrl.searchParams.get("download");
    if (id) {
      const buf = await readBackupFile(id);
      if (!buf) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${id}.json"`,
        },
      });
    }
    return NextResponse.json(await getBackupList());
  });
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const { action, id } = (await req.json()) as { action?: string; id?: string };
    if (action === "restore" && id) {
      if (!(await restoreBackup(id))) {
        return NextResponse.json({ error: "恢复失败" }, { status: 404 });
      }
      await appendLog("backup_restore", `${user.username} 恢复备份 ${id}`);
      return NextResponse.json({ ok: true });
    }
    const rec = await createBackup();
    await appendLog("backup_create", `${user.username} 创建备份 ${rec.filename}`);
    return NextResponse.json(rec);
  });
}
