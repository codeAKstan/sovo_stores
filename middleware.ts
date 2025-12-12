import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const enabled = ["true", "1", "on", "yes"].includes(
    String(process.env.MAINTENANCE_MODE || "").toLowerCase()
  )

  if (!enabled) return NextResponse.next()

  const pathname = request.nextUrl.pathname

  const allowed =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")

  if (allowed) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = "/maintenance"
  url.search = ""
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/(.*)"],
}

