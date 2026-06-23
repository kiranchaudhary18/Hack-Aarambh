// Alerts & Incidents TypeScript Interfaces

// Alert History
export interface AlertHistory {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  assignedTo?: string;
}

export interface AlertStats {
  total: number;
  active: number;
  resolved: number;
  critical: number;
}

// Incident Management
export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  resolvedAt?: string;
  downtime: number; // in minutes
  assignedTo: string;
  affectedServices: string[];
}

export interface IncidentStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResolutionTime: number;
}

// Alert Configuration
export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  condition: ">" | "<" | "=" | ">=" | "<=";
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  channels: string[];
}

export interface AlertChannel {
  id: string;
  name: string;
  type: "email" | "slack" | "sms" | "webhook";
  enabled: boolean;
  config: Record<string, any>;
}
