import {
  ServerUptime,
  ServiceHealth,
  Incident,
  SLAMonitoring,
} from "../types/server-monitoring";

export const serverUptime: ServerUptime = {
  current: "15d 4h 32m",
  historical: [
    { date: "Jan 1", uptime: 99.98 },
    { date: "Jan 2", uptime: 99.95 },
    { date: "Jan 3", uptime: 100.0 },
    { date: "Jan 4", uptime: 99.92 },
    { date: "Jan 5", uptime: 99.97 },
    { date: "Jan 6", uptime: 100.0 },
    { date: "Jan 7", uptime: 99.98 },
    { date: "Jan 8", uptime: 99.95 },
    { date: "Jan 9", uptime: 100.0 },
    { date: "Jan 10", uptime: 99.94 },
    { date: "Jan 11", uptime: 99.96 },
    { date: "Jan 12", uptime: 99.98 },
    { date: "Jan 13", uptime: 100.0 },
    { date: "Jan 14", uptime: 99.97 },
    { date: "Jan 15", uptime: 99.95 },
    { date: "Jan 16", uptime: 99.98 },
    { date: "Jan 17", uptime: 99.96 },
    { date: "Jan 18", uptime: 100.0 },
    { date: "Jan 19", uptime: 99.94 },
    { date: "Jan 20", uptime: 99.97 },
    { date: "Jan 21", uptime: 99.95 },
    { date: "Jan 22", uptime: 99.98 },
    { date: "Jan 23", uptime: 99.96 },
    { date: "Jan 24", uptime: 100.0 },
    { date: "Jan 25", uptime: 99.97 },
    { date: "Jan 26", uptime: 99.95 },
    { date: "Jan 27", uptime: 99.98 },
    { date: "Jan 28", uptime: 99.96 },
    { date: "Jan 29", uptime: 100.0 },
    { date: "Jan 30", uptime: 99.97 },
  ],
};

export const serviceHealth: ServiceHealth[] = [
  { service: "NestJS API", status: "healthy", responseTime: 45, lastCheck: "2s ago" },
  { service: "PostgreSQL", status: "healthy", responseTime: 12, lastCheck: "3s ago" },
  { service: "Python AI Engine", status: "healthy", responseTime: 180, lastCheck: "2s ago" },
  { service: "Redis", status: "healthy", responseTime: 5, lastCheck: "2s ago" },
  { service: "Nginx", status: "healthy", responseTime: 8, lastCheck: "3s ago" },
];

export const incidents: Incident[] = [
  {
    id: "INC-001",
    type: "Database Connection Pool Exhaustion",
    severity: "high",
    startTime: "2024-01-15 14:32:00",
    endTime: "2024-01-15 14:45:00",
    duration: "13m",
    description: "Connection pool reached maximum capacity due to spike in traffic",
  },
  {
    id: "INC-002",
    type: "AI Engine Latency Spike",
    severity: "medium",
    startTime: "2024-01-18 10:15:00",
    endTime: "2024-01-18 10:28:00",
    duration: "13m",
    description: "GPU utilization spike caused increased inference latency",
  },
  {
    id: "INC-003",
    type: "Memory Warning",
    severity: "low",
    startTime: "2024-01-20 08:45:00",
    endTime: "2024-01-20 09:02:00",
    duration: "17m",
    description: "Memory usage exceeded 85% threshold",
  },
];

export const slaMonitoring: SLAMonitoring[] = [
  { service: "API Availability", target: 99.9, current: 99.97, period: "30 days", status: "on-track" },
  { service: "Database Uptime", target: 99.95, current: 99.98, period: "30 days", status: "on-track" },
  { service: "API Response Time", target: 200, current: 185, period: "24 hours", status: "on-track" },
  { service: "Error Rate", target: 1.0, current: 0.8, period: "24 hours", status: "on-track" },
];
