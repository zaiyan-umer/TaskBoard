import { NextRequest, NextResponse } from "next/server"

const PUBLIC_ROUTES = [
    "/auth/login",
    "/auth/register",
]

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Read token + role from cookies
    const token = req.cookies.get("token")?.value
    const role = req.cookies.get("role")?.value

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname.startsWith(route)
    )

    // Not logged in → protected route
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(
            new URL("/auth/login", req.url)
        )
    }
    // Logged-in user trying to access login/register
    if (token && isPublicRoute) {
        return NextResponse.redirect(
            new URL(role === "admin" ? "/dashboard" : "/", req.url)
        )
    }

    // Non-admin trying to access dashboard
    if (pathname.startsWith("/dashboard") && role !== "admin") {
        return NextResponse.redirect(
            new URL("/", req.url)
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
