export class TrafficMetricDto {
  pageViews!: number;
  uniqueVisitors!: number;
  sessions!: number;
  bounceRate!: number;
  avgSessionDuration!: number;
}

export class ErrorMetricDto {
  errorType!: string;
  count!: number;
  percentage!: number;
  lastOccurred!: Date;
}

export class PerformanceMetricDto {
  avgLoadTime!: number;
  firstContentfulPaint!: number;
  largestContentfulPaint!: number;
  cumulativeLayoutShift!: number;
  firstInputDelay!: number;
}
