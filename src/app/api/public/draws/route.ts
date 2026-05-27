import { NextResponse } from "next/server";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";

export async function GET() {
  const [hk, intl] = await Promise.all([getHongKongDraws(), getInternationalDraws()]);
  return NextResponse.json({
    hk,
    intl,
  });
}
