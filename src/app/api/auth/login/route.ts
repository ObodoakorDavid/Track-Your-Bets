// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import User, { IUser } from "../../../../models/user";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new NextResponse("Email and password are required", { status: 400 });
  }

  try {
    await connectToDatabase();

    // Find user by email
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
