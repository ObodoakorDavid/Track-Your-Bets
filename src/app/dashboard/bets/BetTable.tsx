import React from "react";

interface Bet {
  stake: number;
  odds: number;
  outcome: "Win" | "Loss" | "Void";
  reducedOdds?: number;
}

interface BetTableProps {
  bets: Bet[];
}

const BetTable: React.FC<BetTableProps> = ({ bets }) => {
  // Function to get badge color based on outcome
  const getBadgeColor = (outcome: "Win" | "Loss" | "Void") => {
    switch (outcome) {
      case "Win":
        return "bg-green-200 text-green-800";
      case "Loss":
        return "bg-red-200 text-red-800";
      case "Void":
        return "bg-gray-200 text-gray-800";
      default:
        return "";
    }
  };

  return (
    <div className="mt-6 text-black overflow-x-scroll">
      <div className="border">
        {/* Header */}
        <div className="min-w-full grid grid-cols-4 border-b-2">
          <span className="px-4 py-2 text-left border-r-2">Stake</span>
          <span className="px-4 py-2 text-left border-r-2">Odds</span>
          <span className="px-4 py-2 text-left border-r-2">Outcome</span>
          <span className="px-4 py-2 text-left">Reduced Odds</span>
        </div>
        {/* Rows */}
        {bets?.map((bet, index) => (
          <React.Fragment key={index}>
            <div className="grid grid-cols-4 min-w-full border-b-2">
              <span className="px-4 py-2 border-r-2">{bet.stake}</span>
              <span className="px-4 py-2 border-r-2">{bet.odds}</span>
              <span className="px-4 py-2 border-r-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${getBadgeColor(
                    bet.outcome
                  )}`}
                >
                  {bet.outcome}
                </span>
              </span>
              <span className="px-4 py-2">{bet.reducedOdds || "N/A"}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BetTable;
