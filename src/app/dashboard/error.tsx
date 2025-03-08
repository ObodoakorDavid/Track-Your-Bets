"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center py-12 min-h-screen">
      <h1 className="text-2xl">Something went wrong</h1>
      <p className="text-gray-700">
        {error?.message || "An unexpected error occurred."}
      </p>
      <Button onClick={() => reset()} className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
