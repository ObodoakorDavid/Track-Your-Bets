// import { NextResponse } from "next/server";
// import Bet from "../../../../models/bet";
// import BetSummary from "../../../../models/betSummary";
// import connectToDatabase from "../../../../lib/mongoose"; // Utility to connect to MongoDB

// // Update an existing bet
// export async function PUT(
//   request: Request,
//   { params }: { params: { betId: string } }
// ) {
//   await connectToDatabase();

//   try {
//     const { betId } = params;
//     const body = await request.json();
//     const { stake, odds, outcome } = body;

//     if (!stake && !odds && !outcome) {
//       return NextResponse.json(
//         {
//           error:
//             "At least one field (stake, odds, outcome) is required for update.",
//         },
//         { status: 400 }
//       );
//     }

//     // Find the bet
//     const bet = await Bet.findById(betId);
//     if (!bet) {
//       return NextResponse.json({ error: "Bet not found" }, { status: 404 });
//     }

//     // Revert the existing bet's impact on BetSummary
//     const summary = await BetSummary.findOne({ userId: bet.userId });
//     if (summary) {
//       summary.totalBets -= 1;
//       summary.totalStake -= bet.stake;
//       summary.totalProfitLoss -= bet.profitLoss || 0;
//       if (bet.outcome === "Void") summary.voidedBets -= 1;
//       await summary.save();
//     }

//     // Update the bet
//     if (stake !== undefined) bet.stake = stake;
//     if (odds !== undefined) bet.odds = odds;
//     if (outcome !== undefined) bet.outcome = outcome;
//     await bet.save();

//     // Update the summary with the new bet details
//     if (summary) {
//       await summary.updateSummary(bet);
//     }

//     return NextResponse.json(
//       { message: "Bet updated successfully", bet },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
