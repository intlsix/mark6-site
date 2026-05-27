import { NextResponse } from "next/server";
import { getInternationalDraws } from "@/lib/draw/international";

export const dynamic = "force-dynamic";

export async function GET() {
  const draws = await getInternationalDraws();
  return NextResponse.json(draws[0] ?? null);
}
