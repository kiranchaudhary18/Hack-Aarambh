// Server Monitoring TypeScript Interfaces

// System Resources
export interface CPUUsage {
  current: number;
  average: number;
  perCore: number[];
  loadAverage: number[];
  stealTime: number;
  change: string;
}

export interface MemoryUsage {
  ram: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  swap: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  buffers: number;
  cache: number;
  change: string;
}

export interface DiskUsage {
  mount: string;
  total: number;
  used: number;
  free: number;
  percentage: number;
  iops: {
    read: number;
    write: number;
  };
  throughput: {
    read: number;
    write: number;
  };
}

export interface NetworkTraffic {
  timestamp: string;
  bandwidthIn: number;
  bandwidthOut: number;
  packetRateIn: number;
  packetRateOut: number;
  connections: number;
}

export interface ProcessStatus {
  name: string;
  pid: number;
  cpu: number;
  memory: number;
  status: "running" | "stopped" | "restarting";
  uptime: string;
}

// API Performance
export interface APIRequestRate {
  timestamp: string;
  rpm: number;
}

export interface APIResponseTime {
  endpoint: string;
  p50: number;
  p95: number;
  p99: number;
  avg: number;
}

export interface APIErrorRate {
  timestamp: string;
  rate4xx: number;
  rate5xx: number;
  totalErrors: number;
}

export interface ActiveConnections {
  http: number;
  websocket: number;
  total: number;
}

export interface QueueStatus {
  queueName: string;
  depth: number;
  processingRate: number;
  avgWaitTime: number;
}

// Database Health
export interface ConnectionPool {
  total: number;
  active: number;
  idle: number;
  waiting: number;
  max: number;
}

export interface QueryPerformance {
  query: string;
  avgTime: number;
  count: number;
  slowQueries: number;
}

export interface DatabaseSize {
  database: string;
  tables: number;
  indexes: number;
  size: number;
  growth: string;
}

export interface ReplicationLag {
  primary: string;
  replica: string;
  lag: number;
  status: "synced" | "lagging" | "critical";
}

// Uptime & Availability
export interface ServerUptime {
  current: string;
  historical: {
    date: string;
    uptime: number;
  }[];
}

export interface ServiceHealth {
  service: string;
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  lastCheck: string;
}

export interface Incident {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  startTime: string;
  endTime?: string;
  duration: string;
  description: string;
}

export interface SLAMonitoring {
  service: string;
  target: number;
  current: number;
  period: string;
  status: "on-track" | "at-risk" | "breached";
}
