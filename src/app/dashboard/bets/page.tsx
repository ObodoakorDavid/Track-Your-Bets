import BetHeader from "./BetHeader";
import BetTable from "./BetTable";
import SummaryCard from "./SummaryCard"; // Import the separate component
import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import Pagination from "@/components/Pagination";
import { cookies } from "next/headers";

interface BetPageProps {
  searchParams?: Promise<{
    page?: string;
    year?: string;
    month?: string;
    withVoid?: string;
  }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

async function getBets(payload: {
  page: number;
  month: number;
  year: number;
  withVoid: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { page, month, year, withVoid } = payload;

  const response = await fetch(
    `${baseUrl}/api/bets?page=${page}&month=${month}&year=${year}&withVoid=${withVoid}`,
    {
      headers: {
        Cookie: `token=${token};`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Oooops!");
  }
  const data = await response.json();
  return data;
}

export default async function BetsPage({ searchParams }: BetPageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const month = params?.month
    ? parseInt(params.month, 10)
    : new Date().getMonth() + 1;
  const year = params?.year
    ? parseInt(params.year, 10)
    : new Date().getFullYear();
  const withVoid = params?.withVoid || "true";

  const { bets, pagination, stats } = await getBets({
    page,
    month,
    year,
    withVoid,
  });

  return (
    <div className="text-black p-6">
      <SummaryCard summary={stats} />
      <div className="bg-white rounded-lg shadow-md p-3">
        <BetHeader />
        <Suspense fallback={<Loading />}>
          <BetTable bets={bets} />
        </Suspense>
        <Pagination
          totalPages={pagination?.totalPages}
          currentPage={pagination?.currentPage}
        />
      </div>
    </div>
  );
}
