import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up", 
  "/events/:id",
  "/api/webhook/clerk",
  "/api/uploadthing",
])

export default clerkMiddleware((auth, req) => {
  console.log("Request URL:", req.url); // Log to inspect
  const { userId } = auth();

  if (isPublicRoute(req)) {
    return; // Allow public routes without authentication
  }

  if (!userId) {
    return new Response("Unauthorized", {
      status: 302,
      headers: {
        Location: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
      },
    });
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};