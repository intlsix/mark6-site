import { NextResponse } from "next/server";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    hk: getHongKongDraws(),
    intl: getInternationalDraws(),
  });
}
