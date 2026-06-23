// Extension Monitoring TypeScript Interfaces

// Installation Metrics
export interface TotalInstalls {
  chrome: number;
  firefox: number;
  total: number;
  change: string;
}

export interface InstallSource {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

export interface InstallTrend {
  date: string;
  installs: number;
  uninstalls: number;
}

export interface UninstallReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface VersionDistribution {
  version: string;
  count: number;
  percentage: number;
  status: "stable" | "beta" | "deprecated";
}

// Usage Metrics
export interface ActiveUsers {
  dau: number;
  wau: number;
  mau: number;
  dauChange: string;
  wauChange: string;
  mauChange: string;
}

export interface SessionDuration {
  avgDuration: number;
  medianDuration: number;
  change: string;
}

export interface FeatureUsage {
  feature: string;
  usage: number;
  change: string;
}

export interface ToolbarClicks {
  date: string;
  clicks: number;
}

export interface ContextMenuUsage {
  action: string;
  count: number;
  percentage: number;
}

// Retention Metrics
export interface RetentionRate {
  d1: number;
  d7: number;
  d30: number;
}

export interface CohortData {
  cohortDate: string;
  d1Retention: number;
  d7Retention: number;
  d30Retention: number;
  users: number;
}

export interface ChurnRate {
  daily: number;
  weekly: number;
  monthly: number;
  change: string;
}

export interface ReturnFrequency {
  once: number;
  weekly: number;
  monthly: number;
  daily: number;
}

// Error Monitoring
export interface ExtensionCrash {
  browser: string;
  version: string;
  crashes: number;
  users: number;
}

export interface APIFailure {
  endpoint: string;
  failures: number;
  errorRate: number;
}

export interface PermissionError {
  permission: string;
  errors: number;
  users: number;
}

export interface ContentScriptError {
  domain: string;
  errors: number;
  type: string;
}

export interface BackgroundWorkerError {
  error: string;
  count: number;
  lastSeen: string;
}

// Performance
export interface ExtensionLoadTime {
  avg: number;
  p50: number;
  p95: number;
  p99: number;
  change: string;
}

export interface MemoryUsage {
  avg: number;
  peak: number;
  perInstance: number;
  change: string;
}

export interface ScanCompletionTime {
  avg: number;
  p50: number;
  p95: number;
  change: string;
}

export interface OCRProcessingTime {
  avg: number;
  p50: number;
  p95: number;
  change: string;
}
