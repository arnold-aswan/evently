import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/sign-in",
//   "/sign-up", 
//   "/events/:id",
//   "/api/webhook/clerk",
//   "/api/uploadthing",
// ])

// Define the private routes
const isPrivateRoute = createRouteMatcher([
  "/dashboard",       
  "/profile",         
  "/events/create",  
]);

export default clerkMiddleware((auth, req) => {
  console.log("Request URL:", req.url); // Log to inspect
  const { userId } = auth();

  if (isPrivateRoute(req)) {
    if (!userId) {
      // Redirect to sign-in if not authenticated
      return new Response("Unauthorized", {
        status: 302,
        headers: {
          Location: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
        },
      });
    }
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