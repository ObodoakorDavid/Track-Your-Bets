import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongoose";
import User, { IUser } from "../../../models/user";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    const user: IUser | null = await User.findById(decodedToken.id).select(
      "-password"
    );

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT error:", error.message);
      return new NextResponse("Invalid token", { status: 401 });
    }

    if (error instanceof Error) {
      console.error("Error fetching user:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return new NextResponse("Something went wrong", { status: 500 });
  }
}
