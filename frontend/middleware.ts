import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/simulation"];
const AUTH_PATHS = ["/login", "/signup"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token");
    const isAuthenticated = !!token;

    const { pathname } = request.nextUrl;
    const isProtectedPath = PROTECTED_PATHS.some((path) =>
        pathname.startsWith(path)
    );
    const isAuthPath = AUTH_PATHS.includes(pathname);

    if (isProtectedPath && !isAuthenticated) {
        const url = new URL("/", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    if (isAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
