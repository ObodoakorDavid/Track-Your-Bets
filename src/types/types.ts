export interface IFormInput {
  stake: number;
  odds: number;
  outcome: "Win" | "Loss" | "Void";
  reducedOdds?: number;
}
