import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongoose";
import User from "../../../../models/user";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { userName, email, password } = await req.json(); // Get user input

  console.log("Received data:", { email, password });

  // Check if email or password is missing
  if (!email || !password) {
    return new NextResponse("Email and password are required", { status: 400 });
  }

  try {
    // Check if user already exists
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 });
    }

    // Create new user
    const newUser = await User.create({ userName, email, password });

    // Generate JWT token
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } 
    );

    // Prepare the response
    const response = new NextResponse("User created successfully", {
      status: 201,
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict", // Can be adjusted based on needs
      path: "/",
      maxAge: 60 * 60, // 1 hour, should match JWT expiry
    });

    return response;
  } catch (error: any) {
    console.error("Error creating user:", error.message || error);
    if (error.errors) {
      console.error("Validation Errors:", error.errors); // Log Mongoose validation errors
    }
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
