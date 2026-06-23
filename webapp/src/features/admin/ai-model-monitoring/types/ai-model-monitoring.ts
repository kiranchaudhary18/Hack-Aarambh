// AI Model Monitoring TypeScript Interfaces

export interface ModelAccuracy {
  accuracyRate: number;
  truePositives: number;
  trueNegatives: number;
  totalPredictions: number;
  change: string;
}

export interface FalsePositiveRate {
  rate: number;
  falsePositives: number;
  safeJobsMarked: number;
  change: string;
}

export interface FalseNegativeRate {
  rate: number;
  falseNegatives: number;
  scamsMarkedSafe: number;
  change: string;
}

export interface ConfidenceBucket {
  range: string;
  count: number;
  percentage: number;
  accuracy: number;
}

export interface ConfidenceDistribution {
  buckets: ConfidenceBucket[];
  averageConfidence: number;
}

export interface PredictionDriftData {
  date: string;
  accuracy: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
}

export interface InferenceLatency {
  p50: number;
  p95: number;
  p99: number;
  change: string;
}

export interface ThroughputData {
  time: string;
  rps: number;
}

export interface ResponseTimeByType {
  type: string;
  p50: number;
  p95: number;
  p99: number;
  color: string;
}

export interface QueueDepthData {
  time: string;
  queueSize: number;
  processingRate: number;
}

export interface ProcessingTimeData {
  inputSize: string;
  avgTime: number;
  p95: number;
}

export interface GPUUtilization {
  current: number;
  average: number;
  peak: number;
  change: string;
}

export interface MemoryUsage {
  current: number;
  average: number;
  peak: number;
  perRequest: number;
  change: string;
}

export interface TokenUsageData {
  date: string;
  tokens: number;
  cost: number;
}

export interface CostBreakdown {
  category: string;
  daily: number;
  monthly: number;
  percentage: number;
  color: string;
}

export interface ModelVersion {
  version: string;
  deployedDate: string;
  accuracy: number;
  status: "active" | "deprecated" | "testing";
}

export interface DataDriftMetric {
  feature: string;
  driftScore: number;
  status: "normal" | "warning" | "critical";
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  change: string;
}

export interface RetrainingTrigger {
  trigger: string;
  status: "active" | "inactive" | "triggered";
  lastChecked: string;
  threshold: string;
  currentValue: string;
}
