import React from "react";
import { calculateROI, cn } from "@/lib/utils";

interface Summary {
  totalBets: number;
  totalStake: number;
  totalProfitLoss: number;
  voidedBets: number;
  lostBets: number;
  wonBets: number;
  lastUpdated: string;
}

interface SummaryStatsProps {
  summary: Summary;
}

interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  const isProfitLoss = label.toLowerCase().includes("profit");
  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d.-]/g, ""))
      : Number(value);

  return (
    <div
      className={cn(
        "border rounded p-3",
        isProfitLoss && numericValue < 0 ? "border-red-300" : "",
        isProfitLoss && numericValue >= 0 ? "border-green-300" : ""
      )}
    >
      <span className="font-medium">{label}:</span> {value}
    </div>
  );
};

export const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => {
  const stats = [
    { label: "Total Bets", value: summary.totalBets },
    { label: "Total Stake", value: `₦${summary.totalStake.toLocaleString()}` },
    {
      label: "Total Profit/Loss",
      value: `₦${summary.totalProfitLoss.toLocaleString()}`,
    },
    {
      label: "ROI",
      value: `${calculateROI(summary.totalStake, summary.totalProfitLoss)}%`,
    },
    { label: "Voided Bets", value: summary.voidedBets },
    { label: "Lost Bets", value: summary.lostBets },
    { label: "Won Bets", value: summary.wonBets },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};
