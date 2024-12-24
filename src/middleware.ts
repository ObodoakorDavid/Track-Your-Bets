import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Define protected routes
const protectedRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const token = (await cookies()).get("token")?.value; // Assuming the token is stored in cookies

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check if the route is protected
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Ensure this is the secret key for JWT signing
      // Verify the JWT token
      await jwtVerify(token, secret);
      return NextResponse.next(); // Token is valid, proceed with the request
    } catch (error) {
      console.log({ error });
      return NextResponse.redirect(new URL("/login", req.url)); // Invalid token, redirect to login
    }
  }

  return NextResponse.next();
}

// Apply middleware only to specific paths
export const config = {
  matcher: ["/dashboard/:path*"],
};
