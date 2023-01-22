import { NextRequest, NextResponse } from "next/server";
import { authCheck } from "./pages/api/auth/auth";
export function middleware(req: NextRequest) {
  let uid = req.cookies.get("uid");
  if (req.nextUrl.pathname.startsWith("/login")) {
    console.log("/login");
    if (!uid?.value) {
    } else if (uid.value != undefined) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    return NextResponse.redirect(new URL("/login/login", req.url));
  }
}

export const config = {
  matcher: [
    "/log/addLog:path*",
    "/spot/addSpot:path*",
    "/profile/profile",
    "/login/login",
  ],
};
