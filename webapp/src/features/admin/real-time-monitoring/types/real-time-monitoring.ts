// Real-Time Event Monitoring TypeScript Interfaces

// Live Event Feed
export interface LiveEvent {
  id: string;
  type: "user_registration" | "scan_completion" | "scam_detection" | "extension_install" | "api_error" | "system_alert";
  timestamp: string;
  details: string;
  severity?: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, any>;
}

export interface UserRegistration {
  userId: string;
  email: string;
  timestamp: string;
  source: string;
}

export interface ScanCompletion {
  scanId: string;
  type: "text" | "pdf" | "image";
  result: "safe" | "suspicious" | "scam";
  duration: number;
  timestamp: string;
}

export interface ScamDetection {
  scanId: string;
  scamType: string;
  confidence: number;
  timestamp: string;
  details: string;
}

export interface ExtensionInstall {
  userId: string;
  browser: string;
  version: string;
  timestamp: string;
}

export interface APIError {
  endpoint: string;
  error: string;
  statusCode: number;
  timestamp: string;
}

export interface SystemAlert {
  alertType: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
}

// Real-time Alerts
export interface AlertThreshold {
  metric: string;
  threshold: number;
  currentValue: number;
  status: "normal" | "warning" | "critical";
  lastTriggered: string;
}

export interface ScamDetectionRate {
  currentRate: number;
  threshold: number;
  trend: number;
  lastUpdated: string;
}

export interface APILatencySpike {
  endpoint: string;
  currentLatency: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
}

export interface ServerCPU {
  current: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
}

export interface MemoryUsage {
  current: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
}

export interface ConnectionPoolStatus {
  active: number;
  max: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
}

export interface ExtensionErrorRate {
  currentRate: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
}

export interface ModelAccuracy {
  currentAccuracy: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
}

// WebSocket Integration
export interface LiveDashboard {
  connected: boolean;
  lastUpdate: string;
  updateCount: number;
}

export interface RealTimeNotification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface LiveUserCount {
  current: number;
  peak: number;
  change: string;
}

export interface AlertDelivery {
  alertId: string;
  delivered: boolean;
  deliveryTime: string;
  recipients: number;
}
