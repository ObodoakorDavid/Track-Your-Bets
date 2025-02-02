// models/Bet.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IBet extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User model
  date: Date;
  stake: number;
  odds: number;
  reducedOdds?: number;
  outcome: "Win" | "Loss" | "Pending" | "Void";
  profitLoss: number;
  betType: string;
  calculateProfitLoss(): number;
  adjustForVoid(newOdds: number): void;
  calculateStats(): Promise<{
    totalProfitLoss: 0;
    totalBets: 0;
    wonBets: 0;
    lostBets: 0;
    voidedBets: 0;
    totalStake: 0;
  }>;
}

interface IBetModel extends mongoose.Model<IBet> {
  countBets(includeVoided?: boolean): Promise<number>;
  calculateStats(
    includeVoided: boolean,
    userId: string,
    month: number,
    year: number
  ): Promise<{
    totalProfitLoss: 0;
    totalBets: 0;
    wonBets: 0;
    lostBets: 0;
    voidedBets: 0;
    totalStake: 0;
  }>;
}

const BetSchema = new Schema<IBet>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    stake: {
      type: Number,
      required: true,
    },
    odds: {
      type: Number,
      required: true,
    },
    reducedOdds: {
      type: Number,
      default: null,
    },
    outcome: {
      type: String,
      enum: ["Win", "Loss", "Pending", "Void"],
      required: true,
    },
    profitLoss: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate the profit or loss for the bet
BetSchema.methods.calculateProfitLoss = function () {
  const oddsToUse = this.reducedOdds ? this.reducedOdds : this.odds;
  if (this.outcome === "Win") {
    this.profitLoss = this.stake * oddsToUse - this.stake;
  } else if (this.outcome === "Loss") {
    this.profitLoss = -this.stake;
  } else if (this.outcome === "Void") {
    this.profitLoss = this.stake * oddsToUse - this.stake; // Void bets take into account the reducedOdds for the profitLoss
  } else {
    this.profitLoss = 0; // Pending bets have no profit/loss yet
  }
  return this.profitLoss;
};

BetSchema.statics.calculateStats = async function (
  includeVoided = true,
  userId,
  month: number,
  year: number
) {
  console.log({ includeVoided });

  const startDate = new Date(year, month - 1, 1); // Start of the month
  const endDate = new Date(year, month, 0, 23, 59, 59, 999); // End of the month

  const matchStage = {
    userId: mongoose.Types.ObjectId.createFromHexString(userId),
    date: { $gte: startDate, $lte: endDate },
    ...(includeVoided ? {} : { outcome: { $ne: "Void" } }),
  };

  const result = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalProfitLoss: { $sum: "$profitLoss" }, // Includes voided bets if includeVoided is true
        totalBets: { $sum: 1 },
        wonBets: {
          $sum: {
            $cond: [{ $eq: ["$outcome", "Win"] }, 1, 0],
          },
        },
        lostBets: {
          $sum: {
            $cond: [{ $eq: ["$outcome", "Loss"] }, 1, 0],
          },
        },
        voidedBets: {
          $sum: {
            $cond: [{ $eq: ["$outcome", "Void"] }, 1, 0],
          },
        },
        totalStake: { $sum: "$stake" },
      },
    },
  ]);

  // Return stats or default values if no records found
  return (
    result[0] || {
      totalProfitLoss: 0,
      totalBets: 0,
      wonBets: 0,
      lostBets: 0,
      voidedBets: 0,
      totalStake: 0,
    }
  );
};

// Middleware to update profit/loss before saving
BetSchema.pre("save", function (next) {
  this.calculateProfitLoss();
  next();
});

BetSchema.index({ outcome: 1 });

export default mongoose.model<IBet, IBetModel>("Bet", BetSchema);
