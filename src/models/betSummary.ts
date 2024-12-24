import mongoose, { Document, Schema, Model } from "mongoose";
import { IBet } from "./bet";

export interface IBetSummary extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User model
  totalBets: number; // Total number of bets placed
  totalStake: number; // Sum of all stakes
  totalProfitLoss: number; // Net profit or loss
  voidedBets: number; // Number of voided bets
  wonBets: number; // Number of voided bets
  lostBets: number; // Number of voided bets
  lastUpdated: Date; // Timestamp of the last update
  updateSummary(bet: IBet): Promise<void>; // Update the summary based on a new or modified bet
  getMonthlySummary(
    userId: mongoose.Types.ObjectId,
    month: number,
    year: number
  ): Promise<IBetSummary[]>;
}

interface IBetSummaryModel extends Model<IBetSummary> {
  getSummary(userId: mongoose.Types.ObjectId): Promise<IBetSummary | null>;
}

const BetSummarySchema = new Schema<IBetSummary>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One summary per user
    },
    totalBets: {
      type: Number,
      default: 0,
    },
    totalStake: {
      type: Number,
      default: 0,
    },
    totalProfitLoss: {
      type: Number,
      default: 0,
    },
    voidedBets: {
      type: Number,
      default: 0,
    },
    wonBets: {
      type: Number,
      default: 0,
    },
    lostBets: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Method to update the summary based on a new or modified bet
BetSummarySchema.methods.updateSummary = async function (bet: IBet) {
  const isVoid = bet.outcome === "Void";
  const isWin = bet.outcome === "Win";
  const isLoss = bet.outcome === "Loss";
  const profitLossChange = bet.profitLoss || 0;

  // Update stats
  this.totalBets += 1;
  this.totalStake += bet.stake;
  this.totalProfitLoss += profitLossChange;
  if (isVoid) this.voidedBets += 1;
  if (isWin) this.wonBets += 1;
  if (isLoss) this.lostBets += 1;

  this.lastUpdated = new Date();
  await this.save();
};

// Static method to get the summary for a user
BetSummarySchema.statics.getSummary = async function (userId) {
  return this.findOne({ userId });
};

// Instance method to get the monthly summary for a user
BetSummarySchema.methods.getMonthlySummary = async function (
  month: number,
  year: number
): Promise<IBetSummary[]> {
  const startOfMonth = new Date(year, month - 1, 1); // First day of the month
  const endOfMonth = new Date(year, month, 0); // Last day of the month
  return BetSummary.find({
    userId: this.userId, // Use the userId from the instance
    lastUpdated: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });
};

// Model
const BetSummary =
  mongoose.models.BetSummary ||
  mongoose.model<IBetSummary, IBetSummaryModel>("BetSummary", BetSummarySchema);

export default BetSummary;
