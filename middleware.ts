import { NextRequest, NextResponse } from "next/server";
import { checkJWT, checkRefreshToken, refreshJWT } from "./pages/api/auth/auth";

export async function middleware(req: NextRequest, res: NextResponse) {
  let accessToken = req.cookies.get("accessToken")?.value;
  let refreshToken = req.cookies.get("refreshToken")?.value;
  console.log("진입 URL ==", req.url);
  // 엑세스 토큰이 존재할 경우
  if (accessToken != undefined) {
    const resp: any = await checkJWT(accessToken);
    console.log(resp);

    // 엑세스 토큰이 만료되었을 경우
    if (resp != undefined && resp.r == false) {
      console.log("엑세스 토큰이 만료되었습니다.");
      // 리프레쉬토큰 유효성 검사
      if (refreshToken != undefined) {
        const resp: any = await checkRefreshToken(refreshToken);

        if (resp.r === false) {
          // 재로그인 필요 (두 토큰 다 만료됨)
          console.log("리프레쉬 토큰이 만료되었습니다.", resp.errCode);
          if (resp.errCode === "ERR_JWT_EXPIRED") {
            const response = NextResponse.redirect(
              new URL("/login/login?deleteCookie=true", req.url)
            );
            response.cookies.set("accessToken", "", {
              expires: new Date(Date.now()),
            });
            response.cookies.set("refreshToken", "", {
              expires: new Date(Date.now()),
            });
            console.log("cookies!!", response.cookies);
            return response;
          }
        } else if (resp.r) {
          // 엑세스 토큰 재 발행
          console.log("엑세스 토큰 발행");
          const jwt = await refreshJWT(refreshToken);
          console.log("재발행 성공@@", jwt?.jwt?.accessToken);
          if (typeof jwt?.jwt?.accessToken == "string") {
            const accessToken: string = jwt?.jwt?.accessToken
              ? jwt?.jwt?.accessToken
              : "";
            const response = NextResponse.redirect(new URL(req.url));
            response.cookies.set("accessToken", accessToken);
            return response;
          } else {
            return NextResponse.redirect(
              new URL("/login/login?deleteCookie=true", req.url)
            );
          }
        }
      }
    } else {
      console.log("토큰 이상 없음.", resp);
      const response = NextResponse.next();
      response.cookies.set("uid", resp.uid);
      return response;
    }
  }
}

export const config = {
  matcher: [
    "/log/addLog:path*",
    "/spot/addSpot:path*",
    "/profile/profile",
    // "/login/login",
  ],
};

// export function middleware() {
//   console.log("hi");
// }
