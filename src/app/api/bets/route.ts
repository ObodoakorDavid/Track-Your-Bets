import { NextResponse } from "next/server";
import Bet, { IBet } from "@/models/bet";
import BetSummary, { IBetSummary } from "@/models/betSummary";
import connectToDatabase from "@/lib/mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Utility to verify JWT and extract user ID
const getUserIdFromToken = async (): Promise<string | null> => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded?.id || null;
  } catch {
    return null;
  }
};

// Utility to calculate date range for a given month and year
const getDateRange = (month: number, year: number) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);
  return { $gte: startOfMonth, $lte: endOfMonth };
};

export async function GET(request: Request) {
  await connectToDatabase();

  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const outcome = searchParams.get("outcome");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const withVoid = searchParams.get("withVoid");

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, any> = { userId };
    if (outcome) query.outcome = outcome;
    if (month && year) {
      query.date = getDateRange(parseInt(month, 10), parseInt(year, 10));
    }

    console.log({ searchParams });

    // Fetch bets and count for pagination
    const [bets, totalBets] = await Promise.all([
      Bet.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Bet.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalBets / limit);

    let summary: IBetSummary | null = await BetSummary.findOne({ userId });

    if (!summary) {
      summary = await BetSummary.create({ userId });
    }

    let stats;

    if (month && year) {
      stats = await Bet.calculateStats(
        withVoid === "true",
        Number(month),
        Number(year)
      );
    }

    return NextResponse.json({
      bets,
      summary,
      stats,
      pagination: {
        currentPage: page,
        totalPages,
        totalBets,
        pageSize: bets.length,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { stake, odds, outcome, reducedOdds } = body;

    if (!stake || !odds || !outcome) {
      return NextResponse.json(
        { error: "All fields (stake, odds, outcome) are required." },
        { status: 400 }
      );
    }

    if (outcome === "Void" && !reducedOdds) {
      return NextResponse.json(
        { error: "Reduced odds are required when outcome is Void" },
        { status: 400 }
      );
    }

    // Create and save the new bet
    const newBet: IBet = new Bet({
      userId,
      stake,
      odds,
      outcome,
      reducedOdds: outcome === "Void" ? reducedOdds : undefined,
      date: Date.now(),
    });

    await newBet.save();

    // Update or create BetSummary for the user
    let summary: IBetSummary | null = await BetSummary.findOne({ userId });
    if (!summary) {
      summary = new BetSummary({ userId });
    }
    await summary?.updateSummary(newBet);

    return NextResponse.json(
      { message: "Bet added successfully", newBet },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
