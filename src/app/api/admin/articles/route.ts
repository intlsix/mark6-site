import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin/api-auth";
import { appendLog } from "@/lib/admin/logs";
import { getArticles, upsertArticle, deleteArticle } from "@/lib/admin/articles";
import type { KnowledgeArticle } from "@/lib/mark6/types";

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => NextResponse.json(getArticles()));
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const article = (await req.json()) as KnowledgeArticle;
    upsertArticle({ ...article, updatedAt: new Date().toISOString() });
    appendLog("article_save", `${user.username} 保存文章 ${article.id}`);
    return NextResponse.json(article);
  });
}

export async function DELETE(req: NextRequest) {
  return withAdminAuth(req, async (user) => {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    deleteArticle(id);
    appendLog("article_delete", `${user.username} 删除文章 ${id}`);
    return NextResponse.json({ ok: true });
  });
}
