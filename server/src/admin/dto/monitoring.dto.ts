export class AIMetricsDto {
  accuracy!: number;
  precision!: number;
  recall!: number;
  f1Score!: number;
  timestamp!: Date;
}

export class AIPerformanceDto {
  avgLatency!: number;
  throughput!: number;
  errorRate!: number;
  timestamp!: Date;
}

export class AIResourceDto {
  cpuUsage!: number;
  memoryUsage!: number;
  gpuUsage?: number;
  timestamp!: Date;
}

export class AIHealthDto {
  status!: 'healthy' | 'degraded' | 'down';
  lastCheck!: Date;
  uptime!: number;
}

export class ServerResourceDto {
  cpuUsage!: number;
  memoryUsage!: number;
  diskUsage!: number;
  networkIn!: number;
  networkOut!: number;
  timestamp!: Date;
}

export class ServerAPIMetricsDto {
  totalRequests!: number;
  successRate!: number;
  avgResponseTime!: number;
  errorRate!: number;
  timestamp!: Date;
}

export class ServerDatabaseDto {
  connectionCount!: number;
  queryLatency!: number;
  activeConnections!: number;
  timestamp!: Date;
}

export class ServerUptimeDto {
  uptime!: number;
  lastRestart!: Date;
  availability!: number;
}

export class ExtensionInstallationDto {
  totalInstalls!: number;
  newInstalls!: number;
  uninstallations!: number;
  timestamp!: Date;
}

export class ExtensionUsageDto {
  activeUsers!: number;
  dailyScans!: number;
  avgScansPerUser!: number;
  timestamp!: Date;
}

export class ExtensionRetentionDto {
  day1Retention!: number;
  day7Retention!: number;
  day30Retention!: number;
  timestamp!: Date;
}

export class ExtensionErrorDto {
  totalErrors!: number;
  errorRate!: number;
  topErrors!: Array<{ message: string; count: number }>;
  timestamp!: Date;
}

export class ExtensionPerformanceDto {
  avgScanTime!: number;
  p95ScanTime!: number;
  p99ScanTime!: number;
  timestamp!: Date;
}

export class WebsiteTrafficDto {
  pageViews!: number;
  uniqueVisitors!: number;
  bounceRate!: number;
  avgSessionDuration!: number;
  timestamp!: Date;
}

export class WebsiteErrorDto {
  totalErrors!: number;
  errorRate!: number;
  topErrors!: Array<{ message: string; count: number }>;
  timestamp!: Date;
}

export class WebsitePerformanceDto {
  avgLoadTime!: number;
  p95LoadTime!: number;
  p99LoadTime!: number;
  timestamp!: Date;
}
