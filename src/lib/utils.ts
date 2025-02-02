import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateROI(stake: number, profitLoss: number) {
  const result = (profitLoss / stake) * 100;
  if (isNaN(result)) {
    return 0;
  }

  const stringResult = String(result);
  const finalResult = stringResult.startsWith("-")
    ? stringResult.slice(0, 6)
    : stringResult.slice(0, 5);

  return finalResult;
}
