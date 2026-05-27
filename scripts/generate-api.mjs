import fs from "fs";
import path from "path";

const ROOT = path.join("C:\\Users\\Win-Hermes\\mark6-site\\src");

function w(rel, content) {
  const fp = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content.replace(/\r?\n/g, "\n"), "utf8");
}

w("app/api/admin/login/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, verifyPassword } from "@/lib/admin/auth";
import { appendLog } from "@/lib/admin/logs";

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };
  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = createSession();
  appendLog("login", "Admin logged in", req.headers.get("x-forwarded-for") ?? undefined);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });
  return res;
}
`);

w("app/api/admin/logout/route.ts", `import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE, getSessionToken } from "@/lib/admin/auth";

export async function POST() {
  const token = await getSessionToken();
  if (token) destroySession(token);
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
`);

w("app/api/admin/hk-draws/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { appendLog } from "@/lib/admin/logs";
import { getHongKongDraws, saveHongKongDraws } from "@/lib/draw/hongkong";
import type { DrawRecord } from "@/lib/mark6/types";

async function auth() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await auth();
  if (err) return err;
  return NextResponse.json(getHongKongDraws());
}

export async function POST(req: NextRequest) {
  const err = await auth();
  if (err) return err;
  const body = (await req.json()) as DrawRecord;
  const draws = getHongKongDraws();
  if (draws.some((d) => d.id === body.id)) {
    return NextResponse.json({ error: "Duplicate id" }, { status: 400 });
  }
  draws.push(body);
  saveHongKongDraws(draws);
  appendLog("hk_create", \`Created \${body.id}\`);
  return NextResponse.json(body);
}

export async function PUT(req: NextRequest) {
  const err = await auth();
  if (err) return err;
  const body = (await req.json()) as DrawRecord;
  const draws = getHongKongDraws();
  const idx = draws.findIndex((d) => d.id === body.id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  draws[idx] = body;
  saveHongKongDraws(draws);
  appendLog("hk_update", \`Updated \${body.id}\`);
  return NextResponse.json(body);
}

export async function DELETE(req: NextRequest) {
  const err = await auth();
  if (err) return err;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const draws = getHongKongDraws().filter((d) => d.id !== id);
  saveHongKongDraws(draws);
  appendLog("hk_delete", \`Deleted \${id}\`);
  return NextResponse.json({ ok: true });
}
`);

w("app/api/admin/intl-draws/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { appendLog } from "@/lib/admin/logs";
import {
  getInternationalDraws,
  getManualInternationalDraws,
  triggerManualDraw,
  addManualInternationalDraw,
} from "@/lib/draw/international";
import { generateSeed, drawNumbersFromSeed, sha256 } from "@/lib/mark6/fairness";

async function auth() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await auth();
  if (err) return err;
  return NextResponse.json({
    auto: getInternationalDraws(),
    manual: getManualInternationalDraws(),
  });
}

export async function POST(req: NextRequest) {
  const err = await auth();
  if (err) return err;
  const { action } = (await req.json()) as { action?: string };

  if (action === "trigger") {
    const draw = triggerManualDraw();
    appendLog("intl_trigger", \`Triggered \${draw.id}\`);
    return NextResponse.json(draw);
  }

  if (action === "manual") {
    const seed = generateSeed();
    const { numbers, special } = drawNumbersFromSeed(seed);
    const draw = addManualInternationalDraw({
      drawAt: new Date().toISOString(),
      numbers,
      special,
      seed,
      seedHash: sha256(seed),
    });
    appendLog("intl_manual", \`Manual add \${draw.id}\`);
    return NextResponse.json(draw);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
`);

w("app/api/admin/articles/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { appendLog } from "@/lib/admin/logs";
import { getArticles, upsertArticle, deleteArticle } from "@/lib/admin/articles";
import type { KnowledgeArticle } from "@/lib/mark6/types";

async function auth() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await auth();
  if (err) return err;
  return NextResponse.json(getArticles());
}

export async function POST(req: NextRequest) {
  const err = await auth();
  if (err) return err;
  const article = (await req.json()) as KnowledgeArticle;
  upsertArticle(article);
  appendLog("article_save", \`Saved \${article.id}\`);
  return NextResponse.json(article);
}

export async function DELETE(req: NextRequest) {
  const err = await auth();
  if (err) return err;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  deleteArticle(id);
  appendLog("article_delete", \`Deleted \${id}\`);
  return NextResponse.json({ ok: true });
}
`);

w("app/api/cron/international-draw/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { runCronInternationalDraw } from "@/lib/draw/international";
import { appendLog } from "@/lib/admin/logs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== \`Bearer \${cronSecret}\`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const draw = await runCronInternationalDraw();
  if (draw) {
    appendLog("cron_intl", \`Auto draw \${draw.id}\`);
    return NextResponse.json({ ok: true, draw });
  }
  return NextResponse.json({ ok: true, skipped: true });
}
`);

w("app/api/public/draws/route.ts", `import { NextResponse } from "next/server";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";

export async function GET() {
  return NextResponse.json({
    hk: getHongKongDraws(),
    intl: getInternationalDraws(),
  });
}
`);

// Fix international.ts - remove async import issue, use direct import
console.log("Wrote API routes");
