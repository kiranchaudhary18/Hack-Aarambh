export interface MetricsUpdateEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface AlertEvent {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: Date;
}

export interface SubscriptionEvent {
  message: string;
  timestamp: Date;
}

export const MonitoringEvents = {
  METRICS_UPDATE: 'metrics-update',
  ALERT: 'alert',
  SUBSCRIBE_METRICS: 'subscribe-metrics',
  UNSUBSCRIBE_METRICS: 'unsubscribe-metrics',
} as const;
