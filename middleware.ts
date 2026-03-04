import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      // 1. Require authentication (Clerk will handle redirect to sign-in)
      await auth.protect();

      // 2. Advisor Guard: only allow advisors based on metadata/claims
      const session = await auth();
      const role =
        (session.sessionClaims as any)?.metadata?.role ??
        (session.sessionClaims as any)?.publicMetadata?.role;

      if (role !== "advisor") {
        // Redirect non-advisors back to the primary referral tool
        return NextResponse.redirect(
          "https://nok-referral-program.vercel.app"
        );
      }
    }
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
