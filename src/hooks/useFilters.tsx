import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract or calculate default values
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

  const updateFilters = (updates: {
    month?: string;
    year?: string;
    withVoid?: boolean;
  }) => {
    const params = new URLSearchParams(window.location.search);

    if (updates.month) {
      setMonth(updates.month);
      params.set("month", updates.month);
    }

    if (updates.year) {
      setYear(updates.year);
      params.set("year", updates.year);
    }

    if (updates.withVoid !== undefined) {
      setWithVoid(updates.withVoid);
      params.set("withVoid", updates.withVoid.toString());
    }

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Calculate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1].map((y) =>
    y.toString()
  );

  return {
    filters: { month, year, withVoid },
    yearOptions,
    updateFilters,
  };
};
