// Website Monitoring TypeScript Interfaces

export interface TrafficOverview {
  realTimeVisitors: number;
  pageViewsPerSession: number;
  totalSessionsToday: number;
  bounceRate: number;
  visitorsChange: string;
  sessionsChange: string;
  bounceRateChange: string;
}

export interface VisitorData {
  time: string;
  visitors: number;
}

export interface PageViewData {
  page: string;
  views: number;
  heat: "high" | "medium" | "low";
}

export interface UserJourneyPath {
  path: string[];
  users: number;
  completionRate: number;
}

export interface GeoData {
  country: string;
  users: number;
  percentage: number;
  flag: string;
}

export interface DeviceData {
  type: string;
  count: number;
  percentage: number;
  icon: string;
}

export interface BrowserData {
  name: string;
  count: number;
  percentage: number;
}

export interface TrafficSourceData {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

export interface BounceRateData {
  date: string;
  rate: number;
}

export interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export interface ErrorOverview {
  jsErrors: number;
  apiFailures: number;
  pageLoadFailures: number;
  networkErrors: number;
  totalErrors: number;
  errorRate: string;
}

export interface JSError {
  id: string;
  message: string;
  file: string;
  line: number;
  count: number;
  lastSeen: string;
  severity: "high" | "medium" | "low";
  stack: string;
}

export interface APIFailureData {
  endpoint: string;
  requests: number;
  failures: number;
  failureRate: number;
}

export interface NetworkErrorData {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ErrorTrendData {
  date: string;
  jsErrors: number;
  apiFailures: number;
  networkErrors: number;
}

export interface PerformanceMetrics {
  p50: number;
  p95: number;
  p99: number;
  tti: number;
  change: string;
}

export interface PageLoadPercentile {
  percentile: string;
  time: number;
  target: number;
  status: "good" | "warning" | "bad";
}

export interface CoreWebVital {
  value: number;
  target: number;
  status: "good" | "warning" | "bad";
  change: string;
}

export interface CoreWebVitalsData {
  lcp: CoreWebVital;
  fid: CoreWebVital;
  cls: CoreWebVital;
}

export interface APIResponseTimeData {
  endpoint: string;
  p50: number;
  p95: number;
  p99: number;
}
