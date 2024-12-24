import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next/types";
import { cookies } from "next/headers";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return new NextResponse("Logged out successfully", {
    status: 200,
    headers: {
      "Set-Cookie": `token=`,
    },
  });
}
