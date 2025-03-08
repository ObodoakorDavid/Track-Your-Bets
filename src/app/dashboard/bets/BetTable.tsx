import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface Bet {
  _id: string;
  stake: number;
  odds: number;
  outcome: "Win" | "Loss" | "Void";
  reducedOdds?: number;
}

interface BetTableProps {
  bets: Bet[];
}

const BetTable: React.FC<BetTableProps> = ({ bets }) => {
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

  if (!bets || bets.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No bets found.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 text-black overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stake</TableHead>
            <TableHead>Odds</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Reduced Odds</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet) => (
            <TableRow key={bet._id}>
              <TableCell>{bet.stake}</TableCell>
              <TableCell>{bet.odds}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${getBadgeColor(
                    bet.outcome
                  )}`}
                >
                  {bet.outcome}
                </span>
              </TableCell>
              <TableCell>{bet.reducedOdds ?? "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BetTable;
