import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/login", "/access-denied"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    // Public routes: never protect; allow login and access-denied to render
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // Protected routes: require auth, then run Advisor Guard
    if (isProtectedRoute(req)) {
      await auth.protect();

      // Advisor Guard: only after successful auth
      const session = await auth();
      const role =
        (session.sessionClaims as any)?.metadata?.role ??
        (session.sessionClaims as any)?.publicMetadata?.role;

      if (role !== "advisor") {
        const deniedUrl = new URL("/access-denied", req.url);
        return NextResponse.redirect(deniedUrl);
      }
    }

    return NextResponse.next();
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
