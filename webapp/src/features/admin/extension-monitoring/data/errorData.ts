import {
  ExtensionCrash,
  APIFailure,
  PermissionError,
  ContentScriptError,
  BackgroundWorkerError,
} from "../types/extension-monitoring";

export const extensionCrashes: ExtensionCrash[] = [
  { browser: "Chrome", version: "120", crashes: 234, users: 189 },
  { browser: "Chrome", version: "119", crashes: 156, users: 123 },
  { browser: "Firefox", version: "121", crashes: 89, users: 67 },
  { browser: "Firefox", version: "120", crashes: 45, users: 34 },
];

export const apiFailures: APIFailure[] = [
  { endpoint: "/api/scan", failures: 234, errorRate: 0.5 },
  { endpoint: "/api/report", failures: 123, errorRate: 0.8 },
  { endpoint: "/api/history", failures: 89, errorRate: 0.3 },
  { endpoint: "/api/user", failures: 45, errorRate: 0.2 },
];

export const permissionErrors: PermissionError[] = [
  { permission: "activeTab", errors: 456, users: 234 },
  { permission: "storage", errors: 234, users: 123 },
  { permission: "scripting", errors: 123, users: 67 },
  { permission: "tabs", errors: 89, users: 45 },
];

export const contentScriptErrors: ContentScriptError[] = [
  { domain: "linkedin.com", errors: 234, type: "Injection failed" },
  { domain: "indeed.com", errors: 189, type: "DOM access denied" },
  { domain: "glassdoor.com", errors: 145, type: "CORS error" },
  { domain: "monster.com", errors: 98, type: "Timeout" },
];

export const backgroundWorkerErrors: BackgroundWorkerError[] = [
  { error: "Service worker registration failed", count: 234, lastSeen: "2 hours ago" },
  { error: "Message port closed", count: 156, lastSeen: "5 hours ago" },
  { error: "Storage quota exceeded", count: 89, lastSeen: "1 day ago" },
  { error: "Network request failed", count: 67, lastSeen: "3 hours ago" },
];
