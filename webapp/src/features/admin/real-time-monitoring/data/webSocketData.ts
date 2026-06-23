import {
  LiveDashboard,
  RealTimeNotification,
  LiveUserCount,
  AlertDelivery,
} from "../types/real-time-monitoring";

export const liveDashboard: LiveDashboard = {
  connected: true,
  lastUpdate: "2 seconds ago",
  updateCount: 15234,
};

export const realTimeNotifications: RealTimeNotification[] = [
  { id: "N-001", type: "alert", message: "CPU usage above 80%", timestamp: "1 minute ago", read: false },
  { id: "N-002", type: "info", message: "New user registered", timestamp: "2 minutes ago", read: true },
  { id: "N-003", type: "warning", message: "API latency spike detected", timestamp: "5 minutes ago", read: true },
  { id: "N-004", type: "alert", message: "Memory usage above 90%", timestamp: "10 minutes ago", read: false },
  { id: "N-005", type: "info", message: "Extension installed", timestamp: "15 minutes ago", read: true },
];

export const liveUserCount: LiveUserCount = {
  current: 4523,
  peak: 5678,
  change: "+12.5%",
};

export const alertDelivery: AlertDelivery[] = [
  { alertId: "A-001", delivered: true, deliveryTime: "2 seconds ago", recipients: 5 },
  { alertId: "A-002", delivered: true, deliveryTime: "5 seconds ago", recipients: 8 },
  { alertId: "A-003", delivered: true, deliveryTime: "10 seconds ago", recipients: 3 },
  { alertId: "A-004", delivered: false, deliveryTime: "pending", recipients: 12 },
  { alertId: "A-005", delivered: true, deliveryTime: "15 seconds ago", recipients: 6 },
];
