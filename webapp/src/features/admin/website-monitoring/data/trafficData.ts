import { TrafficOverview, VisitorData, PageViewData, TrafficSourceData, BounceRateData, ConversionFunnelData } from "../types/website-monitoring";

export const trafficOverview: TrafficOverview = {
  realTimeVisitors: 1247,
  pageViewsPerSession: 4.2,
  totalSessionsToday: 8432,
  bounceRate: 32.4,
  visitorsChange: "+12.5%",
  sessionsChange: "+8.3%",
  bounceRateChange: "-2.1%",
};

export const visitorData: VisitorData[] = [
  { time: "00:00", visitors: 234 },
  { time: "01:00", visitors: 189 },
  { time: "02:00", visitors: 145 },
  { time: "03:00", visitors: 123 },
  { time: "04:00", visitors: 98 },
  { time: "05:00", visitors: 87 },
  { time: "06:00", visitors: 156 },
  { time: "07:00", visitors: 234 },
  { time: "08:00", visitors: 345 },
  { time: "09:00", visitors: 567 },
  { time: "10:00", visitors: 789 },
  { time: "11:00", visitors: 923 },
  { time: "12:00", visitors: 1056 },
  { time: "13:00", visitors: 1123 },
  { time: "14:00", visitors: 1089 },
  { time: "15:00", visitors: 1156 },
  { time: "16:00", visitors: 1234 },
  { time: "17:00", visitors: 1189 },
  { time: "18:00", visitors: 1098 },
  { time: "19:00", visitors: 987 },
  { time: "20:00", visitors: 876 },
  { time: "21:00", visitors: 765 },
  { time: "22:00", visitors: 654 },
  { time: "23:00", visitors: 892 },
];

export const pageViewData: PageViewData[] = [
  { page: "/home", views: 4521, heat: "high" },
  { page: "/analyze", views: 3245, heat: "high" },
  { page: "/dashboard", views: 2187, heat: "medium" },
  { page: "/history", views: 1543, heat: "medium" },
  { page: "/patterns", views: 987, heat: "low" },
  { page: "/awareness", views: 654, heat: "low" },
  { page: "/settings", views: 432, heat: "low" },
  { page: "/profile", views: 321, heat: "low" },
];

export const trafficSourceData: TrafficSourceData[] = [
  { source: "Direct", count: 4234, percentage: 42, color: "var(--clay-purple)" },
  { source: "Organic Search", count: 3123, percentage: 31, color: "var(--clay-blue)" },
  { source: "Referral", count: 1876, percentage: 19, color: "var(--clay-green)" },
  { source: "Social", count: 765, percentage: 8, color: "var(--clay-pink)" },
];

export const bounceRateData: BounceRateData[] = [
  { date: "Jan 1", rate: 35.2 },
  { date: "Jan 2", rate: 34.8 },
  { date: "Jan 3", rate: 33.2 },
  { date: "Jan 4", rate: 34.5 },
  { date: "Jan 5", rate: 33.8 },
  { date: "Jan 6", rate: 32.9 },
  { date: "Jan 7", rate: 33.5 },
  { date: "Jan 8", rate: 32.8 },
  { date: "Jan 9", rate: 33.1 },
  { date: "Jan 10", rate: 32.4 },
  { date: "Jan 11", rate: 33.0 },
  { date: "Jan 12", rate: 32.7 },
  { date: "Jan 13", rate: 33.3 },
  { date: "Jan 14", rate: 32.9 },
  { date: "Jan 15", rate: 32.5 },
  { date: "Jan 16", rate: 33.2 },
  { date: "Jan 17", rate: 32.8 },
  { date: "Jan 18", rate: 32.6 },
  { date: "Jan 19", rate: 33.0 },
  { date: "Jan 20", rate: 32.4 },
  { date: "Jan 21", rate: 32.7 },
  { date: "Jan 22", rate: 32.5 },
  { date: "Jan 23", rate: 32.9 },
  { date: "Jan 24", rate: 32.6 },
  { date: "Jan 25", rate: 32.8 },
  { date: "Jan 26", rate: 32.4 },
  { date: "Jan 27", rate: 32.5 },
  { date: "Jan 28", rate: 32.7 },
  { date: "Jan 29", rate: 32.6 },
  { date: "Jan 30", rate: 32.4 },
];

export const conversionFunnelData: ConversionFunnelData[] = [
  { stage: "Homepage Visitors", count: 10000, percentage: 100 },
  { stage: "Sign Up", count: 3456, percentage: 34.6 },
  { stage: "First Scan", count: 2876, percentage: 28.8 },
  { stage: "Return Visit", count: 1234, percentage: 12.3 },
];
