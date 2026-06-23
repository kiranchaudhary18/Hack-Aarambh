import { PerformanceMetrics, PageLoadPercentile, CoreWebVitalsData, APIResponseTimeData } from "../types/website-monitoring";

export const performanceMetrics: PerformanceMetrics = {
  p50: 1.2,
  p95: 2.8,
  p99: 4.1,
  tti: 1.8,
  change: "-5.2%",
};

export const pageLoadPercentiles: PageLoadPercentile[] = [
  { percentile: "p50", time: 1.2, target: 1.5, status: "good" },
  { percentile: "p75", time: 1.8, target: 2.0, status: "good" },
  { percentile: "p90", time: 2.4, target: 2.5, status: "good" },
  { percentile: "p95", time: 2.8, target: 3.0, status: "good" },
  { percentile: "p99", time: 4.1, target: 4.0, status: "warning" },
];

export const coreWebVitals: CoreWebVitalsData = {
  lcp: { value: 1.8, target: 2.5, status: "good", change: "-8%" },
  fid: { value: 45, target: 100, status: "good", change: "-12%" },
  cls: { value: 0.08, target: 0.1, status: "good", change: "-5%" },
};

export const apiResponseTimeData: APIResponseTimeData[] = [
  { endpoint: "/api/scan", p50: 234, p95: 456, p99: 789 },
  { endpoint: "/api/analytics", p50: 123, p95: 234, p99: 456 },
  { endpoint: "/api/history", p50: 89, p95: 156, p99: 234 },
  { endpoint: "/api/auth/login", p50: 456, p95: 789, p99: 1234 },
];
