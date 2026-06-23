import {
  APIRequestRate,
  APIResponseTime,
  APIErrorRate,
  ActiveConnections,
  QueueStatus,
} from "../types/server-monitoring";

export const apiRequestRate: APIRequestRate[] = [
  { timestamp: "00:00", rpm: 120 },
  { timestamp: "01:00", rpm: 85 },
  { timestamp: "02:00", rpm: 52 },
  { timestamp: "03:00", rpm: 38 },
  { timestamp: "04:00", rpm: 28 },
  { timestamp: "05:00", rpm: 45 },
  { timestamp: "06:00", rpm: 95 },
  { timestamp: "07:00", rpm: 185 },
  { timestamp: "08:00", rpm: 320 },
  { timestamp: "09:00", rpm: 485 },
  { timestamp: "10:00", rpm: 620 },
  { timestamp: "11:00", rpm: 740 },
  { timestamp: "12:00", rpm: 690 },
  { timestamp: "13:00", rpm: 665 },
  { timestamp: "14:00", rpm: 685 },
  { timestamp: "15:00", rpm: 710 },
  { timestamp: "16:00", rpm: 675 },
  { timestamp: "17:00", rpm: 595 },
  { timestamp: "18:00", rpm: 495 },
  { timestamp: "19:00", rpm: 395 },
  { timestamp: "20:00", rpm: 315 },
  { timestamp: "21:00", rpm: 245 },
  { timestamp: "22:00", rpm: 185 },
  { timestamp: "23:00", rpm: 135 },
];

export const apiResponseTime: APIResponseTime[] = [
  { endpoint: "/api/scan", p50: 180, p95: 380, p99: 650, avg: 245 },
  { endpoint: "/api/analytics", p50: 120, p95: 280, p99: 520, avg: 185 },
  { endpoint: "/api/history", p50: 95, p95: 220, p99: 420, avg: 155 },
  { endpoint: "/api/auth/login", p50: 145, p95: 320, p99: 580, avg: 210 },
  { endpoint: "/api/auth/signup", p50: 165, p95: 350, p99: 620, avg: 235 },
];

export const apiErrorRate: APIErrorRate[] = [
  { timestamp: "00:00", rate4xx: 0.8, rate5xx: 0.2, totalErrors: 12 },
  { timestamp: "01:00", rate4xx: 0.6, rate5xx: 0.1, totalErrors: 6 },
  { timestamp: "02:00", rate4xx: 0.4, rate5xx: 0.1, totalErrors: 3 },
  { timestamp: "03:00", rate4xx: 0.3, rate5xx: 0.0, totalErrors: 1 },
  { timestamp: "04:00", rate4xx: 0.2, rate5xx: 0.0, totalErrors: 1 },
  { timestamp: "05:00", rate4xx: 0.4, rate5xx: 0.1, totalErrors: 2 },
  { timestamp: "06:00", rate4xx: 0.7, rate5xx: 0.2, totalErrors: 7 },
  { timestamp: "07:00", rate4xx: 1.2, rate5xx: 0.3, totalErrors: 28 },
  { timestamp: "08:00", rate4xx: 1.8, rate5xx: 0.4, totalErrors: 58 },
  { timestamp: "09:00", rate4xx: 2.1, rate5xx: 0.5, totalErrors: 102 },
  { timestamp: "10:00", rate4xx: 2.4, rate5xx: 0.6, totalErrors: 149 },
  { timestamp: "11:00", rate4xx: 2.6, rate5xx: 0.7, totalErrors: 185 },
  { timestamp: "12:00", rate4xx: 2.3, rate5xx: 0.5, totalErrors: 159 },
  { timestamp: "13:00", rate4xx: 2.2, rate5xx: 0.5, totalErrors: 146 },
  { timestamp: "14:00", rate4xx: 2.4, rate5xx: 0.6, totalErrors: 165 },
  { timestamp: "15:00", rate4xx: 2.5, rate5xx: 0.6, totalErrors: 178 },
  { timestamp: "16:00", rate4xx: 2.3, rate5xx: 0.5, totalErrors: 155 },
  { timestamp: "17:00", rate4xx: 2.0, rate5xx: 0.4, totalErrors: 119 },
  { timestamp: "18:00", rate4xx: 1.7, rate5xx: 0.3, totalErrors: 84 },
  { timestamp: "19:00", rate4xx: 1.4, rate5xx: 0.3, totalErrors: 55 },
  { timestamp: "20:00", rate4xx: 1.1, rate5xx: 0.2, totalErrors: 35 },
  { timestamp: "21:00", rate4xx: 0.9, rate5xx: 0.2, totalErrors: 22 },
  { timestamp: "22:00", rate4xx: 0.7, rate5xx: 0.1, totalErrors: 13 },
  { timestamp: "23:00", rate4xx: 0.5, rate5xx: 0.1, totalErrors: 7 },
];

export const activeConnections: ActiveConnections = {
  http: 567,
  websocket: 234,
  total: 801,
};

export const queueStatus: QueueStatus[] = [
  { queueName: "scan-queue", depth: 45, processingRate: 12, avgWaitTime: 3.8 },
  { queueName: "notification-queue", depth: 12, processingRate: 25, avgWaitTime: 0.5 },
  { queueName: "analytics-queue", depth: 8, processingRate: 18, avgWaitTime: 0.4 },
  { queueName: "email-queue", depth: 23, processingRate: 8, avgWaitTime: 2.9 },
];
