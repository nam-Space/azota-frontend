import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot", "/forgotPassword"];

const IGNORE_PREFIXES = [
    "/_next",
    "/api",
    "/static",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/.well-known",
];

// Strip locale (vi | en)
function normalizePath(pathname: string) {
    return pathname.replace(/^\/(vi|en)(\/|$)/, "/") || "/";
}

export function middleware(req: NextRequest) {
    const token = req.cookies.get("refresh_token")?.value;
    const { pathname } = req.nextUrl;

    // ⛔ Ignore asset / internal
    if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const normalizedPath = normalizePath(pathname);

    const isPublicPage = PUBLIC_PATHS.some(
        (path) =>
            normalizedPath === path || normalizedPath.startsWith(path + "/")
    );

    // 🚫 Chưa login → redirect login
    if (!token && !isPublicPage) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // 🔐 Đã login → cấm auth pages
    if (token && isPublicPage) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};
