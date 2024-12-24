import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-100">
      <h1 className="font-semibold">Track It </h1>
      <Button variant="outline">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
