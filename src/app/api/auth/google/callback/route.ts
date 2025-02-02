import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import connectToDatabase from "@/lib/mongoose";
import User, { IUser } from "@/models/user";
import { generateToken } from "@/lib/auth";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleUser: GoogleUser = userResponse.data;

    //Creates User
    await connectToDatabase();
    let user: IUser | null = await User.findOne({ email: googleUser.email });
    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        email: googleUser.email,
        userName: googleUser.name,
        picture: googleUser.picture,
        googleId: googleUser.id,
        password: "googleqscdefgjl",
      });
    }

    // Ensure user is not null
    if (!user) {
      throw new Error("User creation failed.");
    }

    const token = generateToken({ email: user?.email, id: user._id as string });
    // Generate JWT token

    const response = NextResponse.redirect(
      new URL("/dashboard", req.nextUrl.origin)
    );

    response.cookies.set("token", token);
    // response.cookies.set("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/",
    //   maxAge: 60 * 60, // 1 hour
    // });

    return response;
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Authentication failed", error });
    return new NextResponse("Authentication failed", { status: 500 });
  }
}
