"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SummaryProps {
  summary: {
    totalBets: number;
    totalStake: number;
    totalProfitLoss: number;
    voidedBets: number;
    lostBets: number;
    wonBets: number;
    lastUpdated: string;
  };
}

const SummaryCard: React.FC<SummaryProps> = ({ summary }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract or calculate default month and year
  const defaultMonth =
    searchParams.get("month") ||
    (new Date().getMonth() + 1).toString().padStart(2, "0");
  const defaultYear =
    searchParams.get("year") || new Date().getFullYear().toString();
  const defaultWithVoid = searchParams.get("withVoid") === "true";

  const [month, setMonth] = useState<string>(defaultMonth);
  const [year, setYear] = useState<string>(defaultYear);
  const [withVoid, setWithVoid] = useState<boolean>(defaultWithVoid);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get("month")) params.set("month", defaultMonth);
    if (!params.get("year")) params.set("year", defaultYear);
    if (!params.get("withVoid"))
      params.set("withVoid", defaultWithVoid.toString());

    router.replace(`${window.location.pathname}?${params.toString()}`);
  }, [router, defaultMonth, defaultWithVoid, defaultYear]);

  const handleMonthChange = (value: string) => {
    setMonth(value);
    const params = new URLSearchParams(window.location.search);
    params.set("month", value);
    params.set("year", year);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    const params = new URLSearchParams(window.location.search);
    params.set("month", month);
    params.set("year", value);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const handleWithVoidToggle = (value: boolean) => {
    setWithVoid(value);
    console.log(value);

    const params = new URLSearchParams(window.location.search);
    params.set("month", month);
    params.set("year", year);
    params.set("withVoid", value.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Calculate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1].map((y) =>
    y.toString()
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 text-black">
      <div className="flex flex-col md:flex-row justify-between items-center my-4">
        <h2 className="text-2xl font-bold">Summary</h2>
        <div className="mt-2 flex flex-wrap gap-2 items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm min-w-max">
              {withVoid ? "With Void" : "Without Void"}
            </span>
            <Switch
              className=""
              checked={withVoid}
              onCheckedChange={handleWithVoidToggle}
            />
          </div>
          <div>
            <Select onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Months</SelectLabel>
                  <SelectItem value="01">January</SelectItem>
                  <SelectItem value="02">February</SelectItem>
                  <SelectItem value="03">March</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">May</SelectItem>
                  <SelectItem value="06">June</SelectItem>
                  <SelectItem value="07">July</SelectItem>
                  <SelectItem value="08">August</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select onValueChange={handleYearChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Years</SelectLabel>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="border rounded p-3">
          <span className="font-medium">Total Bets:</span> {summary?.totalBets}
        </div>
        <div className="border rounded p-3">
          <span className="font-medium">Total Stake:</span> ₦
          {summary?.totalStake.toLocaleString()}
        </div>
        <div className="border rounded p-3">
          <span className="font-medium">Total Profit/Loss:</span> ₦
          {summary?.totalProfitLoss.toLocaleString()}
        </div>
        <div className="border rounded p-3">
          <span className="font-medium">Voided Bets:</span>{" "}
          {summary?.voidedBets}
        </div>
        <div className="border rounded p-3">
          <span className="font-medium">Lost Bets:</span> {summary?.lostBets}
        </div>
        <div className="border rounded p-3">
          <span className="font-medium">Won Bets:</span> {summary?.wonBets}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
