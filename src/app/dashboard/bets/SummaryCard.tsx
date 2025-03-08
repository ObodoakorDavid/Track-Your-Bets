import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FilterControls } from "./FilterControls";
import { SummaryStats } from "./SummaryStats";

interface Summary {
  totalBets: number;
  totalStake: number;
  totalProfitLoss: number;
  voidedBets: number;
  lostBets: number;
  wonBets: number;
  lastUpdated: string;
}

interface SummaryCardProps {
  summary: Summary;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <Card className="bg-white shadow-md rounded-lg mb-6 text-black">
      <CardHeader className="flex flex-col px-4 md:flex-row justify-between items-center my-4 space-y-4 md:space-y-0">
        <CardTitle className="text-2xl font-bold">Summary</CardTitle>
        <FilterControls />
      </CardHeader>
      <CardContent className="px-4">
        <SummaryStats summary={summary} />
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
