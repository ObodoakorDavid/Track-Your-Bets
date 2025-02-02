import { NextResponse } from "next/server";

// import passport from "@/lib/googleAuth";

export async function GET() {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback&response_type=code&scope=openid%20profile%20email`;
  return NextResponse.redirect(new URL(redirectUrl));
  // res.redirect(redirectUrl);
  // passport.authenticate("google", {
  //   scope: ["profile", "email"],
  // })(req, res);
}
