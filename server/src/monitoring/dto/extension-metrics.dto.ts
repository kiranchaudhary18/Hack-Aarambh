export class InstallationMetricDto {
  totalInstalls!: number;
  activeInstalls!: number;
  newInstalls!: number;
  churnRate!: number;
}

export class UsageMetricDto {
  dailyActiveUsers!: number;
  weeklyActiveUsers!: number;
  monthlyActiveUsers!: number;
  avgSessionDuration!: number;
}

export class RetentionMetricDto {
  day1Retention!: number;
  day7Retention!: number;
  day30Retention!: number;
  cohort!: string;
}

export class ErrorMetricDto {
  errorType!: string;
  count!: number;
  percentage!: number;
  trend!: 'up' | 'down' | 'stable';
}

export class PerformanceMetricDto {
  avgResponseTime!: number;
  p95ResponseTime!: number;
  successRate!: number;
  apiCalls!: number;
}
