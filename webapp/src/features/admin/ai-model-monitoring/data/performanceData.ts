import {
  InferenceLatency,
  ThroughputData,
  ResponseTimeByType,
  QueueDepthData,
  ProcessingTimeData,
} from "../types/ai-model-monitoring";

export const inferenceLatency: InferenceLatency = {
  p50: 245,
  p95: 512,
  p99: 892,
  change: "-8.5%",
};

export const throughputData: ThroughputData[] = [
  { time: "00:00", rps: 12 },
  { time: "01:00", rps: 8 },
  { time: "02:00", rps: 5 },
  { time: "03:00", rps: 4 },
  { time: "04:00", rps: 3 },
  { time: "05:00", rps: 6 },
  { time: "06:00", rps: 12 },
  { time: "07:00", rps: 23 },
  { time: "08:00", rps: 45 },
  { time: "09:00", rps: 67 },
  { time: "10:00", rps: 89 },
  { time: "11:00", rps: 102 },
  { time: "12:00", rps: 98 },
  { time: "13:00", rps: 95 },
  { time: "14:00", rps: 92 },
  { time: "15:00", rps: 96 },
  { time: "16:00", rps: 99 },
  { time: "17:00", rps: 87 },
  { time: "18:00", rps: 76 },
  { time: "19:00", rps: 65 },
  { time: "20:00", rps: 54 },
  { time: "21:00", rps: 43 },
  { time: "22:00", rps: 32 },
  { time: "23:00", rps: 18 },
];

export const responseTimeByType: ResponseTimeByType[] = [
  { type: "Text Analysis", p50: 180, p95: 380, p99: 650, color: "oklch(0.72 0.16 155)" },
  { type: "PDF Analysis", p50: 320, p95: 680, p99: 1120, color: "oklch(0.62 0.18 295)" },
  { type: "Image Analysis", p50: 450, p95: 920, p99: 1450, color: "oklch(0.66 0.22 22)" },
];

export const queueDepthData: QueueDepthData[] = [
  { time: "00:00", queueSize: 5, processingRate: 12 },
  { time: "01:00", queueSize: 3, processingRate: 8 },
  { time: "02:00", queueSize: 2, processingRate: 5 },
  { time: "03:00", queueSize: 1, processingRate: 4 },
  { time: "04:00", queueSize: 0, processingRate: 3 },
  { time: "05:00", queueSize: 2, processingRate: 6 },
  { time: "06:00", queueSize: 5, processingRate: 12 },
  { time: "07:00", queueSize: 12, processingRate: 23 },
  { time: "08:00", queueSize: 23, processingRate: 45 },
  { time: "09:00", queueSize: 34, processingRate: 67 },
  { time: "10:00", queueSize: 45, processingRate: 89 },
  { time: "11:00", queueSize: 52, processingRate: 102 },
  { time: "12:00", queueSize: 48, processingRate: 98 },
  { time: "13:00", queueSize: 45, processingRate: 95 },
  { time: "14:00", queueSize: 42, processingRate: 92 },
  { time: "15:00", queueSize: 44, processingRate: 96 },
  { time: "16:00", queueSize: 46, processingRate: 99 },
  { time: "17:00", queueSize: 38, processingRate: 87 },
  { time: "18:00", queueSize: 32, processingRate: 76 },
  { time: "19:00", queueSize: 28, processingRate: 65 },
  { time: "20:00", queueSize: 22, processingRate: 54 },
  { time: "21:00", queueSize: 18, processingRate: 43 },
  { time: "22:00", queueSize: 12, processingRate: 32 },
  { time: "23:00", queueSize: 8, processingRate: 18 },
];

export const processingTimeData: ProcessingTimeData[] = [
  { inputSize: "<1KB", avgTime: 120, p95: 250 },
  { inputSize: "1-10KB", avgTime: 180, p95: 380 },
  { inputSize: "10-100KB", avgTime: 320, p95: 680 },
  { inputSize: "100KB-1MB", avgTime: 580, p95: 1150 },
  { inputSize: ">1MB", avgTime: 920, p95: 1850 },
];
