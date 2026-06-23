export class AdminStatsDto {
  totalScans!: number;
  scamsDetected!: number;
  activeUsers!: number;
  savedDollars!: number;
  todayScans!: number;
  weeklyNewUsers!: number;
  scamRate!: number;
}

export class LiveFeedItemDto {
  type!: string;
  description!: string;
  color!: string;
  ago!: string;
}

export class RegionDto {
  location!: string;
  percentage!: number;
  color!: string;
}

export class SystemHealthMetricDto {
  label!: string;
  value!: string;
  status!: 'healthy' | 'warning' | 'critical';
}
