import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/j8x2k5m")) {
    return NextResponse.next();
  }
  const response = intlMiddleware(request);
  // 所有页面 HTML 不缓存，保证每次构建后用户立即看到最新版本
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
