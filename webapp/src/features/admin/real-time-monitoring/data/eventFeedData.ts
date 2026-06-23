import {
  LiveEvent,
  UserRegistration,
  ScanCompletion,
  ScamDetection,
  ExtensionInstall,
  APIError,
  SystemAlert,
} from "../types/real-time-monitoring";

export const liveEvents: LiveEvent[] = [
  { id: "1", type: "user_registration", timestamp: "2 seconds ago", details: "New user registered: user@example.com", severity: "low" },
  { id: "2", type: "scan_completion", timestamp: "5 seconds ago", details: "Scan completed: text scan - safe", severity: "low" },
  { id: "3", type: "scam_detection", timestamp: "12 seconds ago", details: "Scam detected: job scam with 95% confidence", severity: "high" },
  { id: "4", type: "extension_install", timestamp: "18 seconds ago", details: "Extension installed on Chrome v120", severity: "low" },
  { id: "5", type: "api_error", timestamp: "25 seconds ago", details: "API error: /api/scan returned 500", severity: "medium" },
  { id: "6", type: "system_alert", timestamp: "32 seconds ago", details: "System alert: CPU usage above 80%", severity: "high" },
  { id: "7", type: "user_registration", timestamp: "45 seconds ago", details: "New user registered: test@example.com", severity: "low" },
  { id: "8", type: "scan_completion", timestamp: "52 seconds ago", details: "Scan completed: PDF scan - suspicious", severity: "medium" },
  { id: "9", type: "scam_detection", timestamp: "1 minute ago", details: "Scam detected: phishing link with 88% confidence", severity: "high" },
  { id: "10", type: "api_error", timestamp: "1 minute ago", details: "API error: /api/history timeout", severity: "medium" },
];

export const userRegistrations: UserRegistration[] = [
  { userId: "USR-001", email: "user@example.com", timestamp: "2 seconds ago", source: "organic" },
  { userId: "USR-002", email: "test@example.com", timestamp: "45 seconds ago", source: "referral" },
  { userId: "USR-003", email: "demo@example.com", timestamp: "2 minutes ago", source: "direct" },
  { userId: "USR-004", email: "new@example.com", timestamp: "3 minutes ago", source: "social" },
  { userId: "USR-005", email: "guest@example.com", timestamp: "5 minutes ago", source: "organic" },
];

export const scanCompletions: ScanCompletion[] = [
  { scanId: "S-001", type: "text", result: "safe", duration: 1250, timestamp: "5 seconds ago" },
  { scanId: "S-002", type: "pdf", result: "suspicious", duration: 2450, timestamp: "52 seconds ago" },
  { scanId: "S-003", type: "image", result: "safe", duration: 1850, timestamp: "2 minutes ago" },
  { scanId: "S-004", type: "text", result: "scam", duration: 1680, timestamp: "3 minutes ago" },
  { scanId: "S-005", type: "pdf", result: "safe", duration: 2100, timestamp: "5 minutes ago" },
];

export const scamDetections: ScamDetection[] = [
  { scanId: "S-004", scamType: "job scam", confidence: 95, timestamp: "12 seconds ago", details: "Fake job posting detected" },
  { scanId: "S-006", scamType: "phishing", confidence: 88, timestamp: "1 minute ago", details: "Malicious link detected" },
  { scanId: "S-007", scamType: "investment scam", confidence: 92, timestamp: "2 minutes ago", details: "Ponzi scheme detected" },
  { scanId: "S-008", scamType: "romance scam", confidence: 85, timestamp: "4 minutes ago", details: "Fake profile detected" },
  { scanId: "S-009", scamType: "lottery scam", confidence: 90, timestamp: "6 minutes ago", details: "Fake lottery detected" },
];

export const extensionInstalls: ExtensionInstall[] = [
  { userId: "USR-001", browser: "Chrome", version: "120", timestamp: "18 seconds ago" },
  { userId: "USR-002", browser: "Firefox", version: "121", timestamp: "2 minutes ago" },
  { userId: "USR-003", browser: "Chrome", version: "119", timestamp: "5 minutes ago" },
  { userId: "USR-004", browser: "Chrome", version: "120", timestamp: "8 minutes ago" },
  { userId: "USR-005", browser: "Firefox", version: "120", timestamp: "12 minutes ago" },
];

export const apiErrors: APIError[] = [
  { endpoint: "/api/scan", error: "Internal Server Error", statusCode: 500, timestamp: "25 seconds ago" },
  { endpoint: "/api/history", error: "Request Timeout", statusCode: 504, timestamp: "1 minute ago" },
  { endpoint: "/api/user", error: "Bad Request", statusCode: 400, timestamp: "3 minutes ago" },
  { endpoint: "/api/report", error: "Service Unavailable", statusCode: 503, timestamp: "7 minutes ago" },
  { endpoint: "/api/scan", error: "Rate Limit Exceeded", statusCode: 429, timestamp: "10 minutes ago" },
];

export const systemAlerts: SystemAlert[] = [
  { alertType: "CPU Usage", message: "CPU usage above 80%", severity: "high", timestamp: "32 seconds ago" },
  { alertType: "Memory", message: "Memory usage above 90%", severity: "critical", timestamp: "2 minutes ago" },
  { alertType: "Database", message: "Connection pool exhaustion", severity: "critical", timestamp: "5 minutes ago" },
  { alertType: "API", message: "API latency spike detected", severity: "high", timestamp: "8 minutes ago" },
  { alertType: "Extension", message: "Extension error rate spike", severity: "medium", timestamp: "15 minutes ago" },
];
