export class ServerResourceDto {
  label!: string;
  value!: number;
  unit!: string;
  percentage!: number;
  status!: 'healthy' | 'warning' | 'critical';
}

export class ResourcesDto {
  cpu!: ServerResourceDto;
  memory!: ServerResourceDto;
  disk!: ServerResourceDto;
  network!: ServerResourceDto;
}

export class APIMetricDto {
  endpoint!: string;
  avgLatency!: number;
  p95Latency!: number;
  p99Latency!: number;
  requestCount!: number;
  errorRate!: number;
}

export class APIMetricsDto {
  overallLatency!: number;
  totalRequests!: number;
  errorRate!: number;
  endpoints!: APIMetricDto[];
}

export class DatabaseHealthDto {
  connectionPool!: number;
  activeConnections!: number;
  queryLatency!: number;
  status!: 'healthy' | 'warning' | 'critical';
}

export class UptimeDto {
  uptime!: number;
  lastRestart!: Date;
  status!: 'healthy' | 'warning' | 'critical';
}
