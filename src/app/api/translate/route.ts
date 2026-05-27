import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text?.trim()) {
    return NextResponse.json({ translated: "" });
  }

  try {
    // Use Google Translate (unofficial API, free)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = data[0]?.map((item: unknown[]) => item[0]).join("") || text;
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ translated: text, error: "翻译失败" }, { status: 500 });
  }
}
