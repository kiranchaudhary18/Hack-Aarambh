import { UserJourneyPath, GeoData, DeviceData, BrowserData } from "../types/website-monitoring";

export const userJourneyData: UserJourneyPath[] = [
  {
    path: ["home", "analyze", "result", "dashboard"],
    users: 1234,
    completionRate: 78,
  },
  {
    path: ["home", "patterns", "analyze", "result"],
    users: 876,
    completionRate: 65,
  },
  {
    path: ["home", "dashboard", "history"],
    users: 543,
    completionRate: 92,
  },
  {
    path: ["home", "analyze", "result", "history"],
    users: 432,
    completionRate: 71,
  },
  {
    path: ["home", "awareness", "patterns", "analyze"],
    users: 321,
    completionRate: 58,
  },
];

export const geoData: GeoData[] = [
  { country: "Pakistan", users: 3842, percentage: 38, flag: "🇵🇰" },
  { country: "India", users: 2734, percentage: 27, flag: "🇮🇳" },
  { country: "Nigeria", users: 1412, percentage: 14, flag: "🇳🇬" },
  { country: "Philippines", users: 1108, percentage: 11, flag: "🇵🇭" },
  { country: "United States", users: 605, percentage: 6, flag: "🇺🇸" },
  { country: "United Kingdom", users: 404, percentage: 4, flag: "🇬🇧" },
];

export const deviceData: DeviceData[] = [
  { type: "Desktop", count: 5432, percentage: 64, icon: "Monitor" },
  { type: "Mobile", count: 2876, percentage: 34, icon: "Smartphone" },
  { type: "Tablet", count: 187, percentage: 2, icon: "Tablet" },
];

export const browserData: BrowserData[] = [
  { name: "Chrome", count: 6234, percentage: 73 },
  { name: "Firefox", count: 1456, percentage: 17 },
  { name: "Safari", count: 605, percentage: 7 },
  { name: "Edge", count: 200, percentage: 3 },
];
