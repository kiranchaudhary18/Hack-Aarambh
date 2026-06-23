import {
  TotalInstalls,
  InstallSource,
  InstallTrend,
  UninstallReason,
  VersionDistribution,
} from "../types/extension-monitoring";

export const totalInstalls: TotalInstalls = {
  chrome: 45234,
  firefox: 12890,
  total: 58124,
  change: "+12.5%",
};

export const installSources: InstallSource[] = [
  { source: "Chrome Web Store", count: 38900, percentage: 67, color: "var(--clay-blue)" },
  { source: "Firefox Add-ons", count: 11200, percentage: 19, color: "var(--clay-orange)" },
  { source: "Direct Download", count: 5200, percentage: 9, color: "var(--clay-purple)" },
  { source: "Referral", count: 2824, percentage: 5, color: "var(--clay-green)" },
];

export const installTrends: InstallTrend[] = [
  { date: "Jan 1", installs: 145, uninstalls: 12 },
  { date: "Jan 2", installs: 162, uninstalls: 15 },
  { date: "Jan 3", installs: 178, uninstalls: 18 },
  { date: "Jan 4", installs: 195, uninstalls: 14 },
  { date: "Jan 5", installs: 212, uninstalls: 16 },
  { date: "Jan 6", installs: 198, uninstalls: 19 },
  { date: "Jan 7", installs: 225, uninstalls: 21 },
  { date: "Jan 8", installs: 245, uninstalls: 18 },
  { date: "Jan 9", installs: 268, uninstalls: 22 },
  { date: "Jan 10", installs: 285, uninstalls: 20 },
  { date: "Jan 11", installs: 298, uninstalls: 24 },
  { date: "Jan 12", installs: 315, uninstalls: 23 },
  { date: "Jan 13", installs: 332, uninstalls: 25 },
  { date: "Jan 14", installs: 348, uninstalls: 28 },
  { date: "Jan 15", installs: 365, uninstalls: 26 },
  { date: "Jan 16", installs: 382, uninstalls: 29 },
  { date: "Jan 17", installs: 395, uninstalls: 31 },
  { date: "Jan 18", installs: 418, uninstalls: 28 },
  { date: "Jan 19", installs: 435, uninstalls: 32 },
  { date: "Jan 20", installs: 452, uninstalls: 30 },
  { date: "Jan 21", installs: 468, uninstalls: 34 },
  { date: "Jan 22", installs: 485, uninstalls: 33 },
  { date: "Jan 23", installs: 502, uninstalls: 36 },
  { date: "Jan 24", installs: 518, uninstalls: 35 },
  { date: "Jan 25", installs: 535, uninstalls: 38 },
  { date: "Jan 26", installs: 552, uninstalls: 37 },
  { date: "Jan 27", installs: 568, uninstalls: 40 },
  { date: "Jan 28", installs: 585, uninstalls: 39 },
  { date: "Jan 29", installs: 602, uninstalls: 42 },
  { date: "Jan 30", installs: 618, uninstalls: 41 },
];

export const uninstallReasons: UninstallReason[] = [
  { reason: "Not needed anymore", count: 234, percentage: 35 },
  { reason: "Found alternative", count: 178, percentage: 27 },
  { reason: "Performance issues", count: 145, percentage: 22 },
  { reason: "Privacy concerns", count: 67, percentage: 10 },
  { reason: "Other", count: 42, percentage: 6 },
];

export const versionDistribution: VersionDistribution[] = [
  { version: "2.4.1", count: 28500, percentage: 49, status: "stable" },
  { version: "2.4.0", count: 15200, percentage: 26, status: "stable" },
  { version: "2.3.5", count: 8900, percentage: 15, status: "deprecated" },
  { version: "2.5.0 (beta)", count: 5524, percentage: 10, status: "beta" },
];
