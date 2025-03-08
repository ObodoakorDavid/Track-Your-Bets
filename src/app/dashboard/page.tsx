import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BetTable from "./bets/BetTable";
import BetChart from "@/components/bet-chart";
import { getBets } from "../actions/bets";

export default async function DashboardPage() {
  const { bets } = await getBets({
    page: 1,
    withVoid: "true",
  });

  console.log({ bets });

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 w-full">
        <BetChart />
        <Card className="w-full block">
          <CardHeader>
            <CardTitle>Recent Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <BetTable bets={bets} />
          </CardContent>
        </Card>
      </div>
      <Card className="w-full block">
        <CardHeader>
          <CardTitle className="text-2xl">Recent Bets</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <BetTable bets={bets.slice(0, 10)} />
        </CardContent>
      </Card>
    </div>
  );
}
