import {
  AlertThreshold,
  ScamDetectionRate,
  APILatencySpike,
  ServerCPU,
  MemoryUsage,
  ConnectionPoolStatus,
  ExtensionErrorRate,
  ModelAccuracy,
} from "../types/real-time-monitoring";

export const alertThresholds: AlertThreshold[] = [
  { metric: "Scam Detection Rate", threshold: 15, currentValue: 18.5, status: "warning", lastTriggered: "2 minutes ago" },
  { metric: "API Latency", threshold: 500, currentValue: 520, status: "warning", lastTriggered: "5 minutes ago" },
  { metric: "Server CPU", threshold: 80, currentValue: 85, status: "warning", lastTriggered: "1 minute ago" },
  { metric: "Memory Usage", threshold: 90, currentValue: 92, status: "critical", lastTriggered: "30 seconds ago" },
  { metric: "Connection Pool", threshold: 90, currentValue: 95, status: "critical", lastTriggered: "2 minutes ago" },
  { metric: "Extension Error Rate", threshold: 5, currentValue: 6.2, status: "warning", lastTriggered: "10 minutes ago" },
  { metric: "Model Accuracy", threshold: 85, currentValue: 82, status: "warning", lastTriggered: "15 minutes ago" },
];

export const scamDetectionRate: ScamDetectionRate = {
  currentRate: 18.5,
  threshold: 15,
  trend: 2.3,
  lastUpdated: "2 minutes ago",
};

export const apiLatencySpike: APILatencySpike[] = [
  { endpoint: "/api/scan", currentLatency: 520, threshold: 500, status: "warning" },
  { endpoint: "/api/history", currentLatency: 480, threshold: 500, status: "normal" },
  { endpoint: "/api/report", currentLatency: 620, threshold: 500, status: "critical" },
  { endpoint: "/api/user", currentLatency: 450, threshold: 500, status: "normal" },
];

export const serverCPU: ServerCPU = {
  current: 85,
  threshold: 80,
  status: "warning",
};

export const memoryUsage: MemoryUsage = {
  current: 92,
  threshold: 90,
  status: "critical",
};

export const connectionPoolStatus: ConnectionPoolStatus = {
  active: 95,
  max: 100,
  threshold: 90,
  status: "critical",
};

export const extensionErrorRate: ExtensionErrorRate = {
  currentRate: 6.2,
  threshold: 5,
  status: "warning",
};

export const modelAccuracy: ModelAccuracy = {
  currentAccuracy: 82,
  threshold: 85,
  status: "warning",
};
