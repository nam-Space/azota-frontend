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

// 🔥 Strip locale an toàn (vi | en)
function normalizePath(pathname: string) {
    return pathname.replace(/^\/(vi|en)(\/|$)/, "/") || "/";
}

export function middleware(req: NextRequest) {
    const token = req.cookies.get("refresh_token")?.value;
    const { pathname } = req.nextUrl;

    // ⛔ Ignore internal / asset requests
    if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const normalizedPath = normalizePath(pathname);

    const isPublicPage = PUBLIC_PATHS.some(
        (path) =>
            normalizedPath === path || normalizedPath.startsWith(path + "/")
    );

    /**
     * 🚫 CHƯA LOGIN → redirect login (bao gồm '/')
     */
    if (!token && !isPublicPage) {
        const url = req.nextUrl.clone();
        url.pathname = "/login"; // ⛔ KHÔNG gắn locale
        return NextResponse.redirect(url);
    }

    /**
     * 🔐 ĐÃ LOGIN → không cho vào auth pages
     */
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
