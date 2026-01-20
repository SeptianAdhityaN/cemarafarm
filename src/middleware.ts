import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    const isAdminArea = pathname.startsWith("/settings") || 
                        pathname.startsWith("/api/varieties") || 
                        pathname.startsWith("/api/channels");

    if (isAdminArea && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard?error=AccessDenied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = { 
  matcher: [
    // Proteksi semua rute admin dan operasional
    "/dashboard/:path*",
    "/production/:path*",
    "/sales/:path*",
    "/settings/:path*",
    // Proteksi seluruh API internal
    "/api/production/:path*",
    "/api/sales/:path*",
    "/api/dashboard/:path*",
    "/api/varieties/:path*",
    "/api/channels/:path*",
  ] 
};