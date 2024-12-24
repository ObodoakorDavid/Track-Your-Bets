// components/BetTable.tsx
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
    <div className="mt-6 text-black">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border border-gray-300">
              Stake
            </th>
            <th className="px-4 py-2 text-left border border-gray-300">Odds</th>
            <th className="px-4 py-2 text-left border border-gray-300">
              Outcome
            </th>
            <th className="px-4 py-2 text-left border border-gray-300">
              Reduced Odds
            </th>
          </tr>
        </thead>
        <tbody>
          {bets?.map((bet, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border border-gray-300">{bet.stake}</td>
              <td className="px-4 py-2 border border-gray-300">{bet.odds}</td>
              <td className="px-4 py-2 border border-gray-300">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${getBadgeColor(
                    bet.outcome
                  )}`}
                >
                  {bet.outcome}
                </span>
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {bet.reducedOdds ? bet.reducedOdds : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BetTable;
