import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Define protected and unprotected routes
const protectedRoutes = ["/dashboard"];
const unprotectedRoutes = ["/login", "/signup"]; // Add more unprotected routes as needed

export async function middleware(req: NextRequest) {
  const token = (await cookies()).get("token")?.value; // Assuming the token is stored in cookies

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET); 
      await jwtVerify(token, secret);
      return NextResponse.next(); 
    } catch (error) {
      console.log({ error });
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If the user is trying to access an unprotected route
  if (
    unprotectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        // Verify the JWT token
        await jwtVerify(token, secret);
        // Token is valid, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch (error) {
        console.log({ error });
        // Invalid token, allow access to the unprotected route
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next(); // Allow requests to other routes
}

// Apply middleware to all routes (catch-all matcher)
export const config = {
  matcher: "/:path*",
};
