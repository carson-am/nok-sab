import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/login", "/access-denied"]);

export default clerkMiddleware(
  async (auth, req) => {
    // Public routes: allow login and access-denied to render without auth
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // All other routes: require auth
    await auth.protect();

    // Advisor Guard: only allow advisors based on metadata/claims
    const session = await auth();
    const role =
      (session.sessionClaims as any)?.metadata?.role ??
      (session.sessionClaims as any)?.publicMetadata?.role;

    if (role !== "advisor") {
      // Redirect non-advisors back to the primary referral tool
      return NextResponse.redirect("https://nok-referral-program.vercel.app");
    }

    return NextResponse.next();
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
