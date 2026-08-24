import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 生产环境 HTTPS 下，better-auth 会加 __Secure- 前缀
  const sessionCookie = 
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/create/:path*"],
};
