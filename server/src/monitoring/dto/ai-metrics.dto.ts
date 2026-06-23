export class AIMetricDto {
  label!: string;
  value!: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'healthy' | 'warning' | 'critical';
}

export class AccuracyMetricsDto {
  overallAccuracy!: number;
  precision!: number;
  recall!: number;
  f1Score!: number;
  modelVersion!: string;
}

export class PerformanceMetricsDto {
  avgLatency!: number;
  p95Latency!: number;
  p99Latency!: number;
  throughput!: number;
  errorRate!: number;
}

export class ResourceMetricsDto {
  cpuUsage!: number;
  memoryUsage!: number;
  gpuUsage?: number;
  activeRequests!: number;
}

export class HealthMetricsDto {
  modelStatus!: 'healthy' | 'warning' | 'critical';
  lastCheck!: Date;
  uptime!: number;
  consecutiveErrors!: number;
}
