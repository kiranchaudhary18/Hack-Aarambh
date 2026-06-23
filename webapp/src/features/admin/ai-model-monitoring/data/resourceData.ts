import { GPUUtilization, MemoryUsage, TokenUsageData, CostBreakdown } from "../types/ai-model-monitoring";

export const gpuUtilization: GPUUtilization = {
  current: 72,
  average: 68,
  peak: 89,
  change: "+5.2%",
};

export const memoryUsage: MemoryUsage = {
  current: 14.2,
  average: 13.5,
  peak: 18.7,
  perRequest: 0.8,
  change: "+3.1%",
};

export const tokenUsageData: TokenUsageData[] = [
  { date: "Jan 1", tokens: 245000, cost: 12.25 },
  { date: "Jan 2", tokens: 267000, cost: 13.35 },
  { date: "Jan 3", tokens: 234000, cost: 11.70 },
  { date: "Jan 4", tokens: 289000, cost: 14.45 },
  { date: "Jan 5", tokens: 312000, cost: 15.60 },
  { date: "Jan 6", tokens: 298000, cost: 14.90 },
  { date: "Jan 7", tokens: 276000, cost: 13.80 },
  { date: "Jan 8", tokens: 321000, cost: 16.05 },
  { date: "Jan 9", tokens: 345000, cost: 17.25 },
  { date: "Jan 10", tokens: 367000, cost: 18.35 },
  { date: "Jan 11", tokens: 354000, cost: 17.70 },
  { date: "Jan 12", tokens: 389000, cost: 19.45 },
  { date: "Jan 13", tokens: 412000, cost: 20.60 },
  { date: "Jan 14", tokens: 398000, cost: 19.90 },
  { date: "Jan 15", tokens: 423000, cost: 21.15 },
  { date: "Jan 16", tokens: 445000, cost: 22.25 },
  { date: "Jan 17", tokens: 432000, cost: 21.60 },
  { date: "Jan 18", tokens: 467000, cost: 23.35 },
  { date: "Jan 19", tokens: 489000, cost: 24.45 },
  { date: "Jan 20", tokens: 476000, cost: 23.80 },
  { date: "Jan 21", tokens: 501000, cost: 25.05 },
  { date: "Jan 22", tokens: 523000, cost: 26.15 },
  { date: "Jan 23", tokens: 510000, cost: 25.50 },
  { date: "Jan 24", tokens: 545000, cost: 27.25 },
  { date: "Jan 25", tokens: 567000, cost: 28.35 },
  { date: "Jan 26", tokens: 554000, cost: 27.70 },
  { date: "Jan 27", tokens: 589000, cost: 29.45 },
  { date: "Jan 28", tokens: 612000, cost: 30.60 },
  { date: "Jan 29", tokens: 598000, cost: 29.90 },
  { date: "Jan 30", tokens: 623000, cost: 31.15 },
];

export const costBreakdown: CostBreakdown[] = [
  { category: "LLM API", daily: 31.15, monthly: 934.5, percentage: 65, color: "var(--clay-purple)" },
  { category: "GPU Compute", daily: 12.50, monthly: 375.0, percentage: 26, color: "var(--clay-blue)" },
  { category: "Storage", daily: 2.80, monthly: 84.0, percentage: 6, color: "var(--clay-green)" },
  { category: "Network", daily: 1.55, monthly: 46.5, percentage: 3, color: "var(--clay-pink)" },
];
