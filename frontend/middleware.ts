import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")
  const userLocalStorage = typeof window !== "undefined" ? localStorage.getItem("user") : null

  const isAuthenticated = user || userLocalStorage

  // Redirect protected pages if not logged in
  if (
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/profile") ||
      request.nextUrl.pathname.startsWith("/simulation")) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if already logged in and accessing auth pages
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|public).*)"],
}
