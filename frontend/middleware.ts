import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Перевіряємо наявність токену в HttpOnly cookies
    const token = request.cookies.get("token");
    const isAuthenticated = !!token;

    // Захищені маршрути
    const protectedPaths = ["/dashboard", "/profile", "/simulation"];
    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    // Redirect to home if not authenticated and trying to access protected page
    if (isProtectedPath && !isAuthenticated) {
        const url = new URL("/", request.url);
        url.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Redirect to dashboard if authenticated and trying to access auth pages
    const authPaths = ["/login", "/signup"];
    const isAuthPath = authPaths.includes(request.nextUrl.pathname);

    if (isAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};
