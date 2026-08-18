import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    return JSON.parse(decoder.decode(bytes));
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Let admin login pass
  if (pathname === "/admin/login") {
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Let college login pass
  if (pathname === "/college/login") {
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && payload.role === "college") {
        return NextResponse.redirect(new URL("/college", request.url));
      }
    }
    return NextResponse.next();
  }

  // Route: Admin Dashboard Guard
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const payload = decodeJwtPayload(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
    }
  }

  // Route: College Dashboard Guard
  if (pathname.startsWith("/college") && pathname !== "/college/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/college/login", request.url));
    }
    const payload = decodeJwtPayload(token);
    if (!payload || payload.role !== "college") {
      return NextResponse.redirect(new URL("/college/login?error=unauthorized", request.url));
    }
  }

  // Route: Student Dashboard Guard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = decodeJwtPayload(token);
    if (payload) {
      if (payload.role === "college") {
        return NextResponse.redirect(new URL("/college", request.url));
      }
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/college/:path*", "/dashboard/:path*"],
};