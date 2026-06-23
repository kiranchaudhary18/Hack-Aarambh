import { ModelVersion, DataDriftMetric, FeatureImportance, RetrainingTrigger } from "../types/ai-model-monitoring";

export const modelVersions: ModelVersion[] = [
  { version: "v2.4.1", deployedDate: "2024-01-15", accuracy: 94.7, status: "active" },
  { version: "v2.4.0", deployedDate: "2024-01-01", accuracy: 94.2, status: "deprecated" },
  { version: "v2.3.5", deployedDate: "2023-12-15", accuracy: 93.8, status: "deprecated" },
  { version: "v2.3.0", deployedDate: "2023-12-01", accuracy: 93.5, status: "deprecated" },
  { version: "v2.5.0", deployedDate: "2024-01-28", accuracy: 95.1, status: "testing" },
];

export const dataDriftMetrics: DataDriftMetric[] = [
  { feature: "Job Title", driftScore: 0.12, status: "normal" },
  { feature: "Company Name", driftScore: 0.18, status: "normal" },
  { feature: "Salary Range", driftScore: 0.24, status: "warning" },
  { feature: "Job Description", driftScore: 0.15, status: "normal" },
  { feature: "Location", driftScore: 0.09, status: "normal" },
  { feature: "Requirements", driftScore: 0.32, status: "critical" },
  { feature: "Contact Info", driftScore: 0.11, status: "normal" },
];

export const featureImportance: FeatureImportance[] = [
  { feature: "Job Title Similarity", importance: 0.92, change: "+0.02" },
  { feature: "Company Domain Check", importance: 0.88, change: "+0.01" },
  { feature: "Salary Anomaly", importance: 0.85, change: "-0.03" },
  { feature: "Urgency Keywords", importance: 0.82, change: "+0.05" },
  { feature: "Contact Pattern", importance: 0.78, change: "+0.02" },
  { feature: "Description Length", importance: 0.72, change: "-0.01" },
  { feature: "Location Mismatch", importance: 0.68, change: "+0.04" },
];

export const retrainingTriggers: RetrainingTrigger[] = [
  {
    trigger: "Accuracy Drop >2%",
    status: "inactive",
    lastChecked: "2 hours ago",
    threshold: "92%",
    currentValue: "94.7%",
  },
  {
    trigger: "Data Drift >0.3",
    status: "triggered",
    lastChecked: "1 hour ago",
    threshold: "0.3",
    currentValue: "0.32",
  },
  {
    trigger: "FPR Increase >1%",
    status: "inactive",
    lastChecked: "2 hours ago",
    threshold: "3%",
    currentValue: "2.3%",
  },
  {
    trigger: "FNR Increase >1%",
    status: "inactive",
    lastChecked: "2 hours ago",
    threshold: "4%",
    currentValue: "3.0%",
  },
  {
    trigger: "Weekly Schedule",
    status: "active",
    lastChecked: "1 day ago",
    threshold: "Sunday",
    currentValue: "Next: Sunday",
  },
];
