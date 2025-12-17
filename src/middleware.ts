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

export function middleware(req: NextRequest) {
    const token = req.cookies.get("refresh_token")?.value;
    const { pathname, locale } = req.nextUrl;

    // ⛔ Ignore internal / asset requests
    if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // 🔄 Normalize path (remove locale safely)
    const localePrefix = locale ? `/${locale}` : "";
    const normalizedPath =
        locale && pathname.startsWith(localePrefix)
            ? pathname.slice(localePrefix.length) || "/"
            : pathname;

    const isPublicPage = PUBLIC_PATHS.some(
        (path) =>
            normalizedPath === path || normalizedPath.startsWith(path + "/")
    );

    // 🚫 Not login → redirect login (bao gồm '/')
    if (!token && !isPublicPage) {
        const url = req.nextUrl.clone();
        url.pathname = locale ? `/${locale}/login` : "/login";
        return NextResponse.redirect(url);
    }

    // 🔐 Logged in → block auth pages
    if (token && isPublicPage) {
        const url = req.nextUrl.clone();
        url.pathname = locale ? `/${locale}` : "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};
