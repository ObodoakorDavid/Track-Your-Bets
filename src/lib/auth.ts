// lib/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { DecodedToken } from "./next";

export const verifyToken = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  console.log({ token });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
