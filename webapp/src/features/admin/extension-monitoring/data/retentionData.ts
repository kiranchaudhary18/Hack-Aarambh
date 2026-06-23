import {
  RetentionRate,
  CohortData,
  ChurnRate,
  ReturnFrequency,
} from "../types/extension-monitoring";

export const retentionRate: RetentionRate = {
  d1: 68.5,
  d7: 42.3,
  d30: 28.7,
};

export const cohortData: CohortData[] = [
  { cohortDate: "Jan 1", d1Retention: 65.2, d7Retention: 40.1, d30Retention: 26.5, users: 145 },
  { cohortDate: "Jan 8", d1Retention: 67.8, d7Retention: 41.5, d30Retention: 27.2, users: 178 },
  { cohortDate: "Jan 15", d1Retention: 69.2, d7Retention: 43.1, d30Retention: 28.9, users: 212 },
  { cohortDate: "Jan 22", d1Retention: 70.5, d7Retention: 44.8, d30Retention: 30.1, users: 245 },
  { cohortDate: "Jan 29", d1Retention: 71.8, d7Retention: 46.2, d30Retention: 31.5, users: 278 },
];

export const churnRate: ChurnRate = {
  daily: 2.3,
  weekly: 12.5,
  monthly: 28.7,
  change: "-1.2%",
};

export const returnFrequency: ReturnFrequency = {
  once: 15.2,
  weekly: 35.8,
  monthly: 32.5,
  daily: 16.5,
};
