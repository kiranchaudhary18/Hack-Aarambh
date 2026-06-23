import {
  ActiveUsers,
  SessionDuration,
  FeatureUsage,
  ToolbarClicks,
  ContextMenuUsage,
} from "../types/extension-monitoring";

export const activeUsers: ActiveUsers = {
  dau: 4523,
  wau: 12890,
  mau: 34567,
  dauChange: "+8.5%",
  wauChange: "+12.2%",
  mauChange: "+15.8%",
};

export const sessionDuration: SessionDuration = {
  avgDuration: 245,
  medianDuration: 198,
  change: "+5.2%",
};

export const featureUsage: FeatureUsage[] = [
  { feature: "Scan Job", usage: 8523, change: "+12.5%" },
  { feature: "Crop Image", usage: 4521, change: "+8.2%" },
  { feature: "Settings", usage: 2345, change: "+5.8%" },
  { feature: "History", usage: 1890, change: "+3.2%" },
  { feature: "Report", usage: 1234, change: "+7.5%" },
  { feature: "Help", usage: 567, change: "+2.1%" },
];

export const toolbarClicks: ToolbarClicks[] = [
  { date: "Jan 1", clicks: 1234 },
  { date: "Jan 2", clicks: 1345 },
  { date: "Jan 3", clicks: 1456 },
  { date: "Jan 4", clicks: 1567 },
  { date: "Jan 5", clicks: 1678 },
  { date: "Jan 6", clicks: 1589 },
  { date: "Jan 7", clicks: 1701 },
  { date: "Jan 8", clicks: 1812 },
  { date: "Jan 9", clicks: 1923 },
  { date: "Jan 10", clicks: 2034 },
  { date: "Jan 11", clicks: 2145 },
  { date: "Jan 12", clicks: 2256 },
  { date: "Jan 13", clicks: 2367 },
  { date: "Jan 14", clicks: 2478 },
  { date: "Jan 15", clicks: 2589 },
  { date: "Jan 16", clicks: 2500 },
  { date: "Jan 17", clicks: 2611 },
  { date: "Jan 18", clicks: 2722 },
  { date: "Jan 19", clicks: 2833 },
  { date: "Jan 20", clicks: 2944 },
  { date: "Jan 21", clicks: 3055 },
  { date: "Jan 22", clicks: 3166 },
  { date: "Jan 23", clicks: 3277 },
  { date: "Jan 24", clicks: 3388 },
  { date: "Jan 25", clicks: 3499 },
  { date: "Jan 26", clicks: 3610 },
  { date: "Jan 27", clicks: 3721 },
  { date: "Jan 28", clicks: 3832 },
  { date: "Jan 29", clicks: 3943 },
  { date: "Jan 30", clicks: 4054 },
];

export const contextMenuUsage: ContextMenuUsage[] = [
  { action: "Scan Selection", count: 8523, percentage: 45 },
  { action: "Scan Link", count: 5678, percentage: 30 },
  { action: "Scan Image", count: 2834, percentage: 15 },
  { action: "Report", count: 1890, percentage: 10 },
];
