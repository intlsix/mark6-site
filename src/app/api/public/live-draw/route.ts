import { NextResponse } from "next/server";
import { readLiveDraw } from "@/lib/draw/live-draw";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readLiveDraw();
  return NextResponse.json(state);
}
