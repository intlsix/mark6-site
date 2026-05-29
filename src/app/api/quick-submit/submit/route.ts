import { NextRequest, NextResponse } from "next/server";
import { getHongKongDraws, saveHongKongDraws } from "@/lib/draw/hongkong";
import { consumeToken } from "@/lib/quick-submit/token-store";
import { exec } from "child_process";
import { promisify } from "util";
import type { DrawRecord } from "@/lib/mark6/types";

const execAsync = promisify(exec);

interface SubmitBody {
  token: string;
  draw: {
    id: string;
    drawAt: string;
    numbers: number[];
    special: number;
  };
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate token (one-time use)
  if (!body.token || !consumeToken(body.token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Validate draw data
  const { draw } = body;
  if (!draw || !draw.id || !draw.drawAt || !Array.isArray(draw.numbers) || !draw.special) {
    return NextResponse.json({ error: "Invalid draw data" }, { status: 400 });
  }

  // Validate numbers: 6 regular + 1 special, all 1-49, no duplicates
  if (draw.numbers.length !== 6) {
    return NextResponse.json({ error: "Need exactly 6 numbers" }, { status: 400 });
  }
  const allNums = [...draw.numbers, draw.special];
  for (const n of allNums) {
    if (typeof n !== "number" || n < 1 || n > 49 || !Number.isInteger(n)) {
      return NextResponse.json({ error: `Invalid number: ${n}` }, { status: 400 });
    }
  }
  if (new Set(allNums).size !== 7) {
    return NextResponse.json({ error: "Duplicate numbers" }, { status: 400 });
  }

  // Check if period already exists
  const draws = await getHongKongDraws();
  if (draws.some((d) => d.id === draw.id)) {
    return NextResponse.json({ error: "Period already exists" }, { status: 400 });
  }

  // Add draw
  const record: DrawRecord = {
    id: draw.id,
    drawAt: draw.drawAt,
    numbers: draw.numbers,
    special: draw.special,
    source: "manual",
  };
  draws.push(record);
  const ok = await saveHongKongDraws(draws);
  if (!ok) {
    return NextResponse.json({ error: "Write failed" }, { status: 503 });
  }

  // Git commit + push (async, don't block response)
  const repoPath = process.cwd();
  execAsync(
    `cd "${repoPath}" && git add src/data/hongkong/draws.json && git commit -m "data: hk draw ${draw.id}" && git push origin main`,
    { timeout: 30000 }
  ).then(({ stdout, stderr }) => {
    console.log(`[quick-submit] git push for ${draw.id}: OK`);
  }).catch((err) => {
    console.error(`[quick-submit] git push failed for ${draw.id}:`, err.message);
  });

  return NextResponse.json({ ok: true, id: draw.id });
}
