import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getMediaItems, saveUpload, deleteMedia } from "@/lib/admin/media";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => NextResponse.json(getMediaItems()));
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "无文件" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "文件超过 5MB" }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const item = saveUpload(buf, file.name);
    appendLog("media_upload", `${user.username} 上传 ${item.filename}`);
    return NextResponse.json(item);
  });
}

export async function DELETE(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    deleteMedia(id);
    appendLog("media_delete", `${user.username} 删除媒体 ${id}`);
    return NextResponse.json({ ok: true });
  });
}
